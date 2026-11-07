export const FULL_SPEC_MARKDOWN = `# Student Resource Hub: Comprehensive Technical Specification & System Architecture

## 1. System Context & Architectural Goal
The **Student Resource Hub** is a centralized, secure, university-grade web platform engineered to connect students with verified campus happenings, automate capacity-restricted event reservations (RSVP), and provide an authoritative directory of essential campus resources (academic, counseling, transit, and facilities).

### High-Level Architecture
- **Client Tier**: Single Page Application (React 19 + TypeScript + Tailwind CSS) with client-side routing, optimistic state management, and accessible WCAG AA interfaces.
- **API & Application Gateway Tier**: Node.js / Express 4.x with RESTful endpoints, Zod schema validation, CORS origin isolation, and JWT / cookie session middleware.
- **Persistence Tier**: Relational PostgreSQL 16 database for ACID compliance, referential integrity, and timestamp range collision checks; paired with Redis 7 for distributed caching and token-family replay revocation.

---

## 2. User Roles & Access Control Matrix (RBAC)

| Capability / Action | Guest (Unauthenticated) | Student (Authenticated) | Organizer / Admin (Elevated) |
| :--- | :---: | :---: | :---: |
| View Public Events & Resource Directory | ✅ | ✅ | ✅ |
| Account Registration & Login | ✅ | ✅ | ✅ |
| Password Reset Self-Service | ✅ | ✅ | ✅ |
| Manage Profile (Student ID, Dept, Phone) | ❌ | ✅ | ✅ |
| Filter Events (Date, Venue, Category) | ✅ | ✅ | ✅ |
| Event Bookmarking & Personal Calendar Sync | ❌ | ✅ | ✅ |
| RSVP Seat Reservation & Cancellation | ❌ | ✅ | ✅ |
| Create, Edit & Delete Campus Events | ❌ | ❌ | ✅ |
| Manage Attendee Rosters & CSV Export | ❌ | ❌ | ✅ |
| Broadcast Live Announcements to RSVPs | ❌ | ❌ | ✅ |

---

## 3. Detailed Process & Data Flows

### A. Authentication & Session Management Process Flow
1. **Registration & Input Sanitization**:
   - Client sends \`POST /api/v1/auth/register\` with \`fullName\`, \`email\`, \`password\`, and optional \`studentId\`.
   - Zod schema validates institutional email domain (\`.edu\`) and password complexity ($\ge 8$ chars, $\ge 1$ digit, $\ge 1$ uppercase, $\ge 1$ symbol).
2. **Cryptographic Salt & Password Hashing**:
   - Backend hashes password using **Argon2id** (RFC 9106) with parameters: memory cost 64 MB (\`m=65536\`), time iterations 3 (\`t=3\`), and parallelism 1 (\`p=1\`).
   - Plaintext passwords never touch logs, caches, or persistent storage.
3. **Atomic User & Role Persistence**:
   - Database transaction creates record in \`users\` table and inserts a corresponding link into \`user_roles\` junction table linking the default role \`'student'\`.
4. **Dual-Token Issuance & Refresh Token Rotation**:
   - An **Access Token** (JWT, RS256/HS256) is issued with 15-minute lifespan containing claims: \`{ sub: userId, email, role: 'student', exp }\`.
   - A **Refresh Token** (cryptographically secure random 256-bit string) is issued inside an \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` cookie with 7-day lifespan.
   - The refresh token hash is recorded in Redis with a \`familyId\`. If a revoked or reused refresh token is presented, the entire token family is immediately purged (RFC 6749 security).
5. **Protected Route Authorization Guard**:
   - For authenticated requests, client supplies \`Authorization: Bearer <accessToken>\`.
   - Express middleware validates the cryptographic signature and expiration.
   - Role verification middleware (\`requireRole('student' | 'organizer' | 'admin')\`) inspects the \`role\` claim, returning \`401 Unauthorized\` if missing/expired or \`403 Forbidden\` if the role level is insufficient.

### B. Event Creation & Publishing Process Flow
1. **Form Submission & Parameter Validation**:
   - Organizer submits \`POST /api/v1/events\` with: \`title\`, \`description\`, \`category\`, \`venueName\`, \`venueRoom\`, \`venueAddress\`, \`startTime\`, \`endTime\`, \`speakerHost\`, \`capacity\`, and \`bannerUrl\`.
   - Validates that \`endTime > startTime\`, \`startTime > now()\`, and \`capacity > 0\`.
2. **RBAC Authorization Gate**:
   - Backend middleware validates caller token contains \`'organizer'\` or \`'admin'\` role claim. Students or guests attempting this endpoint receive strict \`403 Forbidden\`.
3. **Venue Collision Check & Database Insertion**:
   - Executes PostgreSQL range overlap query:
     \`\`\`sql
     SELECT id, title FROM events 
     WHERE venue_name = $1 AND venue_room = $2 AND status = 'published'
       AND tstzrange(start_time, end_time) && tstzrange($3, $4)
     LIMIT 1;
     \`\`\`
   - If collision is detected, returns \`409 Conflict\`. Otherwise, commits event with \`status = 'published'\` and \`attendee_count = 0\`.
4. **Cache Invalidation & Event Broker Notification**:
   - Redis cache keys (\`events:discovery:*\`) are invalidated.
   - Message is published to broker for event digest workers.
5. **Real-Time Client Discovery**:
   - New event renders immediately across discovery views with explicit **Venue**, **Date**, and **Time** metadata.

---

## 4. Relational Database Schema Specification (ERD)

### PostgreSQL DDL Schema
\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    student_id VARCHAR(32) UNIQUE,
    department VARCHAR(100),
    phone VARCHAR(24),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_student_id ON users(student_id) WHERE student_id IS NOT NULL;

-- ROLES
CREATE TABLE roles (
    id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(32) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

-- USER_ROLES JUNCTION
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id SMALLINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    granted_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    granted_by UUID REFERENCES users(id),
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id)
);

-- EVENTS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    venue_name VARCHAR(150) NOT NULL,
    venue_room VARCHAR(80) NOT NULL,
    venue_address VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    speaker_host VARCHAR(150) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    attendee_count INTEGER DEFAULT 0 NOT NULL CHECK (attendee_count >= 0),
    banner_url TEXT,
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(24) DEFAULT 'published' NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    CONSTRAINT chk_event_times CHECK (end_time > start_time)
);

CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_venue_name ON events(venue_name);

-- EVENT RSVPS
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE UNIQUE INDEX idx_unique_event_user_rsvp ON event_rsvps(event_id, user_id) 
WHERE status != 'cancelled';

-- EVENT BOOKMARKS
CREATE TABLE event_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE UNIQUE INDEX idx_unique_event_user_bookmark ON event_bookmarks(event_id, user_id);
\`\`\`

---

## 5. RESTful API Endpoint Architecture

| Method | Endpoint Path | Role Required | Summary & Description | Success Code |
| :--- | :--- | :--- | :--- | :---: |
| **POST** | \`/api/v1/auth/register\` | Guest (Public) | Registers new student account with Argon2id password hash | 201 |
| **POST** | \`/api/v1/auth/login\` | Guest (Public) | Authenticates credentials; issues short-lived JWT & HttpOnly cookie | 200 |
| **POST** | \`/api/v1/auth/refresh\` | Public / Cookie | Rotates refresh token and issues fresh JWT access token | 200 |
| **POST** | \`/api/v1/auth/logout\` | Authenticated | Revokes refresh token in Redis and clears HttpOnly cookie | 204 |
| **POST** | \`/api/v1/auth/forgot-password\` | Guest (Public) | Generates cryptographically secure password reset token | 200 |
| **GET** | \`/api/v1/users/me\` | Authenticated | Returns authenticated user identity, role, and profile details | 200 |
| **PUT** | \`/api/v1/users/me/profile\` | Authenticated | Updates student ID, department, contact phone, or full name | 200 |
| **GET** | \`/api/v1/events\` | Guest (Public) | Retrieves paginated events with filters (venue, category, date, search) | 200 |
| **POST** | \`/api/v1/events\` | Organizer / Admin | Creates and publishes new campus event after venue conflict check | 201 |
| **PUT** | \`/api/v1/events/:id\` | Organizer / Admin | Updates event parameters and schedule details | 200 |
| **DELETE** | \`/api/v1/events/:id\` | Organizer / Admin | Cancels / deletes event and notifies confirmed attendees | 204 |
| **POST** | \`/api/v1/events/:id/rsvp\` | Student / Admin | Atomic seat reservation check; increments attendee count or waitlists | 201 |
| **DELETE** | \`/api/v1/events/:id/rsvp\` | Student / Admin | Cancels RSVP and promotes next student from waitlist | 200 |
| **GET** | \`/api/v1/events/:id/attendees\` | Organizer / Admin | Exports attendee roster with contact info and student IDs | 200 |
| **POST** | \`/api/v1/events/:id/updates\` | Organizer / Admin | Publishes broadcast announcement to all confirmed event attendees | 201 |
| **POST** | \`/api/v1/events/:id/bookmark\` | Student / Admin | Toggles event bookmark in student’s saved events list | 200 |
| **GET** | \`/api/v1/resources\` | Guest (Public) | Returns categorized student resources directory | 200 |

---

## 6. Actionable Task Breakdown (Sprint Checklist)

### Phase 1: Environment & Auth Setup
- [x] **T101 (DevOps)**: Project Scaffolding & Containerized Environment (PostgreSQL + Redis + Node.js + Vite).
- [x] **T102 (Backend)**: Password Hashing & Registration Endpoint (\`POST /api/v1/auth/register\` with Argon2id).
- [x] **T103 (Security)**: JWT Authentication & Refresh Token Rotation with Redis token family revocation.
- [x] **T104 (Frontend)**: React AuthContext with Axios response interceptor for transparent 401 refresh.

### Phase 2: Database & Backend Core Logic
- [x] **T201 (Backend)**: Database Migrations for \`users\`, \`roles\`, \`events\`, \`event_rsvps\`, and indices.
- [x] **T202 (Backend)**: Multi-Attribute Event Query Engine supporting date range, venue, and tag filters.
- [x] **T203 (Backend)**: Concurrency-Safe RSVP Transaction Handler with \`SELECT ... FOR UPDATE\` capacity guards.
- [x] **T204 (Backend)**: Campus Resource Directory Query Endpoint with 1-hour Redis caching.

### Phase 3: Frontend UI Components & Event Views
- [x] **T301 (Frontend)**: Top Bar Navigation & Responsive Layout meeting WCAG AA and Zero-Pill standards.
- [x] **T302 (Frontend)**: Multi-View Discovery Grid & Agenda Calendar displaying explicit Venue, Date, Time.
- [x] **T303 (Frontend)**: Event Details Modal with capacity progress bar, 1-click RSVP, and bookmarking.
- [x] **T304 (Frontend)**: Interactive Student Resource Directory with direct contact links and operational hours.

### Phase 4: Role-Based Authorization & Protected Actions
- [x] **T401 (Security)**: Backend RBAC Middleware evaluating \`requireRole('organizer', 'admin')\`.
- [x] **T402 (Frontend)**: Organizer Event Creation Studio with date/time collision prevention.
- [x] **T403 (Frontend)**: Attendee Roster Inspection Drawer & Announcement Broadcaster with CSV export.
- [x] **T404 (Frontend)**: Student Profile & My Campus Hub dashboard for managing RSVPs and saved events.

### Phase 5: Testing & Deployment
- [x] **T501 (DevOps)**: End-to-End Automated Testing (Playwright) covering registration -> RSVP -> organizer flow.
- [x] **T502 (Security)**: OWASP Top 10 Security Audit: Helmet headers, rate-limiting, and CORS lockdowns.
- [x] **T503 (DevOps)**: CI/CD Pipeline & Cloud Run Production Deployment with automated health checks.
`;
