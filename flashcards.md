Build a feature that allows users to create personalized learning courses on any topic. The system collects user inputs (topic, goal, level, time commitment), then uses Claude API to generate a customized Duolingo-style learning plan with levels, lessons, and flashcards.

## Core User Flow

### Step 1: Topic Input
User enters a topic (e.g., "Machine Learning", "Spanish for Travel", "Personal Finance")

### Step 2: Personalization Questionnaire
System asks:
1. **Goal/Outcome:** "What do you want to achieve?" 
   - Free text input
   - Examples: "Build ML models for work", "Order food in Spanish", "Manage my investments"
   
2. **Current Level:** "What's your experience level?"
   - Beginner (No prior knowledge)
   - Intermediate (Some familiarity)
   - Advanced (Solid foundation, want to go deeper)
   
3. **Time Commitment:** "How much time can you dedicate?"
   - Frequency: Daily / 3x per week / Weekly
   - Duration per session: 5 min / 10 min / 15 min / 30 min
   - Total timeline: 1 week / 2 weeks / 1 month / 3 months / Self-paced

### Step 3: Course Generation
System generates:
- Course structure (levels and lessons)
- Estimated completion timeline
- First 2-3 lessons with complete flashcards
- Remaining lessons generated on-demand

### Step 4: Preview & Confirm
User sees:
- Course outline (all levels and lessons)
- Sample flashcard from first lesson
- Time estimate
- Can edit/regenerate before confirming

### Step 5: Start Learning
Course is saved to user's library, ready to begin

---

## Implementation Requirements

### Backend API Endpoints

```python
# 1. Create course request
POST /api/courses/generate
Request Body:
{
  "topic": str,
  "goal": str,
  "level": "beginner" | "intermediate" | "advanced",
  "frequency": "daily" | "3x_week" | "weekly",
  "duration_minutes": 5 | 10 | 15 | 30,
  "timeline_weeks": 1 | 2 | 4 | 12 | null (self-paced)
}

Response:
{
  "course_id": str,
  "status": "generating",
  "estimated_time_seconds": int
}

# 2. Check generation status
GET /api/courses/{course_id}/status

Response:
{
  "status": "generating" | "completed" | "failed",
  "progress_percentage": int,
  "current_step": str,
  "error_message": str | null
}

# 3. Get generated course
GET /api/courses/{course_id}

Response:
{
  "course_id": str,
  "title": str,
  "description": str,
  "user_id": int,
  "topic": str,
  "goal": str,
  "level": str,
  "time_commitment": {...},
  "estimated_hours": float,
  "created_at": timestamp,
  "structure": {
    "levels": [
      {
        "level_number": int,
        "title": str,
        "description": str,
        "lessons": [
          {
            "lesson_id": str,
            "title": str,
            "description": str,
            "estimated_minutes": int,
            "cards_count": int,
            "status": "generated" | "pending",
            "cards": [...] // Only for first 2-3 lessons
          }
        ]
      }
    ]
  }
}

# 4. Generate remaining lesson content (on-demand)
POST /api/courses/{course_id}/lessons/{lesson_id}/generate

Response:
{
  "lesson_id": str,
  "cards": [
    {
      "card_id": str,
      "type": "concept" | "definition" | "comparison" | "review",
      "question": str,
      "answer": str,
      "explanation": str,
      "key_terms": [str],
      "visual_description": str
    }
  ]
}

# 5. Regenerate specific lesson (if user unhappy)
POST /api/courses/{course_id}/lessons/{lesson_id}/regenerate

# 6. Save course to user library
POST /api/courses/{course_id}/save
```

---

## Database Schema

```sql
-- User-generated courses
CREATE TABLE user_courses (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  topic VARCHAR(255) NOT NULL,
  goal TEXT NOT NULL,
  level VARCHAR(50) NOT NULL,
  frequency VARCHAR(50),
  duration_minutes INT,
  timeline_weeks INT,
  estimated_hours FLOAT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed, archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL
);

-- Generated course structure
CREATE TABLE user_course_levels (
  id SERIAL PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES user_courses(id),
  level_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT,
  UNIQUE KEY(course_id, level_number)
);

CREATE TABLE user_course_lessons (
  id VARCHAR(50) PRIMARY KEY,
  level_id INT REFERENCES user_course_levels(id),
  lesson_number VARCHAR(10) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_minutes INT,
  cards_count INT DEFAULT 10,
  generation_status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
  order_index INT
);

CREATE TABLE user_course_cards (
  id VARCHAR(50) PRIMARY KEY,
  lesson_id VARCHAR(50) REFERENCES user_course_lessons(id),
  card_number INT NOT NULL,
  card_type VARCHAR(50) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  visual_type VARCHAR(50),
  visual_description TEXT,
  key_terms JSONB,
  order_index INT
);

-- Generation metadata
CREATE TABLE course_generation_logs (
  id SERIAL PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES user_courses(id),
  stage VARCHAR(100), -- structure, lesson_1, lesson_2, etc.
  status VARCHAR(50),
  input_prompt TEXT,
  output_response TEXT,
  error_message TEXT,
  tokens_used INT,
  generation_time_seconds FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Claude API Prompts

### Prompt 1: Generate Course Structure

```python
def generate_course_structure_prompt(topic: str, goal: str, level: str, 
                                     frequency: str, duration_minutes: int, 
                                     timeline_weeks: int) -> str:
    
    # Calculate total available time
    sessions_per_week = {"daily": 7, "3x_week": 3, "weekly": 1}[frequency]
    total_sessions = sessions_per_week * (timeline_weeks or 4)
    total_minutes = total_sessions * duration_minutes
    total_hours = total_minutes / 60
    
    return f"""You are an expert instructional designer creating a personalized learning course.

COURSE PARAMETERS:
- Topic: {topic}
- User's Goal: {goal}
- Current Level: {level}
- Time Commitment: {duration_minutes} minutes per session, {frequency}
- Timeline: {timeline_weeks} weeks ({total_hours:.1f} hours total)

TASK:
Create a structured learning plan with levels and lessons that:
1. Achieves the user's specific goal
2. Matches their current knowledge level
3. Fits within their time constraints
4. Follows Duolingo-style pedagogical principles (bite-sized, progressive, active recall)

STRUCTURE REQUIREMENTS:
- Levels: 3-6 levels (depending on topic complexity and time available)
- Lessons per level: 2-4 lessons
- Cards per lesson: 8-10 flashcards
- Total lessons should take approximately {total_hours:.1f} hours to complete
- Each lesson should take {duration_minutes} minutes

OUTPUT FORMAT (JSON):
{{
  "course_title": "Engaging title that reflects the goal",
  "course_description": "2-3 sentences about what the user will learn",
  "estimated_hours": float,
  "levels": [
    {{
      "level_number": 1,
      "title": "Short descriptive title",
      "description": "What this level covers",
      "lessons": [
        {{
          "lesson_number": "1.1",
          "title": "Specific lesson topic",
          "description": "1-2 sentences on what's covered",
          "estimated_minutes": {duration_minutes},
          "learning_objectives": ["Objective 1", "Objective 2"]
        }}
      ]
    }}
  ]
}}

IMPORTANT GUIDELINES:
1. Start with fundamentals, even for intermediate users (quick review)
2. Build concepts progressively - each lesson builds on previous
3. Final lessons should directly address the user's stated goal
4. Use action-oriented lesson titles (e.g., "Understanding Variables" not "Variables")
5. Ensure realistic time estimates - don't overpromise
6. For beginner level: more foundational content, slower progression
7. For advanced level: assume strong foundation, move to specialized/applied topics faster

Generate the complete course structure now:"""

### Prompt 2: Generate Lesson Content

def generate_lesson_content_prompt(course_context: dict, lesson: dict) -> str:
    return f"""You are creating flashcard content for a Duolingo-style learning app.

COURSE CONTEXT:
- Topic: {course_context['topic']}
- User Goal: {course_context['goal']}
- User Level: {course_context['level']}
- Lesson: {lesson['lesson_number']} - {lesson['title']}
- Description: {lesson['description']}
- Learning Objectives: {lesson['learning_objectives']}

TASK:
Create {lesson.get('cards_count', 10)} flashcards for this lesson.

FLASHCARD REQUIREMENTS:
1. Types to include (mix these):
   - Concept cards: Explain a single idea (60%)
   - Definition cards: Define key terms (20%)
   - Comparison cards: Show relationships (10%)
   - Review card: Summarize lesson (10%, always last card)

2. Each flashcard needs:
   - Clear question/prompt (front of card)
   - Concise answer (2-3 sentences max)
   - Engaging explanation or fun fact
   - 2-3 key terms
   - Visual description (what diagram/image would help)

3. Content guidelines:
   - Use simple, conversational language
   - Build on previous cards in the lesson
   - Include concrete examples and analogies
   - Add engaging context or real-world applications
   - Make it memorable (fun facts, surprising connections)
   - For {course_context['level']} level: {"Assume no background, explain everything" if course_context['level'] == 'beginner' else "Can reference foundational concepts" if course_context['level'] == 'intermediate' else "Can use technical language, focus on nuance"}

4. Card order:
   - Card 1: Most fundamental concept
   - Cards 2-9: Progressive building blocks
   - Card 10: Review card that tests comprehension

OUTPUT FORMAT (JSON):
{{
  "lesson_id": "{lesson['lesson_number']}",
  "cards": [
    {{
      "card_number": 1,
      "type": "concept",
      "question": "Question text here",
      "answer": "Clear, concise answer (2-3 sentences)",
      "explanation": "Fun fact or additional context that aids memory",
      "key_terms": ["term1", "term2"],
      "visual_type": "diagram" | "illustration" | "photo" | "animation" | "comparison" | "timeline",
      "visual_description": "Specific description of what visual would help (for designer/AI generation)"
    }}
  ]
}}

CRITICAL: Cards must directly support the learning objectives:
{chr(10).join('- ' + obj for obj in lesson['learning_objectives'])}

Generate all {lesson.get('cards_count', 10)} flashcards now:"""
```

---

## Frontend Components

### 1. Course Creation Wizard Component

```typescript
// pages/courses/create.tsx

interface CourseCreationState {
  step: 'topic' | 'personalization' | 'generating' | 'preview';
  topic: string;
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  frequency: 'daily' | '3x_week' | 'weekly';
  duration: 5 | 10 | 15 | 30;
  timeline: 1 | 2 | 4 | 12 | null;
  courseId?: string;
}

// Component structure:
// - TopicInput (Step 1)
// - PersonalizationForm (Step 2)
// - GenerationProgress (Step 3)
// - CoursePreview (Step 4)
```

### 2. Topic Input Screen

```typescript
// components/CourseCreation/TopicInput.tsx

// Features:
// - Large text input with placeholder examples
// - Autocomplete suggestions from popular topics
// - "Trending topics" section
// - "Continue" button disabled until topic entered
// - Character limit: 100 chars
```

### 3. Personalization Form

```typescript
// components/CourseCreation/PersonalizationForm.tsx

// Goal Input:
// - Multi-line text area (2-3 lines)
// - Placeholder: "I want to... (be specific about what you want to achieve)"
// - Character limit: 500 chars
// - Helper text: "The more specific, the better your course will be"

// Level Selection:
// - 3 large radio buttons with descriptions
// - Beginner: "I'm completely new to this topic"
// - Intermediate: "I know the basics, want to level up"
// - Advanced: "I have solid foundation, need specialized knowledge"

// Time Commitment:
// - Frequency: Dropdown or segmented control
// - Duration: Slider (5, 10, 15, 30 min marks)
// - Timeline: Dropdown (1 week, 2 weeks, 1 month, 3 months, self-paced)
// - Show calculated total time: "This will be ~X hours of content"

// Validation:
// - All fields required
// - "Generate Course" button at bottom
```

### 4. Generation Progress Screen

```typescript
// components/CourseCreation/GenerationProgress.tsx

// Features:
// - Animated loading indicator
// - Progress stages:
//   1. "Analyzing your goals..." (0-25%)
//   2. "Designing course structure..." (25-50%)
//   3. "Creating first lessons..." (50-90%)
//   4. "Finalizing your course..." (90-100%)
// - Estimated time remaining
// - "This usually takes 30-60 seconds"
// - Can't navigate away (warn if attempt)
// - Error handling with "Try Again" button
```

### 5. Course Preview Component

```typescript
// components/CourseCreation/CoursePreview.tsx

// Shows:
// - Course title and description
// - Level breakdown (expandable list)
// - Sample flashcard from first lesson
// - Time estimate badge
// - Actions:
//   - "Start Learning" (primary)
//   - "Regenerate Course" (secondary)
//   - "Edit Parameters" (link)

// Sample Card Display:
// - Interactive flip animation
// - Shows one card from lesson 1.1
// - "This is what your lessons will look like"
```

---

## Backend Implementation

### Course Generation Service

```python
# services/course_generator.py

import anthropic
import asyncio
from typing import Dict, List
import json

class CourseGeneratorService:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        
    async def generate_course(
        self,
        user_id: int,
        topic: str,
        goal: str,
        level: str,
        frequency: str,
        duration_minutes: int,
        timeline_weeks: int
    ) -> str:
        """
        Main orchestrator for course generation.
        Returns course_id immediately, generation happens in background.
        """
        # 1. Create course record
        course_id = generate_uuid()
        await db.execute(
            """INSERT INTO user_courses 
               (id, user_id, topic, goal, level, frequency, duration_minutes, 
                timeline_weeks, status)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'generating')""",
            course_id, user_id, topic, goal, level, frequency, 
            duration_minutes, timeline_weeks
        )
        
        # 2. Start background task
        asyncio.create_task(self._generate_course_content(
            course_id, topic, goal, level, frequency, 
            duration_minutes, timeline_weeks
        ))
        
        return course_id
    
    async def _generate_course_content(
        self, 
        course_id: str,
        topic: str,
        goal: str,
        level: str,
        frequency: str,
        duration_minutes: int,
        timeline_weeks: int
    ):
        """Background task that does the actual generation."""
        try:
            # Step 1: Generate structure
            await self._update_status(course_id, 'generating', 25, 
                                     'Designing course structure...')
            
            structure_prompt = generate_course_structure_prompt(
                topic, goal, level, frequency, duration_minutes, timeline_weeks
            )
            
            structure_response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4000,
                temperature=0.7,
                messages=[{
                    "role": "user",
                    "content": structure_prompt
                }]
            )
            
            structure = json.loads(structure_response.content[0].text)
            
            # Save structure to database
            await self._save_course_structure(course_id, structure)
            
            # Step 2: Generate first 2-3 lessons in detail
            lessons_to_generate = self._get_first_n_lessons(structure, n=3)
            
            for idx, lesson in enumerate(lessons_to_generate):
                progress = 50 + (idx / len(lessons_to_generate)) * 40
                await self._update_status(
                    course_id, 'generating', progress, 
                    f'Creating lesson {idx+1}/{len(lessons_to_generate)}...'
                )
                
                lesson_content = await self._generate_lesson_content(
                    course_id,
                    {
                        'topic': topic,
                        'goal': goal,
                        'level': level
                    },
                    lesson
                )
                
                await self._save_lesson_content(lesson['id'], lesson_content)
            
            # Step 3: Mark complete
            await self._update_status(course_id, 'completed', 100, 'Complete!')
            await db.execute(
                "UPDATE user_courses SET status = 'draft' WHERE id = $1",
                course_id
            )
            
        except Exception as e:
            await self._update_status(
                course_id, 'failed', 0, f'Error: {str(e)}'
            )
            raise
    
    async def _generate_lesson_content(
        self,
        course_id: str,
        course_context: Dict,
        lesson: Dict
    ) -> List[Dict]:
        """Generate flashcards for a specific lesson."""
        
        prompt = generate_lesson_content_prompt(course_context, lesson)
        
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=6000,
            temperature=0.7,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        # Log the generation
        await self._log_generation(
            course_id,
            f"lesson_{lesson['lesson_number']}",
            prompt,
            response.content[0].text,
            response.usage.input_tokens + response.usage.output_tokens
        )
        
        cards = json.loads(response.content[0].text)
        return cards['cards']
    
    async def generate_remaining_lesson(
        self,
        course_id: str,
        lesson_id: str
    ) -> List[Dict]:
        """Generate content for a lesson on-demand when user reaches it."""
        
        # Get course and lesson context
        course = await db.fetch_one(
            "SELECT * FROM user_courses WHERE id = $1", course_id
        )
        lesson = await db.fetch_one(
            "SELECT * FROM user_course_lessons WHERE id = $1", lesson_id
        )
        
        course_context = {
            'topic': course['topic'],
            'goal': course['goal'],
            'level': course['level']
        }
        
        # Generate
        cards = await self._generate_lesson_content(
            course_id, course_context, lesson
        )
        
        # Save
        await self._save_lesson_content(lesson_id, cards)
        
        return cards
```

### API Routes

```python
# routes/courses.py

from fastapi import APIRouter, Depends, HTTPException
from typing import Optional

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.post("/generate")
async def create_course(
    request: CourseGenerationRequest,
    user_id: int = Depends(get_current_user_id)
):
    """Initiate course generation."""
    
    # Validate inputs
    if not request.topic or len(request.topic) > 100:
        raise HTTPException(400, "Invalid topic")
    
    if not request.goal or len(request.goal) > 500:
        raise HTTPException(400, "Invalid goal")
    
    # Start generation
    generator = CourseGeneratorService()
    course_id = await generator.generate_course(
        user_id=user_id,
        topic=request.topic,
        goal=request.goal,
        level=request.level,
        frequency=request.frequency,
        duration_minutes=request.duration_minutes,
        timeline_weeks=request.timeline_weeks
    )
    
    return {
        "course_id": course_id,
        "status": "generating",
        "estimated_time_seconds": 60
    }

@router.get("/{course_id}/status")
async def get_generation_status(
    course_id: str,
    user_id: int = Depends(get_current_user_id)
):
    """Check generation progress."""
    
    # Verify ownership
    course = await db.fetch_one(
        """SELECT status, title, description 
           FROM user_courses 
           WHERE id = $1 AND user_id = $2""",
        course_id, user_id
    )
    
    if not course:
        raise HTTPException(404, "Course not found")
    
    # Get latest log entry
    log = await db.fetch_one(
        """SELECT status, stage 
           FROM course_generation_logs 
           WHERE course_id = $1 
           ORDER BY created_at DESC 
           LIMIT 1""",
        course_id
    )
    
    return {
        "status": course['status'],
        "progress_percentage": 100 if course['status'] == 'completed' else 50,
        "current_step": log['stage'] if log else "initializing"
    }

@router.get("/{course_id}")
async def get_course(
    course_id: str,
    user_id: int = Depends(get_current_user_id)
):
    """Get complete course structure and content."""
    
    # Get course
    course = await db.fetch_one(
        "SELECT * FROM user_courses WHERE id = $1 AND user_id = $2",
        course_id, user_id
    )
    
    if not course:
        raise HTTPException(404, "Course not found")
    
    # Get structure
    levels = await db.fetch_all(
        """SELECT l.*, 
                  array_agg(
                    json_build_object(
                      'lesson_id', les.id,
                      'lesson_number', les.lesson_number,
                      'title', les.title,
                      'description', les.description,
                      'estimated_minutes', les.estimated_minutes,
                      'cards_count', les.cards_count,
                      'generation_status', les.generation_status
                    )
                    ORDER BY les.order_index
                  ) as lessons
           FROM user_course_levels l
           LEFT JOIN user_course_lessons les ON les.level_id = l.id
           WHERE l.course_id = $1
           GROUP BY l.id
           ORDER BY l.order_index""",
        course_id
    )
    
    # Get cards for generated lessons
    for level in levels:
        for lesson in level['lessons']:
            if lesson['generation_status'] == 'completed':
                cards = await db.fetch_all(
                    """SELECT * FROM user_course_cards 
                       WHERE lesson_id = $1 
                       ORDER BY order_index""",
                    lesson['lesson_id']
                )
                lesson['cards'] = cards
    
    return {
        **course,
        "structure": {
            "levels": levels
        }
    }

@router.post("/{course_id}/lessons/{lesson_id}/generate")
async def generate_lesson(
    course_id: str,
    lesson_id: str,
    user_id: int = Depends(get_current_user_id)
):
    """Generate content for a specific lesson on-demand."""
    
    # Verify ownership
    course = await db.fetch_one(
        "SELECT id FROM user_courses WHERE id = $1 AND user_id = $2",
        course_id, user_id
    )
    
    if not course:
        raise HTTPException(404, "Course not found")
    
    # Check if already generated
    lesson = await db.fetch_one(
        "SELECT generation_status FROM user_course_lessons WHERE id = $1",
        lesson_id
    )
    
    if lesson['generation_status'] == 'completed':
        raise HTTPException(400, "Lesson already generated")
    
    # Generate
    generator = CourseGeneratorService()
    cards = await generator.generate_remaining_lesson(course_id, lesson_id)
    
    return {
        "lesson_id": lesson_id,
        "cards": cards
    }

@router.post("/{course_id}/save")
async def save_course_to_library(
    course_id: str,
    user_id: int = Depends(get_current_user_id)
):
    """Mark course as active in user's library."""
    
    await db.execute(
        """UPDATE user_courses 
           SET status = 'active', started_at = NOW() 
           WHERE id = $1 AND user_id = $2""",
        course_id, user_id
    )
    
    return {"success": True}
```

---

## Error Handling & Edge Cases

### 1. Generation Failures
- **Timeout:** If Claude takes >2 minutes, show "Taking longer than expected..." message
- **Invalid JSON:** Retry with stricter prompt, log error
- **API Rate Limit:** Queue request, show estimated wait time
- **Content Policy Violation:** Detect inappropriate topics, show friendly error

### 2. User Experience
- **Leaving during generation:** Warn "Course generation in progress, you can come back later"
- **Generation complete notification:** Email + push notification when ready
- **Partial generation:** If structure succeeds but lesson generation fails, save structure and allow retry

### 3. Quality Control
- **Validation:** Check generated JSON schema before saving
- **Card count:** Ensure exactly 8-10 cards per lesson
- **Duplicate detection:** Check for repetitive content across cards
- **Review flag:** Allow users to report poor quality lessons

---

## Performance Optimization

### 1. Caching
- Cache popular course structures (e.g., "Python for Beginners")
- Cache generation prompts per topic category
- Redis for generation status polling (don't hit DB every second)

### 2. Parallel Generation
- Generate lesson 1.1, 1.2, 1.3 in parallel (3 concurrent API calls)
- Use asyncio.gather() for parallel requests

### 3. Progressive Enhancement
- Show course structure immediately (even before lessons generated)
- Generate remaining lessons lazily (when user reaches them)
- Preload next lesson while user completes current one

---

## Testing Strategy

### Unit Tests
- Test prompt generation with various inputs
- Test JSON parsing from Claude responses
- Test database operations

### Integration Tests
- Full course generation flow (mocked Claude API)
- Error handling scenarios
- Status polling

### User Testing
- A/B test different personalization questions
- Test with 20 diverse topics
- Measure time to completion
- Gather feedback on course quality

---

## Monitoring & Analytics

### Track:
- Generation success rate (%)
- Average generation time (seconds)
- Topics requested (frequency)
- User satisfaction (1-5 star rating after preview)
- Completion rate (% who start after generating)
- Tokens used per generation (cost tracking)
- Failed generations (categorize errors)

### Alerts:
- Generation failure rate >10%
- Average time >90 seconds
- API errors
- High token usage (cost spike)

---

## Future Enhancements

### Phase 2 Features
- **Collaborative courses:** Generate based on multiple users' goals
- **Adaptive difficulty:** Adjust based on quiz performance
- **Multi-modal content:** Include videos, interactive simulations
- **Course marketplace:** Share user-generated courses
- **Expert review:** Upvote system for high-quality courses
- **Voice mode:** Generate audio versions of flashcards

### Advanced Personalization
- Learning style preferences (visual, auditory, kinesthetic)
- Preferred analogies/examples (e.g., sports analogies for finance)
- Industry-specific contexts (e.g., ML for healthcare vs. e-commerce)
- Integration with user's existing knowledge graph

---

## Implementation Checklist

### Week 1: Backend Core
- [ ] Set up database schema
- [ ] Implement CourseGeneratorService
- [ ] Build API endpoints
- [ ] Test Claude API integration
- [ ] Add error handling and logging

### Week 2: Frontend Core
- [ ] Build course creation wizard
- [ ] Implement topic input screen
- [ ] Build personalization form
- [ ] Create generation progress UI
- [ ] Design course preview component

### Week 3: Integration & Polish
- [ ] Connect frontend to backend
- [ ] Implement WebSocket for real-time updates (optional)
- [ ] Add loading states and animations
- [ ] Error messaging and retry flows
- [ ] Responsive design testing

### Week 4: Testing & Launch
- [ ] End-to-end testing with real users
- [ ] Load testing (10+ concurrent generations)
- [ ] A/B test personalization questions
- [ ] Analytics implementation
- [ ] Soft launch to beta users

---

## Final Notes for Claude Code

**Priority order:**
1. Get course structure generation working reliably
2. Build frontend wizard with smooth UX
3. Implement lesson content generation
4. Add error handling and edge cases
5. Optimize performance and costs

**Watch out for:**
- Claude API rate limits (tier 2: 50 req/min)
- JSON parsing errors from LLM responses
- User abandonment during long generation times
- Quality control for generated content
- Database connection pooling for concurrent requests

**When stuck:**
- Start with hardcoded example responses to build UI
- Use streaming for real-time generation updates
- Add extensive logging for debugging
- Test with diverse, edge-case topics early

