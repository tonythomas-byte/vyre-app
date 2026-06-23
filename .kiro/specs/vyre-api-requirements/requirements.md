# Requirements Document

## Introduction

Vyre is a mental wellness and journaling application built with Next.js 14, TypeScript, and Tailwind CSS. This document defines the complete API surface that backs every screen in the application. Each requirement corresponds to one or more API endpoints, derived by asking: what data is displayed, what data is submitted, are files uploaded, are records updated or deleted, and is pagination/filtering required?

The API is organised into ten modules that mirror the application's route groups: Auth, Onboarding, Landing/Home, Journal, Treasure Pill, Entry Card/Timeline, User Profile, Streak/Gamification, Emotional Tracking, and Calendar View.

---

## Glossary

- **User**: An authenticated Vyre account holder identified by a unique `userId`.
- **Companion**: A named avatar character selected during onboarding; some companions are locked until streak milestones are reached.
- **Mood**: A named emotional state (e.g., happy, sad, angry, confused, cry) selected by the user, used throughout journaling and onboarding.
- **Journal_Entry**: A structured record of a user's reflection composed of a title, notes, activities, feelings, mood, entry type (text/audio/scribble/gallery), and optional media attachments.
- **Activity**: A predefined tag representing what a user was doing (e.g., Work, Pet, Party, Jogging).
- **Feeling**: A predefined tag representing an emotion the user experienced (e.g., Eccentric, Thankful, Blissed, Amused).
- **Daily_Task**: A guided wellness prompt served once per day, categorised by theme (e.g., Gratitude, Reflection, Mindfulness).
- **Daily_Quote**: An inspirational quote with an author, served once per calendar day.
- **Treasure_Pill**: A time-capsule record linking a mood, a date, a song, and optionally a Journal_Entry.
- **OTP**: A 4-digit one-time password sent to a user's phone number for authentication.
- **Streak**: A consecutive-day check-in count that governs Companion unlock eligibility.
- **Media**: Binary file content (audio recordings, gallery images, or scribble drawings) stored server-side and referenced by URL in Journal_Entries.
- **Onboarding_Profile**: The aggregate of companion choice, initial mood, usage reason, topics of interest, age, and employment status collected during first-run setup.
- **Entry_Card**: A UI component that renders a Journal_Entry in timeline/calendar views, surfacing day label, date number, thumbnail, title, time, description, colour theme, and mood avatars.

---

## Requirements

---

## MODULE 1 — AUTH

### Requirement 1: User Registration

**User Story:** As a new Vyre user, I want to create an account with a username, email, and password, so that I can access my personal wellness data across sessions.

**Screens:** `/signup`

#### Acceptance Criteria

1. WHEN a registration request is received with `username`, `email`, and `password`, THE Auth_Service SHALL create a new User record, assign a unique `userId`, and return a session token (JWT, 24-hour TTL by default).
2. IF the submitted `email` already exists in the system (case-insensitive match), THEN THE Auth_Service SHALL return an HTTP 409 Conflict response with `code: "EMAIL_TAKEN"`.
3. IF the submitted `username` already exists in the system (case-insensitive match), THEN THE Auth_Service SHALL return an HTTP 409 Conflict response with `code: "USERNAME_TAKEN"`.
4. IF the submitted `username` is fewer than 3 characters or exceeds 30 characters, THEN THE Auth_Service SHALL return an HTTP 422 response with `code: "INVALID_USERNAME"`.
5. IF the submitted `email` does not match the format `local@domain.tld`, THEN THE Auth_Service SHALL return an HTTP 422 response with `code: "INVALID_EMAIL"`.
6. IF the submitted `password` is fewer than 8 characters or exceeds 128 characters, or does not contain at least one uppercase letter, one lowercase letter, and one digit, THEN THE Auth_Service SHALL return an HTTP 422 response with `code: "INVALID_PASSWORD"`.
7. IF any required field (`username`, `email`, `password`) is missing, THEN THE Auth_Service SHALL return an HTTP 422 Unprocessable Entity response listing all missing fields by name.
8. THE Auth_Service SHALL store passwords as a salted cryptographic hash (bcrypt or Argon2) and SHALL NOT persist plaintext passwords at any point.

> **Correctness property:** For any two distinct registration requests with different emails, the system SHALL assign distinct `userId` values (injectivity). For any valid registration payload `P`, `POST /auth/register(P)` followed by `POST /auth/login(P.email, P.password)` SHALL succeed (round-trip).

---

### Requirement 2: Email/Username Login

**User Story:** As a registered Vyre user, I want to sign in with my username or email and password, so that I can resume my wellness journey.

**Screens:** `/signin`

#### Acceptance Criteria

1. WHEN a login request is received with `usernameOrEmail` and `password`, THE Auth_Service SHALL verify the credentials and return a session token and refresh token on success.
2. IF the provided credentials do not match any User record, THEN THE Auth_Service SHALL return an HTTP 401 Unauthorized response.
3. WHERE the `rememberMe` flag is `true`, THE Auth_Service SHALL issue a long-lived refresh token (30 days); WHERE the flag is `false` or absent, THE Auth_Service SHALL issue a short-lived refresh token (24 hours).
4. THE Auth_Service SHALL accept either a username or an email address in the `usernameOrEmail` field.
5. IF a User account is suspended or deleted, THEN THE Auth_Service SHALL return an HTTP 403 Forbidden response with a reason code.

> **Correctness property (idempotence):** Sending the same valid login request twice SHALL return a valid token both times without side effects to the User record.

---

### Requirement 3: Google OAuth Login

**User Story:** As a Vyre user, I want to sign in with my Google account, so that I can authenticate without managing a separate password.

**Screens:** `/signin`, `/signup`

#### Acceptance Criteria

1. WHEN a Google OAuth callback is received with a valid `id_token`, THE Auth_Service SHALL look up or create a User record linked to the Google `sub` identifier and return a session token.
2. IF the Google `id_token` is invalid or expired, THEN THE Auth_Service SHALL return an HTTP 401 Unauthorized response.
3. WHEN a new User is created via Google OAuth, THE Auth_Service SHALL populate `email` from the Google profile and generate a unique `username` derived from the Google display name.
4. IF the Google account's email is already registered via email/password, THEN THE Auth_Service SHALL link the Google identity to the existing User record rather than creating a duplicate.

---

### Requirement 4: OTP Request (Phone Login)

**User Story:** As a Vyre user, I want to receive a one-time password on my Indian phone number, so that I can log in without a password.

**Screens:** `/phone-login`

#### Acceptance Criteria

1. WHEN an OTP request is received with a valid `phoneNumber` (10 digits, country code `+91`), THE Auth_Service SHALL generate a cryptographically random 4-digit numeric OTP, store it with a 10-minute expiry, and dispatch it via SMS.
2. WHEN OTP generation and dispatch succeed, THE Auth_Service SHALL return an HTTP 200 response with a confirmation that the OTP was sent.
3. IF the submitted `phoneNumber` does not match the pattern `^\+91\d{10}$`, THEN THE Auth_Service SHALL return an HTTP 422 response with `code: "INVALID_PHONE"`.
4. WHILE an unexpired OTP already exists for the given `phoneNumber`, THE Auth_Service SHALL mark the previous OTP as expired such that any subsequent verification attempt using the previous OTP is rejected, before issuing a new one.
5. IF the SMS dispatch service fails, THEN THE Auth_Service SHALL return an HTTP 503 Service Unavailable response with `code: "SMS_DISPATCH_FAILED"` and SHALL NOT persist the new OTP.
6. THE Auth_Service SHALL rate-limit OTP requests to a maximum of 5 requests per `phoneNumber` within a rolling 60-minute window; IF the limit is exceeded, THEN THE Auth_Service SHALL return an HTTP 429 Too Many Requests response with a `Retry-After` header indicating when the limit resets.

> **Correctness property (idempotence):** Sending `POST /auth/otp/request` twice for the same phone number SHALL result in exactly one valid OTP at any point in time (the second request invalidates the first).

---

### Requirement 5: OTP Verification

**User Story:** As a Vyre user, I want to submit the OTP I received to complete phone-based login, so that my session is established securely.

**Screens:** `/verify-otp`

#### Acceptance Criteria

1. WHEN an OTP verification request is received with `phone` and a 4-digit `otp`, THE Auth_Service SHALL validate the OTP against the stored value for the given `phone`.
2. WHEN the OTP is valid and not expired, THE Auth_Service SHALL invalidate the used OTP, reset the failure counter for that `phone`, and return a session token (JWT, 24-hour TTL by default).
3. IF the submitted `otp` does not match the stored value for the given `phone`, THEN THE Auth_Service SHALL return an HTTP 401 Unauthorized response and increment the failure counter for that `phone`.
4. IF the OTP has expired (older than 10 minutes), THEN THE Auth_Service SHALL return an HTTP 410 Gone response with `code: "OTP_EXPIRED"`.
5. IF the failure counter for the given `phone` reaches 5 consecutive failures without an intervening successful verification, THEN THE Auth_Service SHALL lock the OTP entry and return an HTTP 429 Too Many Requests response with `code: "OTP_LOCKED"`, requiring the User to request a new OTP.
6. WHERE the `rememberMe` flag accompanying the verification is `true`, THE Auth_Service SHALL issue a session token with a 30-day TTL instead of the default 24 hours.

> **Correctness property:** For any OTP `O` successfully verified at time `T`, a second verification of `O` at time `T+1` (within expiry) SHALL fail with HTTP 410 or HTTP 401 (single-use guarantee).

---

## MODULE 2 — ONBOARDING

### Requirement 6: List Companion Options

**User Story:** As a new Vyre user, I want to see all available companion avatars with their lock status, so that I can choose my journey companion.

**Screens:** `/onboarding`

#### Acceptance Criteria

1. WHEN a companion list request is received for an authenticated User, THE Onboarding_Service SHALL return all Companion records including `id`, `name`, `imageUrl`, and `locked` status.
2. THE Onboarding_Service SHALL derive `locked` status from the User's current streak count; a Companion with a `requiredStreak` value greater than the User's streak SHALL be returned with `locked: true`.
3. THE Onboarding_Service SHALL return Companions in a consistent display order (ascending by `displayOrder`).

> **Correctness property (invariant):** The total number of Companion records returned SHALL equal the total number of Companions in the system regardless of lock status (filtering is display-only, not data-level).

---

### Requirement 7: Save Companion Selection

**User Story:** As a new Vyre user, I want to save my chosen companion, so that the companion appears throughout my Vyre experience.

**Screens:** `/onboarding`

#### Acceptance Criteria

1. WHEN a companion selection request is received with a valid `companionId`, THE Onboarding_Service SHALL associate the Companion with the User's profile and return HTTP 200.
2. IF the selected `companionId` corresponds to a locked Companion for the requesting User, THEN THE Onboarding_Service SHALL return an HTTP 403 Forbidden response.
3. IF the `companionId` does not exist, THEN THE Onboarding_Service SHALL return an HTTP 404 Not Found response.
4. WHEN a companion is saved, THE Onboarding_Service SHALL overwrite any previously saved companion for the same User.

---

### Requirement 8: Save Initial Mood

**User Story:** As a new Vyre user, I want to save my initial mood from the carousel, so that Vyre can personalise my experience from the start.

**Screens:** `/onboarding-2`

#### Acceptance Criteria

1. WHEN a mood submission is received with a valid `mood` value, THE Onboarding_Service SHALL persist the mood against the User's Onboarding_Profile and return HTTP 200.
2. THE Onboarding_Service SHALL accept the following `mood` values: `happy`, `sad`, `angry`, `confused`, `cry`, `fhappy`, `fsad`, `fangry`, `fconfused`, `fcry` (standard and floral variants).
3. IF the submitted `mood` value is not in the accepted set, THEN THE Onboarding_Service SHALL return an HTTP 422 response.

---

### Requirement 9: Save Preferences

**User Story:** As a new Vyre user, I want to save why I am using Vyre and which topics interest me, so that the app can tailor content to my needs.

**Screens:** `/onboarding-3`

#### Acceptance Criteria

1. WHEN a preferences request is received with a `reason` and `topics[]`, THE Onboarding_Service SHALL persist both against the User's Onboarding_Profile and return HTTP 200.
2. THE Onboarding_Service SHALL accept exactly one `reason` value from: `manage_stress`, `track_mood`, `improve_self_awareness`, `find_support`.
3. THE Onboarding_Service SHALL accept between 1 and 3 `topics[]` values from: `anxiety`, `depression`, `relationships`, `work`, `creativity`, `mindfulness`, `self_care`.
4. IF more than 3 topics are submitted, THEN THE Onboarding_Service SHALL return an HTTP 422 response.
5. IF the `reason` value is not in the accepted set, THEN THE Onboarding_Service SHALL return an HTTP 422 response.

---

### Requirement 10: Save Personal Profile

**User Story:** As a new Vyre user, I want to save my age and employment status, so that Vyre can provide contextually relevant content.

**Screens:** `/onboarding-final`

#### Acceptance Criteria

1. WHEN a profile request is received with `age` and `employmentStatus`, THE Onboarding_Service SHALL persist both against the User's Onboarding_Profile and mark onboarding as complete.
2. THE Onboarding_Service SHALL validate that `age` is an integer between 1 and 100 inclusive.
3. THE Onboarding_Service SHALL accept the following `employmentStatus` values: `student`, `employed_full_time`, `employed_part_time`, `self_employed`, `unemployed`, `retired`, `other`.
4. IF `age` is outside the range 1–100, THEN THE Onboarding_Service SHALL return an HTTP 422 response.
5. IF `employmentStatus` is not in the accepted set, THEN THE Onboarding_Service SHALL return an HTTP 422 response.
6. WHEN onboarding is marked complete, THE Onboarding_Service SHALL set `onboardingCompleted: true` on the User record so the application can redirect directly to `/landing` on subsequent logins.

---

## MODULE 3 — LANDING / HOME

### Requirement 11: Fetch Current User Profile

**User Story:** As a logged-in Vyre user, I want the landing page to display my name and companion avatar, so that the app feels personalised.

**Screens:** `/landing`

#### Acceptance Criteria

1. WHEN a current-user request is received with a valid session token, THE User_Service SHALL return the User's `displayName`, `avatarUrl`, and active `companionId`.
2. IF the session token is missing or invalid, THEN THE User_Service SHALL return an HTTP 401 Unauthorized response.
3. THE User_Service SHALL respond within 500 ms under normal load conditions.

---

### Requirement 12: Fetch Recent Journal Entries

**User Story:** As a Vyre user on the landing screen, I want to see my three most recent journal entries in a carousel, so that I can quickly revisit what I have written.

**Screens:** `/landing` (JournalModule carousel)

#### Acceptance Criteria

1. WHEN a journal list request is received with `limit=3` and `sort=recent`, THE Journal_Service SHALL return the 3 most recently created Journal_Entries for the requesting User, ordered by `createdAt` descending.
2. THE Journal_Service SHALL include `id`, `status`, `title`, `date`, `summary`, and `imageUrl` in each returned entry.
3. IF the User has fewer than 3 Journal_Entries, THE Journal_Service SHALL return all available entries without error.
4. IF the User has no Journal_Entries, THE Journal_Service SHALL return an empty array with HTTP 200.

---

### Requirement 13: Fetch Today's Daily Tasks

**User Story:** As a Vyre user on the landing screen, I want to see today's guided wellness tasks, so that I have a prompt to reflect on each day.

**Screens:** `/landing` (DailyTaskModule carousel)

#### Acceptance Criteria

1. WHEN a daily-tasks request is received, THE Content_Service SHALL return all Daily_Task records assigned to the current calendar date for the requesting User's timezone.
2. THE Content_Service SHALL include `id`, `category`, `categoryIcon`, `taskPrompt`, and `illustration` in each returned task.
3. IF no Daily_Tasks are scheduled for the current date, THEN THE Content_Service SHALL return a default set of at least 1 task.
4. THE Content_Service SHALL return tasks in ascending `displayOrder`.

---

### Requirement 14: Fetch Today's Daily Quote

**User Story:** As a Vyre user on the landing screen, I want to read an inspirational quote each day, so that I feel motivated during my wellness practice.

**Screens:** `/landing` (DailyQuoteModule)

#### Acceptance Criteria

1. WHEN a daily-quote request is received, THE Content_Service SHALL return a single Daily_Quote record containing `quote` text and `author` for the current calendar date.
2. IF no quote is scheduled for the current date, THEN THE Content_Service SHALL return a fallback quote.
3. THE Content_Service SHALL return the same quote for all requests on the same calendar date (deterministic per day).

> **Correctness property (idempotence):** `GET /daily-quotes/today` called N times on the same calendar date SHALL return the same `quote` and `author` values every time.

---

## MODULE 4 — JOURNAL

### Requirement 15: List Activity Options

**User Story:** As a Vyre user creating a journal entry, I want to see all available activity tags, so that I can tag what I was doing.

**Screens:** `/journal-2`

#### Acceptance Criteria

1. WHEN an activities list request is received, THE Journal_Service SHALL return all Activity records including `id`, `label`, and `iconUrl`.
2. THE Journal_Service SHALL return activities in a consistent display order (ascending by `displayOrder`).
3. THE Journal_Service SHALL include an `others` sentinel activity that the client can render as an add-custom option.

---

### Requirement 16: List Feeling Options

**User Story:** As a Vyre user creating a journal entry, I want to see all available feeling tags, so that I can tag how I felt.

**Screens:** `/journal-3`

#### Acceptance Criteria

1. WHEN a feelings list request is received, THE Journal_Service SHALL return all Feeling records including `id`, `label`, and `iconUrl`.
2. THE Journal_Service SHALL return feelings in a consistent display order (ascending by `displayOrder`).
3. THE Journal_Service SHALL include an `others` sentinel feeling for custom input.

---

### Requirement 17: Upload Audio Recording

**User Story:** As a Vyre user, I want to attach a voice recording to my journal entry, so that I can express myself in speech.

**Screens:** `/journal-4`

#### Acceptance Criteria

1. WHEN an audio upload request is received with a valid audio file, THE Media_Service SHALL store the file and return a permanent `audioUrl`.
2. THE Media_Service SHALL accept audio files in the following formats: `audio/mp4`, `audio/webm`, `audio/mpeg`.
3. IF the uploaded file exceeds 50 MB, THEN THE Media_Service SHALL return an HTTP 413 Payload Too Large response.
4. IF the file format is not in the accepted set, THEN THE Media_Service SHALL return an HTTP 415 Unsupported Media Type response.
5. THE Media_Service SHALL return the `audioUrl` within 10 seconds of receiving the request under normal conditions.

---

### Requirement 18: Upload Gallery Images

**User Story:** As a Vyre user, I want to attach images to my journal entry from my device gallery, so that I can visually capture my day.

**Screens:** `/journal-4`

#### Acceptance Criteria

1. WHEN an image upload request is received with one or more image files, THE Media_Service SHALL store each file and return an array of permanent `imageUrls`.
2. THE Media_Service SHALL accept image files in the following formats: `image/jpeg`, `image/png`, `image/webp`, `image/heic`.
3. IF any individual image exceeds 10 MB, THEN THE Media_Service SHALL return an HTTP 413 response identifying the offending file.
4. THE Media_Service SHALL accept a maximum of 10 images per upload request; IF more than 10 are submitted, THEN THE Media_Service SHALL return an HTTP 422 response.
5. THE Media_Service SHALL return all `imageUrls` as an ordered array matching the submission order.

> **Correctness property (round-trip):** For each uploaded image, fetching the returned `imageUrl` SHALL yield the original binary content unchanged.

---

### Requirement 19: Upload Scribble Drawing

**User Story:** As a Vyre user, I want to attach a scribble drawing to my journal entry, so that I can express myself visually.

**Screens:** `/journal-4`

#### Acceptance Criteria

1. WHEN a scribble upload request is received with an image file, THE Media_Service SHALL store the file and return a permanent `scribbleUrl`.
2. THE Media_Service SHALL accept scribble files in the following formats: `image/png`, `image/svg+xml`.
3. IF the uploaded scribble file exceeds 5 MB, THEN THE Media_Service SHALL return an HTTP 413 response.

---

### Requirement 20: Create Journal Entry

**User Story:** As a Vyre user, I want to save my completed journal entry including title, notes, activities, feelings, mood, and any media attachments, so that my reflection is permanently recorded.

**Screens:** `/journal-4` (final save)

#### Acceptance Criteria

1. WHEN a journal creation request is received with `title` (max 200 characters), `notes` (max 10,000 characters), `activities[]`, `feelings[]`, `mood`, and `entryType`, THE Journal_Service SHALL create a new Journal_Entry record and return the created entry including its `id` and `createdAt`.
2. THE Journal_Service SHALL validate that `entryType` is one of: `text`, `audio`, `scribble`, `gallery`.
3. IF `entryType` is `audio` and `audioUrl` is absent, THEN THE Journal_Service SHALL return an HTTP 422 response with `code: "MISSING_AUDIO_URL"`.
4. IF `entryType` is `gallery` and `imageUrls[]` is empty or absent, THEN THE Journal_Service SHALL return an HTTP 422 response with `code: "MISSING_IMAGE_URLS"`.
5. IF `entryType` is `scribble` and `scribbleUrl` is absent, THEN THE Journal_Service SHALL return an HTTP 422 response with `code: "MISSING_SCRIBBLE_URL"`.
6. THE Journal_Service SHALL allow `title` to be an empty string (drafts).
7. IF the `mood` value is not one of `happy`, `sad`, `angry`, `confused`, `cry`, THEN THE Journal_Service SHALL return an HTTP 422 response with `code: "INVALID_MOOD"`.
8. WHEN a Journal_Entry is created, THE Journal_Service SHALL automatically associate it with the requesting User and record `createdAt` as the current UTC timestamp.
9. IF any of the required fields `mood`, `entryType`, `activities[]`, or `feelings[]` are absent from the request body, THEN THE Journal_Service SHALL return an HTTP 422 response identifying each missing field by name.
10. IF the request is made without a valid session token, THEN THE Journal_Service SHALL return an HTTP 401 Unauthorized response.

> **Correctness property (invariant):** For any Journal_Entry creation request, `entry.userId` in the response SHALL equal the `userId` of the authenticated requester (no cross-user data leakage).

---

### Requirement 21: Fetch Journal Entries (Paginated, Filterable)

**User Story:** As a Vyre user, I want to retrieve my journal entries with date filtering and pagination, so that I can view entries for any specific date or period.

**Screens:** `/landing` (JournalModule), Entry Card / Timeline views, Calendar view

#### Acceptance Criteria

1. WHEN a journal list request is received, THE Journal_Service SHALL return a paginated list of Journal_Entries for the requesting User.
2. WHEN a `date` query parameter (format `YYYY-MM-DD`, interpreted as UTC) is provided, THE Journal_Service SHALL return only entries whose `createdAt` UTC date matches.
3. WHEN a `month` query parameter (format `YYYY-MM`, interpreted as UTC) is provided, THE Journal_Service SHALL return only entries whose `createdAt` UTC month matches.
4. WHEN `limit` and `offset` query parameters are provided, THE Journal_Service SHALL apply offset-based pagination; `limit` SHALL default to 20 and SHALL NOT exceed 200.
5. IF no `limit` is specified, THEN THE Journal_Service SHALL default to `limit=20`.
6. THE Journal_Service SHALL include a `totalCount` field in the response envelope reflecting the total number of entries matching the current filter (not the page size).
7. THE Journal_Service SHALL return entries in descending `createdAt` order by default.
8. IF both `date` and `month` are provided, THEN THE Journal_Service SHALL prioritise `date` and ignore `month`.
9. IF any filter or pagination parameter is provided in an invalid format, THEN THE Journal_Service SHALL return an HTTP 422 response identifying the offending parameter by name.

> **Correctness properties:**
> - **Pagination completeness:** The union of all pages for a given filter SHALL contain exactly the same entries as a single request with `limit` set to `totalCount` (no duplicates, no omissions across pages).
> - **Metamorphic:** `GET /journals?date=D` SHALL return a subset of entries returned by `GET /journals?month=YYYY-MM` where `YYYY-MM` is derived from `D`.

---

### Requirement 22: Fetch Single Journal Entry

**User Story:** As a Vyre user, I want to retrieve a single journal entry by its ID, so that I can read it in full detail.

**Screens:** Entry Card detail view

#### Acceptance Criteria

1. WHEN a request for a single Journal_Entry is received with a valid `id`, THE Journal_Service SHALL return the full Journal_Entry record.
2. IF the requested `id` does not belong to the requesting User, THEN THE Journal_Service SHALL return an HTTP 403 Forbidden response.
3. IF the requested `id` does not exist, THEN THE Journal_Service SHALL return an HTTP 404 Not Found response.

---

## MODULE 5 — TREASURE PILL

### Requirement 23: Create Treasure Pill

**User Story:** As a Vyre user, I want to save a Treasure Pill capturing my mood, date, and a song, so that I can revisit that moment in the future.

**Screens:** Treasure Pill creation flow (from journal or reflection)

#### Acceptance Criteria

1. WHEN a Treasure Pill creation request is received with `mood`, `date`, and at least one of `songId` or `songTitle`, THE Treasure_Pill_Service SHALL create a new Treasure_Pill record and return the created entity including `id`.
2. THE Treasure_Pill_Service SHALL validate that `date` is a valid calendar date in `YYYY-MM-DD` format.
3. WHERE a `journalEntryId` is included, THE Treasure_Pill_Service SHALL validate that the Journal_Entry exists and belongs to the requesting User before linking it.
4. IF the `journalEntryId` does not exist or belongs to another User, THEN THE Treasure_Pill_Service SHALL return an HTTP 422 response.
5. THE Treasure_Pill_Service SHALL allow creation of multiple Treasure_Pills on the same date.

---

### Requirement 24: Fetch Treasure Pills (Paginated, Filterable)

**User Story:** As a Vyre user on the Treasure Pill list screen, I want to retrieve my pills filtered by date or month and paginated, so that I can browse my time capsules through the calendar.

**Screens:** `/treasure-pill`

#### Acceptance Criteria

1. WHEN a Treasure Pill list request is received, THE Treasure_Pill_Service SHALL return a paginated list of Treasure_Pills for the requesting User ordered by `date` descending.
2. WHEN a `date` query parameter (`YYYY-MM-DD`) is provided, THE Treasure_Pill_Service SHALL return only pills whose `date` field exactly matches.
3. WHEN a `month` query parameter (`YYYY-MM`) is provided, THE Treasure_Pill_Service SHALL return only pills whose `date` falls within that month.
4. IF both `date` and `month` are provided, THEN THE Treasure_Pill_Service SHALL prioritise `date` and ignore `month`.
5. THE Treasure_Pill_Service SHALL include `id`, `mood`, `day`, `date`, and `songPreview` (containing `songTitle` and `songArtist`) in each list item.
6. WHEN `limit` and `offset` parameters are provided, THE Treasure_Pill_Service SHALL apply offset-based pagination; `limit` SHALL default to 20 and SHALL NOT exceed 100.
7. THE Treasure_Pill_Service SHALL include `totalCount` in the response envelope reflecting the count of pills matching the active filter.
8. IF `offset` exceeds `totalCount`, THEN THE Treasure_Pill_Service SHALL return an empty `data` array with HTTP 200 and the correct `totalCount`.
9. IF any filter or pagination parameter is provided in an invalid format, THEN THE Treasure_Pill_Service SHALL return an HTTP 422 response identifying the offending parameter.

> **Correctness property (pagination completeness):** The union of all pages for a given filter SHALL contain exactly the same Treasure_Pills as a single unbounded request for the same filter.

---

### Requirement 25: Fetch Single Treasure Pill

**User Story:** As a Vyre user, I want to open a specific Treasure Pill to see its mood, date, and associated song, so that I can relive that captured moment.

**Screens:** `/treasure-pill/pill/:id`

#### Acceptance Criteria

1. WHEN a request for a single Treasure_Pill is received with a valid `id`, THE Treasure_Pill_Service SHALL return the full record including `mood`, `date`, `day`, `songName`, `songData`, and `playerIllustrationUrl`.
2. IF the requested `id` does not belong to the requesting User, THEN THE Treasure_Pill_Service SHALL return an HTTP 403 Forbidden response.
3. IF the requested `id` does not exist, THEN THE Treasure_Pill_Service SHALL return an HTTP 404 Not Found response.

---

## MODULE 6 — ENTRY CARD / TIMELINE VIEW

### Requirement 26: Fetch Journal Entries for Timeline

**User Story:** As a Vyre user viewing the calendar or timeline, I want to retrieve journal entries with full display metadata, so that the Entry Card component can render each entry correctly.

**Screens:** Calendar view, Timeline view

#### Acceptance Criteria

1. WHEN a timeline journal request is received, THE Journal_Service SHALL return Journal_Entries including `dayLabel`, `dateNumber`, `thumbnail`, `title`, `time`, `description`, `colorTheme`, `moodAvatar`, and `dateMoodAvatars[]` for each entry.
2. THE Journal_Service SHALL derive `dayLabel` (e.g., `Mo`, `Tu`) and `dateNumber` from the entry's `createdAt` timestamp.
3. THE Journal_Service SHALL derive `dateMoodAvatars[]` as the list of mood avatar URLs for all entries on the same calendar date as the given entry.
4. THE Journal_Service SHALL support filtering by `date` and `month` as specified in Requirement 21.
5. THE Journal_Service SHALL return at most 4 `dateMoodAvatars` per entry (matching the EntryCard UI constraint).

---

## MODULE 7 — USER PROFILE

### Requirement 27: Update User Profile

**User Story:** As a Vyre user, I want to update my display name, companion, and profile photo, so that my profile reflects who I am.

**Screens:** `/profile`

#### Acceptance Criteria

1. WHEN a profile update request is received with one or more of `displayName`, `companionId`, or `profilePhotoUrl`, THE User_Service SHALL update the User record and return the updated profile.
2. IF an updated `companionId` corresponds to a locked Companion for the requesting User, THEN THE User_Service SHALL return an HTTP 403 Forbidden response.
3. THE User_Service SHALL treat the update as a partial update (PATCH semantics); omitted fields SHALL remain unchanged.
4. IF `displayName` is provided but is an empty string or exceeds 50 characters, THEN THE User_Service SHALL return an HTTP 422 response.

---

### Requirement 28: Delete User Account

**User Story:** As a Vyre user, I want to permanently delete my account and all associated data, so that I can exercise my right to erasure.

**Screens:** `/profile` (account settings)

#### Acceptance Criteria

1. WHEN an account deletion request is received, THE User_Service SHALL permanently delete the User record and all associated data (Journal_Entries, Treasure_Pills, Onboarding_Profile, Streaks, Mood history).
2. THE User_Service SHALL require re-authentication (password or OTP confirmation) before processing deletion.
3. WHEN deletion is complete, THE User_Service SHALL invalidate all active session tokens for that User.
4. THE User_Service SHALL return HTTP 204 No Content on successful deletion.
5. IF the re-authentication step fails, THEN THE User_Service SHALL return an HTTP 401 Unauthorized response and SHALL NOT proceed with deletion.

---

## MODULE 8 — STREAK / GAMIFICATION

### Requirement 29: Fetch Streak Status

**User Story:** As a Vyre user, I want to see my current streak count and companion unlock status, so that I am motivated to check in daily.

**Screens:** `/landing`, `/profile`

#### Acceptance Criteria

1. WHEN a streak status request is received, THE Streak_Service SHALL return the User's `currentStreak` (consecutive days), `longestStreak`, and `lastCheckInDate`.
2. THE Streak_Service SHALL include `companionUnlockProgress[]`, a list of objects containing `companionId`, `companionName`, `requiredStreak`, and `unlocked` boolean.
3. THE Streak_Service SHALL calculate `unlocked` as `true` when `currentStreak >= requiredStreak`.

---

### Requirement 30: Daily Check-In

**User Story:** As a Vyre user, I want to perform a daily check-in, so that my streak counter increments and I progress toward unlocking companions.

**Screens:** `/landing`

#### Acceptance Criteria

1. WHEN a check-in request is received, THE Streak_Service SHALL record the check-in timestamp in UTC and compare the UTC calendar date of the check-in against the UTC calendar date of the User's `lastCheckInDate`; IF the current UTC date is the day immediately following `lastCheckInDate`, THEN THE Streak_Service SHALL increment `currentStreak` by 1.
2. WHEN the check-in request is received and the User has already checked in on the same UTC calendar date, THE Streak_Service SHALL return the current streak value unchanged without modifying any record.
3. IF the last check-in was more than 1 UTC calendar day ago, OR if the User has no prior check-in record, THEN THE Streak_Service SHALL set `currentStreak` to 1.
4. WHEN a check-in causes `currentStreak` to reach or exceed a Companion's `requiredStreak`, THE Streak_Service SHALL set that Companion's `locked` status to `false` for the User.
5. WHEN the check-in response is returned, THE Streak_Service SHALL include the updated `currentStreak`, `lastCheckInDate`, and a `newlyUnlocked[]` array containing any Companions unlocked by this check-in (empty array if none).
6. IF a persistence error occurs during check-in, THEN THE Streak_Service SHALL return an HTTP 500 response and SHALL NOT modify `currentStreak` or `lastCheckInDate`.

> **Correctness property (idempotence):** `POST /user/streak/check-in` called N times on the same UTC calendar day SHALL result in `currentStreak` incrementing by exactly 1 relative to the previous day's value.

---

## MODULE 9 — EMOTIONAL TRACKING

### Requirement 31: Fetch Mood History

**User Story:** As a Vyre user, I want to retrieve my mood history filtered by a date range, so that I can observe emotional patterns over time.

**Screens:** Mood history / insights view

#### Acceptance Criteria

1. WHEN a mood history request is received, THE Mood_Service SHALL return a paginated list of mood records for the requesting User ordered by `recordedAt` descending; IF the User has no mood records, THE Mood_Service SHALL return an empty list with HTTP 200.
2. WHEN `startDate` and/or `endDate` query parameters (format `YYYY-MM-DD`) are provided, THE Mood_Service SHALL filter records to those whose UTC date of `recordedAt` falls within the inclusive range `[startDate, endDate]`.
3. THE Mood_Service SHALL include `mood`, `recordedAt`, and `source` in each record, where `source` is one of the enumerated values: `onboarding`, `journal`, `check_in`.
4. WHEN `limit` and `offset` pagination parameters are provided, THE Mood_Service SHALL apply offset-based pagination; `limit` SHALL default to 20 and SHALL NOT exceed 100; `offset` SHALL default to 0.
5. IF `endDate` is earlier than `startDate`, OR if either date string is not in valid `YYYY-MM-DD` format, THEN THE Mood_Service SHALL return an HTTP 422 response identifying the offending parameter.
6. IF `limit` or `offset` is provided but is not a non-negative integer, THEN THE Mood_Service SHALL return an HTTP 422 response with a descriptive error identifying the invalid parameter.

> **Correctness property (completeness):** For a given User and date range `[D1, D2]`, every mood record with `recordedAt` between `D1` and `D2` SHALL appear in the union of all pages of the response.

---

### Requirement 32: Fetch Mood Summary Statistics

**User Story:** As a Vyre user, I want to see aggregated mood statistics, so that I can understand my emotional wellbeing at a glance.

**Screens:** Insights / summary view

#### Acceptance Criteria

1. WHEN a mood summary request is received, THE Mood_Service SHALL return aggregated statistics: `moodCounts` (map of mood → occurrence count), `mostFrequentMood`, `streakMoodAverage`, and `periodStart` / `periodEnd`.
2. THE Mood_Service SHALL support a `period` query parameter with values `week`, `month`, `year`; defaulting to `month` when absent.
3. THE Mood_Service SHALL calculate statistics only from mood records within the specified period.

> **Correctness property (invariant):** The sum of all values in `moodCounts` SHALL equal the total number of mood records for the User within the specified period.

---

## MODULE 10 — CALENDAR VIEW

### Requirement 33: Fetch Journal Entries for Calendar Month

**User Story:** As a Vyre user viewing the calendar, I want to retrieve all journal entries for a given month, so that the calendar can render indicator dots on dates where entries exist.

**Screens:** `/calendar`

#### Acceptance Criteria

1. WHEN a calendar journal request is received with a `month` parameter (format `YYYY-MM`), THE Journal_Service SHALL return all Journal_Entries for the requesting User within that month.
2. THE Journal_Service SHALL include at minimum `id`, `createdAt`, and `mood` per entry so calendar dots can be mood-coloured.
3. IF the `month` parameter is absent or malformed, THEN THE Journal_Service SHALL return an HTTP 422 response.
4. THE Journal_Service SHALL return results ordered by `createdAt` ascending.

---

### Requirement 34: Fetch Treasure Pills for Calendar Month

**User Story:** As a Vyre user viewing the calendar, I want to retrieve all Treasure Pills for a given month, so that the calendar can mark dates where time capsules exist.

**Screens:** `/calendar`, `/treasure-pill`

#### Acceptance Criteria

1. WHEN a calendar Treasure Pill request is received with a `month` parameter (format `YYYY-MM`), THE Treasure_Pill_Service SHALL return all Treasure_Pills for the requesting User within that month.
2. THE Treasure_Pill_Service SHALL include at minimum `id`, `date`, and `mood` per entry.
3. IF the `month` parameter is absent or malformed, THEN THE Treasure_Pill_Service SHALL return an HTTP 422 response.

> **Correctness property (metamorphic):** For any month `M`, the set of dates returned by `GET /treasure-pills?month=M` SHALL be a subset of the set `{YYYY-MM-01 ... YYYY-MM-DD}` where DD is the last day of month M.

---

## Cross-Cutting Requirements

### Requirement 35: Authentication and Authorisation

**User Story:** As the Vyre platform, I want every API endpoint (except auth endpoints) to require a valid session token, so that user data is protected.

#### Acceptance Criteria

1. THE API_Gateway SHALL require a valid Bearer token in the `Authorization` header for all endpoints except `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `POST /auth/otp/request`, and `POST /auth/otp/verify`.
2. IF a request to a protected endpoint is made without a valid token, THEN THE API_Gateway SHALL return an HTTP 401 Unauthorized response.
3. THE API_Gateway SHALL enforce User-scoped data isolation: a User SHALL only be able to read or modify their own Journal_Entries, Treasure_Pills, Streak data, and Mood history.
4. IF a User attempts to access another User's resource, THEN THE API_Gateway SHALL return an HTTP 403 Forbidden response.

---

### Requirement 36: Error Response Format

**User Story:** As a Vyre frontend developer, I want all API errors to follow a consistent response structure, so that error handling in the client is uniform.

#### Acceptance Criteria

1. THE API_Gateway SHALL return all error responses in the following JSON structure: `{ "error": { "code": string, "message": string, "details"?: any } }`.
2. THE API_Gateway SHALL use standard HTTP status codes as defined in each requirement.
3. IF a request body cannot be parsed as valid JSON, THEN THE API_Gateway SHALL return an HTTP 400 Bad Request with `code: "INVALID_JSON"`.
