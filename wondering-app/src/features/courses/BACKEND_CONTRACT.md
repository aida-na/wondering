# Course Sharing — Backend Contract

## Database Changes

### `courses` table — new columns

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `creator_name` | `text` | `null` | Name of the course creator/author |
| `is_shared` | `boolean` | `false` | Whether the course has ever been shared |
| `share_count` | `integer` | `0` | Number of users who have added this course via share link |
| `share_token` | `text` (unique) | `null` | URL-safe token for the share link (generated on first share) |

### `shared_course_events` table (new)

Tracks share activity for analytics.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | |
| `course_id` | `uuid` (FK → courses) | The original course being shared |
| `shared_by_user_id` | `uuid` (FK → users) | Who shared it |
| `accepted_by_user_id` | `uuid` (FK → users, nullable) | Who accepted it (null if pending/unregistered) |
| `status` | `text` | `pending` / `accepted` / `duplicate` |
| `created_at` | `timestamptz` | When the share link was generated |
| `accepted_at` | `timestamptz` (nullable) | When the recipient added the course |

---

## API Endpoints

### `POST /api/courses/:id/share`

Generate or return existing share link for a course.

**Response:**
```json
{
  "shareUrl": "https://wondering.app/course/shared/abc123token",
  "shareToken": "abc123token",
  "courseName": "Bio-Optimized Nutrition for Peak Energy",
  "creator": "Shane Parrish",
  "description": "Check out \"Bio-Optimized Nutrition...\" by Shane Parrish on Wondering — 20 lessons.",
  "totalLessons": 20
}
```

**Side effects:**
- Sets `is_shared = true` on the course
- Generates `share_token` if not already set
- Creates row in `shared_course_events` with status `pending`

---

### `GET /api/courses/shared/:shareToken`

Get course info from a share link. Public endpoint (no auth required).

**Response:**
```json
{
  "courseName": "Bio-Optimized Nutrition for Peak Energy",
  "creator": "Shane Parrish",
  "description": "Master the science of nutrition timing...",
  "totalLessons": 20,
  "shareCount": 12,
  "previewImageUrl": null
}
```

Used to render the share landing page and OG meta tags.

---

### `POST /api/courses/shared/:shareToken/accept`

Accept a shared course (add to user's library). **Requires auth.**

**Response (new course):**
```json
{
  "status": "added",
  "courseId": "new-uuid",
  "message": "Course was added"
}
```

**Response (duplicate):**
```json
{
  "status": "duplicate",
  "courseId": "existing-uuid",
  "message": "Course already exists in your library"
}
```

**Side effects:**
- If new: creates course copy for user with `doneLessons = 0`, `status = "Not Started"`, not personalized
- Increments `share_count` on the original course
- Updates `shared_course_events` row with `accepted_by_user_id` and `status`

---

### `GET /api/courses/shared/:shareToken/accept?pending=true`

For unauthenticated users. Stores the share token in a pending state. After the user completes registration, the course is automatically added. The token can be stored in a cookie or query param through the registration flow.

---

## OG Meta Tags (for link previews)

The share landing page (`/course/shared/:shareToken`) should render server-side or use a pre-render service to include:

```html
<meta property="og:title" content="Bio-Optimized Nutrition for Peak Energy" />
<meta property="og:description" content="Check out this course by Shane Parrish on Wondering — 20 lessons." />
<meta property="og:image" content="https://wondering.app/og/course/abc123token.png" />
<meta property="og:url" content="https://wondering.app/course/shared/abc123token" />
<meta property="og:type" content="website" />
```

---

## Share Flow Summary

```
User clicks "Share course" in kebab menu
  → POST /api/courses/:id/share (get/create share link)
  → iOS: navigator.share() with URL + description
  → Web: navigator.clipboard.writeText(shareUrl) + toast "Link copied"

Recipient opens link
  → GET /api/courses/shared/:shareToken (render preview)
  → If logged in:
      → POST /api/courses/shared/:shareToken/accept
      → "added" → redirect to library, toast "Course was added"
      → "duplicate" → toast "Course already exists in your library"
  → If not logged in:
      → Show signup CTA
      → Store shareToken in cookie
      → After registration → auto-accept course
```
