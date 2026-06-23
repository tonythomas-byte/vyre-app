# Vyre API Specification

---

## MODULE 1 — AUTH

---

## R1 — Register User

### Endpoint

```
Method - POST /api/auth/register
```

### Authentication

Not required

---

### Params

None

---

### Request Body

| Field      | Type     | Required |
|------------|----------|----------|
| `username` | `string` | Yes      |
| `email`    | `string` | Yes      |
| `password` | `string` | Yes      |

---

### Request Example

```json
{
  "username": "alex_vyre",
  "email": "alex@example.com",
  "password": "Secure123"
}
```

---

## R2 — Email / Username Login

### Endpoint

```
Method - POST /api/auth/login
```

### Authentication

Not required

---

### Params

None

---

### Request Body

| Field             | Type      | Required |
|-------------------|-----------|----------|
| `usernameOrEmail` | `string`  | Yes      |
| `password`        | `string`  | Yes      |
| `rememberMe`      | `boolean` | No       |

---

### Request Examples

**Login with email**
```json
{
  "usernameOrEmail": "alex@example.com",
  "password": "Secure123",
  "rememberMe": false
}
```

**Login with username**
```json
{
  "usernameOrEmail": "alex_vyre",
  "password": "Secure123",
  "rememberMe": true
}
```

---

## R3 — Google OAuth Login

### Endpoint

```
Method - POST /api/auth/google
```

### Authentication

Not required

---

### Params

None

---

### Request Body

| Field      | Type     | Required |
|------------|----------|----------|
| `id_token` | `string` | Yes      |

---

### Request Example

```json
{
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

---

## R4 — Request OTP (Phone Login)

### Endpoint

```
Method - POST /api/auth/otp/request
```

### Authentication

Not required

---

### Params

None

---

### Request Body

| Field         | Type     | Required |
|---------------|----------|----------|
| `phoneNumber` | `string` | Yes      |

---

### Request Example

```json
{
  "phoneNumber": "+919876543210"
}
```

---

## R5 — Verify OTP

### Endpoint

```
Method - POST /api/auth/otp/verify
```

### Authentication

Not required

---

### Params

None

---

### Request Body

| Field        | Type      | Required |
|--------------|-----------|----------|
| `phone`      | `string`  | Yes      |
| `otp`        | `string`  | Yes      |
| `rememberMe` | `boolean` | No       |

---

### Request Examples

**Standard verification**
```json
{
  "phone": "+919876543210",
  "otp": "4821"
}
```

**With remember me**
```json
{
  "phone": "+919876543210",
  "otp": "4821",
  "rememberMe": true
}
```

---

## MODULE 2 — ONBOARDING

---

## R6 — List Companion Options

### Endpoint

```
Method - GET /api/onboarding/companions
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/onboarding/companions
```

---

## R7 — Save Companion Selection

### Endpoint

```
Method - POST /api/onboarding/companion
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field         | Type     | Required |
|---------------|----------|----------|
| `companionId` | `string` | Yes      |

---

### Request Example

```json
{
  "companionId": "companion_zen_master"
}
```

---

## R8 — Save Initial Mood

### Endpoint

```
Method - POST /api/onboarding/mood
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field  | Type   | Required |
|--------|--------|----------|
| `mood` | `enum` | Yes      |

---

### Request Examples

**Standard mood**
```json
{
  "mood": "happy"
}
```

**Floral variant mood**
```json
{
  "mood": "fhappy"
}
```

---

## R9 — Save Preferences

### Endpoint

```
Method - POST /api/onboarding/preferences
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field     | Type       | Required |
|-----------|------------|----------|
| `reason`  | `enum`     | Yes      |
| `topics`  | `string[]` | Yes      |

---

### Request Examples

**Minimum topics (1)**
```json
{
  "reason": "manage_stress",
  "topics": ["anxiety"]
}
```

**Maximum topics (3)**
```json
{
  "reason": "track_mood",
  "topics": ["anxiety", "mindfulness", "self_care"]
}
```

---

## R10 — Save Personal Profile

### Endpoint

```
Method - POST /api/onboarding/profile
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field              | Type      | Required |
|--------------------|-----------|----------|
| `age`              | `integer` | Yes      |
| `employmentStatus` | `enum`    | Yes      |

---

### Request Examples

**Student**
```json
{
  "age": 21,
  "employmentStatus": "student"
}
```

**Employed full-time**
```json
{
  "age": 30,
  "employmentStatus": "employed_full_time"
}
```

---

## MODULE 3 — LANDING / HOME

---

## R11 — Fetch Current User Profile

### Endpoint

```
Method - GET /api/user/me
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/user/me
```

---

## R12 — Fetch Recent Journal Entries

### Endpoint

```
Method - GET /api/journals
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param   | Type      | Required | Description                        |
|---------|-----------|----------|------------------------------------|
| `limit` | `integer` | No       | Number of entries to return (max 3 for landing) |
| `sort`  | `string`  | No       | `recent` — orders by createdAt desc |

---

### Request Body

None

---

### Request Example

```
GET /api/journals?limit=3&sort=recent
```

---

## R13 — Fetch Today's Daily Tasks

### Endpoint

```
Method - GET /api/daily-tasks/today
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/daily-tasks/today
```

---

## R14 — Fetch Today's Daily Quote

### Endpoint

```
Method - GET /api/daily-quotes/today
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/daily-quotes/today
```

---

## MODULE 4 — JOURNAL

---

## R15 — List Activity Options

### Endpoint

```
Method - GET /api/journal/activities
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/journal/activities
```

---

## R16 — List Feeling Options

### Endpoint

```
Method - GET /api/journal/feelings
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/journal/feelings
```

---

## R17 — Upload Audio Recording

### Endpoint

```
Method - POST /api/media/audio
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field   | Type   | Required |
|---------|--------|----------|
| `file`  | `file` | Yes      |

*Multipart/form-data upload. Accepted formats: `audio/mp4`, `audio/webm`, `audio/mpeg`. Max size: 50 MB.*

---

### Request Example

```
POST /api/media/audio
Content-Type: multipart/form-data

file: <audio_recording.mp4>
```

---

## R18 — Upload Gallery Images

### Endpoint

```
Method - POST /api/media/images
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field    | Type     | Required |
|----------|----------|----------|
| `files`  | `file[]` | Yes      |

*Multipart/form-data upload. Accepted formats: `image/jpeg`, `image/png`, `image/webp`, `image/heic`. Max 10 images, 10 MB each.*

---

### Request Examples

**Single image**
```
POST /api/media/images
Content-Type: multipart/form-data

files: <photo1.jpg>
```

**Multiple images**
```
POST /api/media/images
Content-Type: multipart/form-data

files: <photo1.jpg>
files: <photo2.jpg>
files: <photo3.png>
```

---

## R19 — Upload Scribble Drawing

### Endpoint

```
Method - POST /api/media/scribble
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field  | Type   | Required |
|--------|--------|----------|
| `file` | `file` | Yes      |

*Multipart/form-data upload. Accepted formats: `image/png`, `image/svg+xml`. Max size: 5 MB.*

---

### Request Example

```
POST /api/media/scribble
Content-Type: multipart/form-data

file: <drawing.png>
```

---

## R20 — Create Journal Entry

### Endpoint

```
Method - POST /api/journals
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field         | Type       | Required    |
|---------------|------------|-------------|
| `title`       | `string`   | No          |
| `notes`       | `string`   | No          |
| `mood`        | `enum`     | Yes         |
| `entryType`   | `enum`     | Yes         |
| `activities`  | `string[]` | Yes         |
| `feelings`    | `string[]` | Yes         |
| `audioUrl`    | `string`   | Conditional |
| `imageUrls`   | `string[]` | Conditional |
| `scribbleUrl` | `string`   | Conditional |

---

### Request Examples

**Text entry**
```json
{
  "title": "Productive afternoon",
  "notes": "Finished the onboarding flow and felt really accomplished.",
  "mood": "happy",
  "entryType": "text",
  "activities": ["work"],
  "feelings": ["thankful", "blissed"]
}
```

**Audio entry** *(audioUrl required)*
```json
{
  "title": "Morning thoughts",
  "notes": "",
  "mood": "sad",
  "entryType": "audio",
  "activities": ["jogging"],
  "feelings": ["eccentric"],
  "audioUrl": "https://cdn.vyre.app/media/audio/abc123.mp4"
}
```

**Gallery entry** *(imageUrls required)*
```json
{
  "title": "Weekend vibes",
  "notes": "Spent the day outdoors.",
  "mood": "happy",
  "entryType": "gallery",
  "activities": ["pet"],
  "feelings": ["blissed"],
  "imageUrls": [
    "https://cdn.vyre.app/media/images/img001.jpg",
    "https://cdn.vyre.app/media/images/img002.jpg"
  ]
}
```

**Scribble entry** *(scribbleUrl required)*
```json
{
  "title": "Mind map",
  "notes": "Drew out how I was feeling today.",
  "mood": "confused",
  "entryType": "scribble",
  "activities": ["work"],
  "feelings": ["obscure"],
  "scribbleUrl": "https://cdn.vyre.app/media/scribble/scr456.png"
}
```

---

## R21 — Fetch Journal Entries (Paginated, Filterable)

### Endpoint

```
Method - GET /api/journals
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param    | Type      | Required | Description                          |
|----------|-----------|----------|--------------------------------------|
| `date`   | `string`  | No       | Filter by day — format `YYYY-MM-DD`  |
| `month`  | `string`  | No       | Filter by month — format `YYYY-MM`   |
| `limit`  | `integer` | No       | Default 20, max 200                  |
| `offset` | `integer` | No       | Default 0                            |

---

### Request Body

None

---

### Request Examples

**All entries (default pagination)**
```
GET /api/journals
```

**Filter by date**
```
GET /api/journals?date=2026-06-09
```

**Filter by month**
```
GET /api/journals?month=2026-06
```

**With pagination**
```
GET /api/journals?limit=10&offset=20
```

---

## R22 — Fetch Single Journal Entry

### Endpoint

```
Method - GET /api/journals/:id
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param | Type     | Required | Description        |
|-------|----------|----------|--------------------|
| `id`  | `string` | Yes      | Journal entry UUID |

---

### Request Body

None

---

### Request Example

```
GET /api/journals/a3f8c2d1-4e57-4b9a-8c3e-f1d2e3b4a5c6
```

---

## MODULE 5 — TREASURE PILL

---

## R23 — Create Treasure Pill

### Endpoint

```
Method - POST /api/treasure-pills
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field            | Type     | Required    |
|------------------|----------|-------------|
| `mood`           | `enum`   | Yes         |
| `date`           | `string` | Yes         |
| `songId`         | `string` | Conditional |
| `songTitle`      | `string` | Conditional |
| `journalEntryId` | `string` | No          |

*At least one of `songId` or `songTitle` is required.*

---

### Request Examples

**With song title**
```json
{
  "mood": "happy",
  "date": "2026-06-09",
  "songTitle": "Happy - Pharrell Williams"
}
```

**With song ID and linked journal entry**
```json
{
  "mood": "sad",
  "date": "2026-06-08",
  "songId": "spotify:track:60nZcImufyMA1MKQY3dcCH",
  "journalEntryId": "a3f8c2d1-4e57-4b9a-8c3e-f1d2e3b4a5c6"
}
```

---

## R24 — Fetch Treasure Pills (Paginated, Filterable)

### Endpoint

```
Method - GET /api/treasure-pills
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param    | Type      | Required | Description                         |
|----------|-----------|----------|-------------------------------------|
| `date`   | `string`  | No       | Filter by day — format `YYYY-MM-DD` |
| `month`  | `string`  | No       | Filter by month — format `YYYY-MM`  |
| `limit`  | `integer` | No       | Default 20, max 100                 |
| `offset` | `integer` | No       | Default 0                           |

---

### Request Body

None

---

### Request Examples

**All pills**
```
GET /api/treasure-pills
```

**Filter by specific date**
```
GET /api/treasure-pills?date=2026-06-09
```

**Filter by month**
```
GET /api/treasure-pills?month=2026-06
```

**With pagination**
```
GET /api/treasure-pills?limit=10&offset=0
```

---

## R25 — Fetch Single Treasure Pill

### Endpoint

```
Method - GET /api/treasure-pills/:id
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param | Type     | Required | Description          |
|-------|----------|----------|----------------------|
| `id`  | `string` | Yes      | Treasure Pill UUID   |

---

### Request Body

None

---

### Request Example

```
GET /api/treasure-pills/b7c9d3e2-5f68-4c0b-9d4f-g2e3f4c5b6d7
```

---

## MODULE 6 — ENTRY CARD / TIMELINE VIEW

---

## R26 — Fetch Journal Entries for Timeline

### Endpoint

```
Method - GET /api/journals/timeline
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param    | Type      | Required | Description                          |
|----------|-----------|----------|--------------------------------------|
| `date`   | `string`  | No       | Filter by day — format `YYYY-MM-DD`  |
| `month`  | `string`  | No       | Filter by month — format `YYYY-MM`   |
| `limit`  | `integer` | No       | Default 20, max 200                  |
| `offset` | `integer` | No       | Default 0                            |

---

### Request Body

None

---

### Request Examples

**Timeline for today**
```
GET /api/journals/timeline?date=2026-06-09
```

**Timeline for a full month**
```
GET /api/journals/timeline?month=2026-06
```

---

## MODULE 7 — USER PROFILE

---

## R27 — Update User Profile

### Endpoint

```
Method - PATCH /api/user/me
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field             | Type     | Required |
|-------------------|----------|----------|
| `displayName`     | `string` | No       |
| `companionId`     | `string` | No       |
| `profilePhotoUrl` | `string` | No       |

*At least one field must be provided. Omitted fields remain unchanged (PATCH semantics).*

---

### Request Examples

**Update display name only**
```json
{
  "displayName": "Alex"
}
```

**Update companion**
```json
{
  "companionId": "companion_wise_tiger"
}
```

**Update all fields**
```json
{
  "displayName": "Alex",
  "companionId": "companion_wise_tiger",
  "profilePhotoUrl": "https://cdn.vyre.app/avatars/user_abc.jpg"
}
```

---

## R28 — Delete User Account

### Endpoint

```
Method - DELETE /api/user/me
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

| Field        | Type     | Required    |
|--------------|----------|-------------|
| `password`   | `string` | Conditional |
| `otp`        | `string` | Conditional |
| `phone`      | `string` | Conditional |

*Either `password` (email/password users) or `phone` + `otp` (phone users) is required for re-authentication before deletion.*

---

### Request Examples

**Email/password account deletion**
```json
{
  "password": "Secure123"
}
```

**Phone account deletion**
```json
{
  "phone": "+919876543210",
  "otp": "3847"
}
```

---

## MODULE 8 — STREAK / GAMIFICATION

---

## R29 — Fetch Streak Status

### Endpoint

```
Method - GET /api/user/streak
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
GET /api/user/streak
```

---

## R30 — Daily Check-In

### Endpoint

```
Method - POST /api/user/streak/check-in
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

None

---

### Request Body

None

---

### Request Example

```
POST /api/user/streak/check-in
```

---

## MODULE 9 — EMOTIONAL TRACKING

---

## R31 — Fetch Mood History

### Endpoint

```
Method - GET /api/moods/history
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param       | Type      | Required | Description                              |
|-------------|-----------|----------|------------------------------------------|
| `startDate` | `string`  | No       | Start of range — format `YYYY-MM-DD`     |
| `endDate`   | `string`  | No       | End of range — format `YYYY-MM-DD`       |
| `limit`     | `integer` | No       | Default 20, max 100                      |
| `offset`    | `integer` | No       | Default 0                                |

---

### Request Body

None

---

### Request Examples

**All mood history**
```
GET /api/moods/history
```

**Date range filter**
```
GET /api/moods/history?startDate=2026-06-01&endDate=2026-06-09
```

**With pagination**
```
GET /api/moods/history?limit=10&offset=0
```

---

## R32 — Fetch Mood Summary Statistics

### Endpoint

```
Method - GET /api/moods/summary
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param    | Type     | Required | Description                                     |
|----------|----------|----------|-------------------------------------------------|
| `period` | `enum`   | No       | `week`, `month`, `year` — default `month`       |

---

### Request Body

None

---

### Request Examples

**Default (monthly)**
```
GET /api/moods/summary
```

**Weekly summary**
```
GET /api/moods/summary?period=week
```

**Yearly summary**
```
GET /api/moods/summary?period=year
```

---

## MODULE 10 — CALENDAR VIEW

---

## R33 — Fetch Journal Entries for Calendar Month

### Endpoint

```
Method - GET /api/journals
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param   | Type     | Required | Description                        |
|---------|----------|----------|------------------------------------|
| `month` | `string` | Yes      | Calendar month — format `YYYY-MM`  |

---

### Request Body

None

---

### Request Example

```
GET /api/journals?month=2026-06
```

---

## R34 — Fetch Treasure Pills for Calendar Month

### Endpoint

```
Method - GET /api/treasure-pills
```

### Authentication

**Required**
`Authorization: Bearer <access_token>`

---

### Params

| Param   | Type     | Required | Description                        |
|---------|----------|----------|------------------------------------|
| `month` | `string` | Yes      | Calendar month — format `YYYY-MM`  |

---

### Request Body

None

---

### Request Example

```
GET /api/treasure-pills?month=2026-06
```

---

## CROSS-CUTTING

---

## R35 — Authentication & Authorisation

### Applies To

All endpoints except R1, R2, R3, R4, R5

### Rule

Every protected endpoint requires:

```
Authorization: Bearer <access_token>
```

If the token is missing or invalid the API returns `401 Unauthorized`.
If a user attempts to access another user's resource the API returns `403 Forbidden`.

---

## R36 — Error Response Format

### Applies To

All endpoints

### Standard Error Shape

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description of the error.",
    "details": {
      "field": "fieldName",
      "received": "invalidValue"
    }
  }
}
```

### Common Error Codes

| HTTP Status | Code                   | When                                          |
|-------------|------------------------|-----------------------------------------------|
| `400`       | `INVALID_JSON`         | Request body is not valid JSON                |
| `401`       | `UNAUTHORIZED`         | Missing or invalid Bearer token               |
| `403`       | `FORBIDDEN`            | Accessing another user's resource             |
| `404`       | `NOT_FOUND`            | Resource does not exist                       |
| `409`       | `EMAIL_TAKEN`          | Email already registered                      |
| `409`       | `USERNAME_TAKEN`       | Username already registered                   |
| `410`       | `OTP_EXPIRED`          | OTP older than 10 minutes                     |
| `413`       | `FILE_TOO_LARGE`       | Uploaded file exceeds size limit              |
| `415`       | `UNSUPPORTED_FORMAT`   | File format not accepted                      |
| `422`       | `MISSING_FIELD`        | Required field absent from request body       |
| `422`       | `INVALID_MOOD`         | Mood value not in accepted enum               |
| `422`       | `INVALID_ENTRY_TYPE`   | entryType not in accepted enum                |
| `422`       | `MISSING_AUDIO_URL`    | entryType audio but audioUrl missing          |
| `422`       | `MISSING_IMAGE_URLS`   | entryType gallery but imageUrls empty         |
| `422`       | `MISSING_SCRIBBLE_URL` | entryType scribble but scribbleUrl missing    |
| `422`       | `INVALID_PHONE`        | Phone number format incorrect                 |
| `422`       | `INVALID_PASSWORD`     | Password does not meet requirements           |
| `422`       | `INVALID_EMAIL`        | Email format invalid                          |
| `422`       | `INVALID_USERNAME`     | Username too short or too long                |
| `429`       | `OTP_LOCKED`           | 5 consecutive OTP failures                    |
| `429`       | `RATE_LIMITED`         | Too many OTP requests in rolling window       |
| `503`       | `SMS_DISPATCH_FAILED`  | SMS provider unavailable                      |
