import {
  UserProfile,
  CampusEvent,
  CampusResource,
  EventRSVP,
  EventBookmark,
  SchemaTableSpec,
  ApiEndpointSpec,
  SprintTask
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_student_01',
    fullName: 'Jane Doe',
    email: 'jane.doe@university.edu',
    studentId: 'STU-984210',
    department: 'Computer Science & Engineering',
    phone: '+1 (555) 234-5678',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'usr_admin_01',
    fullName: 'Dr. Aris Thorne',
    email: 'aris.thorne@university.edu',
    studentId: 'FAC-10023',
    department: 'Dean of Student Affairs & Activities',
    phone: '+1 (555) 876-5432',
    role: 'organizer_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    createdAt: '2026-01-15T09:30:00Z'
  }
];

export const INITIAL_EVENTS: CampusEvent[] = [
  {
    id: 'evt_001',
    title: 'Annual Campus Innovation & Tech Expo 2026',
    description: 'Explore groundbreaking undergraduate research, robotics showcases, startup demos, and AI product displays. Connect with industry sponsors and alumni founders over keynotes and live prototyping sessions.',
    category: 'Technology',
    venueName: 'St. Mark University Library & Tech Commons',
    venueRoom: 'Main Exhibition Pavilion & Atrium',
    venueAddress: '120 Campus Drive, East Quad',
    date: '2026-11-15',
    startTime: '10:00',
    endTime: '16:30',
    speakerHost: 'Dr. Elena Rostova (Chair of Robotics Lab) & Tech Union',
    capacity: 250,
    attendeeCount: 184,
    bannerUrl: '/src/assets/images/campus_quad_gathering_1794039953331.jpg',
    organizerId: 'usr_admin_01',
    organizerName: 'Dr. Aris Thorne',
    isFeatured: true,
    updates: [
      {
        id: 'upd_01',
        timestamp: '2026-11-05T14:30:00Z',
        authorName: 'Dr. Aris Thorne',
        message: 'Keynote schedule finalized. Hardware demo teams must check in at 08:30 AM for booth power calibration.'
      }
    ]
  },
  {
    id: 'evt_002',
    title: 'Global Sustainability & Renewable Energy Symposium',
    description: 'An interdisciplinary conference focusing on clean tech, sustainable urban planning, and university decarbonization initiatives. Features panels from environmental science researchers and regional policy leaders.',
    category: 'Academic',
    venueName: 'Kresge Memorial Lecture Hall',
    venueRoom: 'Auditorium A, Ground Floor',
    venueAddress: '45 University Way, Science Sector',
    date: '2026-11-18',
    startTime: '13:00',
    endTime: '17:00',
    speakerHost: 'Prof. Marcus Vance (Center for Climate Policy)',
    capacity: 180,
    attendeeCount: 142,
    bannerUrl: '/src/assets/images/academic_symposium_hall_1794039953003.jpg',
    organizerId: 'usr_admin_01',
    organizerName: 'Dr. Aris Thorne',
    isFeatured: true,
    updates: []
  },
  {
    id: 'evt_003',
    title: 'Fall Semester Campus Mixer & Student Club Fest',
    description: 'Discover over 80+ student organizations, recreational clubs, community service teams, and artistic societies. Free refreshments, live acoustic sets, and club registration kiosks throughout the commons.',
    category: 'Social',
    venueName: 'Student Union Commons',
    venueRoom: 'Central Plaza & Great Lawn',
    venueAddress: '200 Student Way, Central Campus',
    date: '2026-11-12',
    startTime: '16:00',
    endTime: '20:00',
    speakerHost: 'Campus Activities Board (CAB)',
    capacity: 500,
    attendeeCount: 395,
    bannerUrl: '/src/assets/images/campus_student_commons_1794039953412.jpg',
    organizerId: 'usr_admin_01',
    organizerName: 'Dr. Aris Thorne',
    isFeatured: false,
    updates: []
  },
  {
    id: 'evt_004',
    title: 'University Career & Internship Fair: Engineering & Business',
    description: 'Meet over 65 top employers hiring for summer 2027 internships, co-ops, and full-time entry-level engineering, finance, and product roles. Professional headshot booth open all day.',
    category: 'Career',
    venueName: 'Alumni Recreation Center',
    venueRoom: 'Multi-Purpose Fieldhouse Arena',
    venueAddress: '88 North Athletics Boulevard',
    date: '2026-11-20',
    startTime: '11:00',
    endTime: '15:30',
    speakerHost: 'Career Services Center & Alumni Relations',
    capacity: 600,
    attendeeCount: 512,
    bannerUrl: '/src/assets/images/campus_student_commons_1794039953412.jpg',
    organizerId: 'usr_admin_01',
    organizerName: 'Dr. Aris Thorne',
    isFeatured: false,
    updates: []
  },
  {
    id: 'evt_005',
    title: 'Intercollegiate 3v3 Basketball Tournament & Tailgate',
    description: 'Campus-wide bracket showdown between intramural teams with courtside DJ, food trucks, and half-court prize contest. Spectator entry is free with student ID.',
    category: 'Sports',
    venueName: 'Varsity Fieldhouse',
    venueRoom: 'East Pavilion Gymnasium',
    venueAddress: '92 North Athletics Boulevard',
    date: '2026-11-22',
    startTime: '15:00',
    endTime: '19:00',
    speakerHost: 'Recreational Sports Division',
    capacity: 300,
    attendeeCount: 220,
    bannerUrl: '/src/assets/images/campus_quad_gathering_1794039953331.jpg',
    organizerId: 'usr_admin_01',
    organizerName: 'Dr. Aris Thorne',
    isFeatured: false,
    updates: []
  },
  {
    id: 'evt_006',
    title: 'Fine Arts Fall Showcase & Live Ensemble Performance',
    description: 'An evening celebrating student visual artwork, ceramic sculptures, and chamber orchestra performances. Complimentary cider and light refreshments served during the gallery preview.',
    category: 'Arts',
    venueName: 'Center for Performing Arts',
    venueRoom: 'Black Box Studio & Main Gallery',
    venueAddress: '15 Creative Arts Circle',
    date: '2026-11-25',
    startTime: '18:30',
    endTime: '21:00',
    speakerHost: 'Department of Fine & Applied Arts',
    capacity: 150,
    attendeeCount: 98,
    bannerUrl: '/src/assets/images/academic_symposium_hall_1794039953003.jpg',
    organizerId: 'usr_admin_01',
    organizerName: 'Dr. Aris Thorne',
    isFeatured: false,
    updates: []
  }
];

export const INITIAL_RESOURCES: CampusResource[] = [
  {
    id: 'res_01',
    name: 'Academic Peer Tutoring & Writing Center',
    category: 'Academic',
    description: 'One-on-one and group tutoring for STEM, humanities, and coding, plus comprehensive writing and research paper review assistance.',
    location: 'Main Library, 2nd Floor West Wing',
    hours: 'Mon-Thu: 08:00 - 22:00, Fri: 08:00 - 17:00, Sun: 13:00 - 21:00',
    contactEmail: 'tutoring@university.edu',
    contactPhone: '+1 (555) 432-1001',
    linkUrl: '#resource-tutoring',
    isPopular: true
  },
  {
    id: 'res_02',
    name: 'Student Health & Counseling Psychological Services (CAPS)',
    category: 'Health & Counseling',
    description: 'Confidential mental health support, crisis drop-in counseling, primary care clinic, immunization services, and wellness workshops.',
    location: 'Wellness Center Building, Suite 300',
    hours: 'Mon-Fri: 08:30 - 17:00 (24/7 Crisis Hotline Available)',
    contactEmail: 'caps-health@university.edu',
    contactPhone: '+1 (555) 432-1002',
    linkUrl: '#resource-health',
    isPopular: true
  },
  {
    id: 'res_03',
    name: '24/7 Collaborative Study Pods & Library Reserves',
    category: 'Facilities',
    description: 'Quiet individual study carrels, soundproof team discussion pods equipped with 4K presentation monitors, and course textbook reserves.',
    location: 'St. Mark Library, Ground & 3rd Floors',
    hours: '24 Hours / 7 Days with Active Student ID Badge',
    contactEmail: 'library-help@university.edu',
    contactPhone: '+1 (555) 432-1003',
    linkUrl: '#resource-library',
    isPopular: true
  },
  {
    id: 'res_04',
    name: 'Career & Professional Development Center',
    category: 'Career',
    description: 'Resume and portfolio audits, mock technical and behavioral interviews, career fairs, and alumni mentoring matchmaking programs.',
    location: 'Student Union, Level 2, Room 240',
    hours: 'Mon-Fri: 09:00 - 16:30',
    contactEmail: 'careers@university.edu',
    contactPhone: '+1 (555) 432-1004',
    linkUrl: '#resource-career',
    isPopular: true
  },
  {
    id: 'res_05',
    name: 'Campus Transit, SafeRide & Shuttle Tracking',
    category: 'Facilities',
    description: 'Live GPS campus loop bus timetables, accessible shuttle van reservations, and after-hours evening campus safety escort dispatch.',
    location: 'Central Transportation Depot / SafeRide Kiosk',
    hours: 'Loop Buses: 06:30 - 23:30; SafeRide: 19:00 - 03:00 Daily',
    contactEmail: 'transit@university.edu',
    contactPhone: '+1 (555) 432-1005',
    linkUrl: '#resource-transit'
  },
  {
    id: 'res_06',
    name: 'MakerSpace, 3D Print Lab & Tech Checkout',
    category: 'Technology',
    description: 'Free access to high-precision 3D printers, laser cutters, electronics soldering benches, and laptop/camera loaner gear.',
    location: 'Engineering Science Quad, Hall 115',
    hours: 'Mon-Fri: 10:00 - 20:00, Sat: 11:00 - 16:00',
    contactEmail: 'makerspace@university.edu',
    contactPhone: '+1 (555) 432-1006',
    linkUrl: '#resource-makerspace'
  },
  {
    id: 'res_07',
    name: 'Emergency Student Food Pantry & Aid Services',
    category: 'Financial & Food',
    description: 'Nutritious groceries, fresh produce, personal hygiene supplies, and emergency mini-grant microfinance aid for students in need.',
    location: 'University Hall Annex, Room 012',
    hours: 'Tue, Wed, Thu: 11:00 - 18:00',
    contactEmail: 'foodpantry@university.edu',
    contactPhone: '+1 (555) 432-1007',
    linkUrl: '#resource-foodpantry'
  },
  {
    id: 'res_08',
    name: 'Office of Financial Aid & Scholarship Advisory',
    category: 'Financial & Food',
    description: 'Assistance with FAFSA filing, work-study employment placement, institutional scholarship disbursements, and emergency tuition loans.',
    location: 'Administration Tower, 1st Floor Hall',
    hours: 'Mon-Fri: 08:30 - 16:00',
    contactEmail: 'finaid@university.edu',
    contactPhone: '+1 (555) 432-1008',
    linkUrl: '#resource-finaid'
  }
];

export const INITIAL_RSVPS: EventRSVP[] = [
  {
    id: 'rsvp_01',
    eventId: 'evt_001',
    userId: 'usr_student_01',
    userName: 'Jane Doe',
    userEmail: 'jane.doe@university.edu',
    studentId: 'STU-984210',
    registeredAt: '2026-11-02T11:20:00Z',
    status: 'confirmed'
  },
  {
    id: 'rsvp_02',
    eventId: 'evt_002',
    userId: 'usr_student_01',
    userName: 'Jane Doe',
    userEmail: 'jane.doe@university.edu',
    studentId: 'STU-984210',
    registeredAt: '2026-11-03T09:15:00Z',
    status: 'confirmed'
  }
];

export const INITIAL_BOOKMARKS: EventBookmark[] = [
  {
    id: 'bm_01',
    eventId: 'evt_001',
    userId: 'usr_student_01',
    bookmarkedAt: '2026-11-02T11:18:00Z'
  },
  {
    id: 'bm_02',
    eventId: 'evt_004',
    userId: 'usr_student_01',
    bookmarkedAt: '2026-11-04T15:40:00Z'
  }
];

export const SCHEMA_TABLES: SchemaTableSpec[] = [
  {
    name: 'users',
    description: 'Stores core account credentials, identity, contact information, and departmental affiliation.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique user identifier', isPrimary: true },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NOT NULL', description: 'University or personal email address used for authentication' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Argon2id or bcrypt (cost 12) salted password hash' },
      { name: 'full_name', type: 'VARCHAR(120)', constraints: 'NOT NULL', description: 'Full legal or preferred name of the user' },
      { name: 'student_id', type: 'VARCHAR(32)', constraints: 'NULLABLE UNIQUE', description: 'University issued matriculation / ID number (optional for non-students)' },
      { name: 'department', type: 'VARCHAR(100)', constraints: 'NULLABLE', description: 'Academic major or administrative department' },
      { name: 'phone', type: 'VARCHAR(24)', constraints: 'NULLABLE', description: 'SMS-capable mobile phone number for urgent notifications' },
      { name: 'avatar_url', type: 'TEXT', constraints: 'NULLABLE', description: 'Public URL to profile photograph' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT true NOT NULL', description: 'Soft-deletion flag for disabled or deactivated accounts' },
      { name: 'email_verified_at', type: 'TIMESTAMPTZ', constraints: 'NULLABLE', description: 'Verification timestamp for campus email confirmation' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Account registration timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Last account modification timestamp' }
    ],
    indices: [
      'CREATE UNIQUE INDEX idx_users_email ON users(email);',
      'CREATE UNIQUE INDEX idx_users_student_id ON users(student_id) WHERE student_id IS NOT NULL;'
    ]
  },
  {
    name: 'roles',
    description: 'Defines permission tiers: Guest, Student, Organizer, Admin.',
    columns: [
      { name: 'id', type: 'SMALLINT', constraints: 'PRIMARY KEY GENERATED ALWAYS AS IDENTITY', description: 'Role identifier', isPrimary: true },
      { name: 'name', type: 'VARCHAR(32)', constraints: 'UNIQUE NOT NULL', description: 'Role code: guest, student, organizer, admin' },
      { name: 'description', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Human-readable explanation of permissions' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Creation timestamp' }
    ],
    indices: [
      'CREATE UNIQUE INDEX idx_roles_name ON roles(name);'
    ]
  },
  {
    name: 'user_roles',
    description: 'Junction table supporting RBAC (Role-Based Access Control) assignments.',
    columns: [
      { name: 'user_id', type: 'UUID', constraints: 'NOT NULL REFERENCES users(id) ON DELETE CASCADE', description: 'Foreign key to users table', isForeign: true },
      { name: 'role_id', type: 'SMALLINT', constraints: 'NOT NULL REFERENCES roles(id) ON DELETE RESTRICT', description: 'Foreign key to roles table', isForeign: true },
      { name: 'granted_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Timestamp when role was granted' },
      { name: 'granted_by', type: 'UUID', constraints: 'NULLABLE REFERENCES users(id)', description: 'Admin user who elevated privileges', isForeign: true }
    ],
    indices: [
      'ALTER TABLE user_roles ADD CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id);',
      'CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);'
    ]
  },
  {
    name: 'events',
    description: 'Campus event entities with venue, dates, speakers, limits, and status.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique event identifier', isPrimary: true },
      { name: 'title', type: 'VARCHAR(200)', constraints: 'NOT NULL', description: 'Event title' },
      { name: 'slug', type: 'VARCHAR(220)', constraints: 'UNIQUE NOT NULL', description: 'URL-friendly slug generated from title and date' },
      { name: 'description', type: 'TEXT', constraints: 'NOT NULL', description: 'Comprehensive markdown event summary and schedule' },
      { name: 'category', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Tag/Category: Academic, Social, Sports, Career, Arts, Technology' },
      { name: 'venue_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Name of the building or athletic facility' },
      { name: 'venue_room', type: 'VARCHAR(80)', constraints: 'NOT NULL', description: 'Room, Hall, Auditorium, or outdoor quad zone' },
      { name: 'venue_address', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Physical street address or campus sector code' },
      { name: 'start_time', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Event start timestamp with timezone' },
      { name: 'end_time', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Event end timestamp (CHECK end_time > start_time)' },
      { name: 'speaker_host', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Keynote speaker, club name, or department host' },
      { name: 'capacity', type: 'INTEGER', constraints: 'NOT NULL CHECK (capacity > 0)', description: 'Maximum allowed attendee seats' },
      { name: 'attendee_count', type: 'INTEGER', constraints: 'DEFAULT 0 NOT NULL CHECK (attendee_count >= 0)', description: 'Current count of confirmed RSVPs' },
      { name: 'banner_url', type: 'TEXT', constraints: 'NULLABLE', description: 'Hero banner artwork URL' },
      { name: 'organizer_id', type: 'UUID', constraints: 'NOT NULL REFERENCES users(id) ON DELETE RESTRICT', description: 'User who created the event', isForeign: true },
      { name: 'status', type: 'VARCHAR(24)', constraints: "DEFAULT 'published' NOT NULL", description: 'Lifecycle status: draft, published, cancelled, completed' },
      { name: 'is_featured', type: 'BOOLEAN', constraints: 'DEFAULT false NOT NULL', description: 'Featured banner badge in discovery view' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Last updated timestamp' }
    ],
    indices: [
      'CREATE INDEX idx_events_start_time ON events(start_time);',
      'CREATE INDEX idx_events_category ON events(category);',
      'CREATE INDEX idx_events_venue_name ON events(venue_name);',
      'CREATE INDEX idx_events_organizer_id ON events(organizer_id);'
    ]
  },
  {
    name: 'event_rsvps',
    description: 'Tracks user RSVP registrations, capacity reservation, and waitlist order.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique RSVP ticket identifier', isPrimary: true },
      { name: 'event_id', type: 'UUID', constraints: 'NOT NULL REFERENCES events(id) ON DELETE CASCADE', description: 'Referenced event', isForeign: true },
      { name: 'user_id', type: 'UUID', constraints: 'NOT NULL REFERENCES users(id) ON DELETE CASCADE', description: 'Registered student/user', isForeign: true },
      { name: 'status', type: 'VARCHAR(20)', constraints: "DEFAULT 'confirmed' NOT NULL", description: 'State: confirmed, waitlist, cancelled, attended' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Registration timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Status change timestamp' }
    ],
    indices: [
      'CREATE UNIQUE INDEX idx_unique_event_user_rsvp ON event_rsvps(event_id, user_id) WHERE status != \'cancelled\';',
      'CREATE INDEX idx_rsvps_user_id ON event_rsvps(user_id);',
      'CREATE INDEX idx_rsvps_event_id ON event_rsvps(event_id);'
    ]
  },
  {
    name: 'event_bookmarks',
    description: 'Allows students to save and track events of interest.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique bookmark identifier', isPrimary: true },
      { name: 'event_id', type: 'UUID', constraints: 'NOT NULL REFERENCES events(id) ON DELETE CASCADE', description: 'Target bookmarked event', isForeign: true },
      { name: 'user_id', type: 'UUID', constraints: 'NOT NULL REFERENCES users(id) ON DELETE CASCADE', description: 'User who saved the event', isForeign: true },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Bookmark creation timestamp' }
    ],
    indices: [
      'CREATE UNIQUE INDEX idx_unique_event_user_bookmark ON event_bookmarks(event_id, user_id);',
      'CREATE INDEX idx_bookmarks_user_id ON event_bookmarks(user_id);'
    ]
  },
  {
    name: 'event_updates',
    description: 'Notices and schedule announcements published by organizers to attendees.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Unique update identifier', isPrimary: true },
      { name: 'event_id', type: 'UUID', constraints: 'NOT NULL REFERENCES events(id) ON DELETE CASCADE', description: 'Associated event', isForeign: true },
      { name: 'author_id', type: 'UUID', constraints: 'NOT NULL REFERENCES users(id) ON DELETE RESTRICT', description: 'Organizer author', isForeign: true },
      { name: 'message', type: 'TEXT', constraints: 'NOT NULL', description: 'Update announcement text' },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT clock_timestamp() NOT NULL', description: 'Publication timestamp' }
    ],
    indices: [
      'CREATE INDEX idx_event_updates_event_id ON event_updates(event_id);'
    ]
  }
];

export const API_ENDPOINTS: ApiEndpointSpec[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    roleRequired: 'Guest (Public)',
    summary: 'Register new student user account',
    description: 'Validates input, checks for unique email, hashes password using Argon2id/bcrypt, creates user and assigns default Student role.',
    requestBody: JSON.stringify({
      fullName: 'Jane Doe',
      email: 'jane.doe@university.edu',
      password: 'SecurePassword123!',
      studentId: 'STU-984210'
    }, null, 2),
    statusSuccess: 201,
    responseSuccess: JSON.stringify({
      message: 'Account successfully registered.',
      user: {
        id: 'usr_abc123',
        fullName: 'Jane Doe',
        email: 'jane.doe@university.edu',
        studentId: 'STU-984210',
        role: 'student'
      },
      tokens: {
        accessToken: 'eyJhbGciOiJIUzI1Ni...',
        expiresIn: 900
      }
    }, null, 2),
    errorCodes: [
      { code: 400, reason: 'Validation failed: Invalid email format or weak password' },
      { code: 409, reason: 'Email or Student ID is already registered' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    roleRequired: 'Guest (Public)',
    summary: 'Authenticate user with email and password',
    description: 'Verifies email and password hash, sets HTTP-only Secure SameSite=Strict refresh token cookie, and returns short-lived JWT access token.',
    requestBody: JSON.stringify({
      email: 'jane.doe@university.edu',
      password: 'SecurePassword123!'
    }, null, 2),
    statusSuccess: 200,
    responseSuccess: JSON.stringify({
      user: {
        id: 'usr_abc123',
        fullName: 'Jane Doe',
        email: 'jane.doe@university.edu',
        role: 'student'
      },
      tokens: {
        accessToken: 'eyJhbGciOiJIUzI1Ni...',
        tokenType: 'Bearer',
        expiresIn: 900
      }
    }, null, 2),
    errorCodes: [
      { code: 401, reason: 'Invalid email or password credentials' },
      { code: 429, reason: 'Too many failed login attempts; rate-limited for 15 minutes' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/auth/refresh',
    roleRequired: 'Guest / Expired Token',
    summary: 'Rotate refresh token and issue fresh access token',
    description: 'Validates HTTP-only refresh cookie, invalidates old refresh token in Redis, and issues fresh access token and new rotated refresh token.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({
      accessToken: 'eyJhbGciOiJIUzI1Ni...',
      expiresIn: 900
    }, null, 2),
    errorCodes: [
      { code: 401, reason: 'Refresh token missing, expired, or revoked' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/auth/logout',
    roleRequired: 'Student / Organizer / Admin',
    summary: 'Invalidate session & clear refresh cookie',
    description: 'Revokes the refresh token from Redis token-family blacklist and clears client HTTP-only cookie.',
    statusSuccess: 204,
    responseSuccess: 'No Content',
    errorCodes: [
      { code: 401, reason: 'Unauthenticated user' }
    ]
  },
  {
    method: 'GET',
    path: '/api/v1/users/me',
    roleRequired: 'Student / Organizer / Admin',
    summary: 'Retrieve authenticated user profile',
    description: 'Fetches the current user identity, assigned roles, department, and contact information.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({
      id: 'usr_student_01',
      fullName: 'Jane Doe',
      email: 'jane.doe@university.edu',
      studentId: 'STU-984210',
      department: 'Computer Science',
      phone: '+1 (555) 234-5678',
      role: 'student'
    }, null, 2),
    errorCodes: [
      { code: 401, reason: 'Missing or expired Bearer token' }
    ]
  },
  {
    method: 'PUT',
    path: '/api/v1/users/me/profile',
    roleRequired: 'Student / Organizer / Admin',
    summary: 'Update personal profile details',
    description: 'Allows updating full name, phone number, department, and avatar URL.',
    requestBody: JSON.stringify({
      fullName: 'Jane Doe',
      department: 'Data Science & AI',
      phone: '+1 (555) 999-0011'
    }, null, 2),
    statusSuccess: 200,
    responseSuccess: JSON.stringify({
      message: 'Profile updated successfully',
      user: { id: 'usr_student_01', fullName: 'Jane Doe', department: 'Data Science & AI' }
    }, null, 2),
    errorCodes: [
      { code: 400, reason: 'Invalid profile payload or character constraint exceeded' }
    ]
  },
  {
    method: 'GET',
    path: '/api/v1/events',
    roleRequired: 'Public (Guest / Student / Admin)',
    summary: 'Discover and filter published campus events',
    description: 'Returns paginated events list with filtering by category, venue, start date range, and text search.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({
      data: [
        {
          id: 'evt_001',
          title: 'Annual Campus Innovation & Tech Expo 2026',
          category: 'Technology',
          venueName: 'St. Mark University Library',
          venueRoom: 'Main Exhibition Pavilion',
          date: '2026-11-15',
          startTime: '10:00',
          endTime: '16:30',
          speakerHost: 'Dr. Elena Rostova',
          capacity: 250,
          attendeeCount: 184
        }
      ],
      meta: { total: 42, page: 1, limit: 10 }
    }, null, 2),
    errorCodes: [
      { code: 400, reason: 'Invalid query parameter or date range filter' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/events',
    roleRequired: 'Organizer / Admin',
    summary: 'Create and publish a new campus event',
    description: 'RBAC enforced. Validates start/end timestamps, venue booking conflicts, capacity limit, and inserts new record into database.',
    requestBody: JSON.stringify({
      title: 'Robotics Autonomous Vehicle Showcase',
      description: 'Hands-on demonstration of student-built autonomous rovers.',
      category: 'Technology',
      venueName: 'Engineering Science Quad',
      venueRoom: 'Robotics Lab 102',
      venueAddress: '150 Innovation Way',
      date: '2026-11-28',
      startTime: '14:00',
      endTime: '17:00',
      speakerHost: 'Autonomous Systems Club',
      capacity: 80,
      bannerUrl: 'https://images.university.edu/banners/robotics.jpg'
    }, null, 2),
    statusSuccess: 201,
    responseSuccess: JSON.stringify({
      message: 'Event created and published successfully',
      event: { id: 'evt_new_77', title: 'Robotics Autonomous Vehicle Showcase' }
    }, null, 2),
    errorCodes: [
      { code: 401, reason: 'Unauthorized: Authentication required' },
      { code: 403, reason: 'Forbidden: Insufficient privileges (Organizer or Admin role required)' },
      { code: 409, reason: 'Venue schedule conflict for specified room and timeframe' }
    ]
  },
  {
    method: 'PUT',
    path: '/api/v1/events/:id',
    roleRequired: 'Organizer (Owner) / Admin',
    summary: 'Update existing event parameters',
    description: 'Updates event attributes. Capacity cannot be reduced below current confirmed attendeeCount.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({ message: 'Event updated successfully' }, null, 2),
    errorCodes: [
      { code: 403, reason: 'User is not the event creator and lacks Admin privileges' },
      { code: 404, reason: 'Event ID does not exist' }
    ]
  },
  {
    method: 'DELETE',
    path: '/api/v1/events/:id',
    roleRequired: 'Organizer (Owner) / Admin',
    summary: 'Delete or cancel an event',
    description: 'Cascades cancellation or soft-deletes the event, triggering cancellation notices to all confirmed RSVPs.',
    statusSuccess: 204,
    responseSuccess: 'No Content',
    errorCodes: [
      { code: 403, reason: 'Forbidden: Lacks ownership or admin privileges' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/events/:id/rsvp',
    roleRequired: 'Student / Organizer / Admin',
    summary: 'RSVP to an event',
    description: 'Checks capacity with atomic database transaction. If spots remain, reserves seat and increments attendeeCount; else places on waitlist.',
    statusSuccess: 201,
    responseSuccess: JSON.stringify({
      message: 'RSVP confirmed',
      rsvp: { id: 'rsvp_99', eventId: 'evt_001', status: 'confirmed' }
    }, null, 2),
    errorCodes: [
      { code: 401, reason: 'Must be logged in to RSVP' },
      { code: 409, reason: 'User has already RSVPd to this event' }
    ]
  },
  {
    method: 'DELETE',
    path: '/api/v1/events/:id/rsvp',
    roleRequired: 'Student / Organizer / Admin',
    summary: 'Cancel existing RSVP',
    description: 'Marks RSVP as cancelled, decrements attendeeCount, and automatically promotes the top student on the waitlist.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({ message: 'RSVP cancelled successfully' }, null, 2),
    errorCodes: [
      { code: 404, reason: 'No active RSVP record found for this user' }
    ]
  },
  {
    method: 'GET',
    path: '/api/v1/events/:id/attendees',
    roleRequired: 'Organizer / Admin',
    summary: 'Retrieve event attendee roster',
    description: 'Returns list of confirmed and waitlisted students with student IDs and contact info for check-in and attendance export.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({
      attendees: [
        { userId: 'usr_student_01', fullName: 'Jane Doe', email: 'jane.doe@university.edu', studentId: 'STU-984210', registeredAt: '2026-11-02T11:20:00Z' }
      ]
    }, null, 2),
    errorCodes: [
      { code: 403, reason: 'Forbidden: Attendee roster is restricted to event organizers and administrators' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/events/:id/updates',
    roleRequired: 'Organizer / Admin',
    summary: 'Publish broadcast update to attendees',
    description: 'Posts an announcement notice to the event page and enqueues email/SMS broadcast to all confirmed RSVPs.',
    requestBody: JSON.stringify({ message: 'Room change: Meeting moved to Hall B due to high attendance.' }, null, 2),
    statusSuccess: 201,
    responseSuccess: JSON.stringify({ message: 'Update broadcast successfully dispatched' }, null, 2),
    errorCodes: [
      { code: 403, reason: 'Forbidden: Organizer or Admin role required' }
    ]
  },
  {
    method: 'POST',
    path: '/api/v1/events/:id/bookmark',
    roleRequired: 'Student / Organizer / Admin',
    summary: 'Toggle event bookmark',
    description: 'Saves or removes an event from the student’s personal saved events list.',
    statusSuccess: 200,
    responseSuccess: JSON.stringify({ bookmarked: true }, null, 2),
    errorCodes: [
      { code: 401, reason: 'Authentication required' }
    ]
  }
];

export const SPRINT_TASKS: SprintTask[] = [
  // Phase 1: Environment & Auth Setup
  {
    id: 'T101',
    phaseId: 1,
    title: 'Project Scaffolding & Containerized Environment',
    description: 'Configure TypeScript, Node.js/Express, Vite/React, Tailwind CSS, Docker Compose for local PostgreSQL and Redis instances.',
    deliverable: 'Reproducible local dev environment with healthcheck scripts and .env.example configuration.',
    dod: '`docker compose up` starts PostgreSQL, Redis, and dev server with 0 errors.',
    completed: true,
    role: 'DevOps'
  },
  {
    id: 'T102',
    phaseId: 1,
    title: 'Password Hashing & User Registration Endpoint',
    description: 'Implement `/api/v1/auth/register` with Argon2id password hashing, input sanitization (Zod/Joi), and uniqueness validation.',
    deliverable: 'Secure registration controller and unit test suite verifying hash strength and duplicate email rejection.',
    dod: 'Passes automated tests verifying salt uniqueness and rejection of malformed or weak passwords.',
    completed: true,
    role: 'Backend'
  },
  {
    id: 'T103',
    phaseId: 1,
    title: 'JWT Authentication & Refresh Token Rotation',
    description: 'Implement `/api/v1/auth/login` and `/api/v1/auth/refresh` using short-lived access JWTs (15 min) and HTTP-only SameSite=Strict refresh cookies (7 days).',
    deliverable: 'Auth middleware, Redis token blacklist, and refresh rotation handler.',
    dod: 'Refresh rotation detects replay attacks and revokes the entire token family upon token reuse.',
    completed: true,
    role: 'Security'
  },
  {
    id: 'T104',
    phaseId: 1,
    title: 'Frontend Auth Context & Secure Route Guards',
    description: 'Create React AuthContext, Axios/Fetch interceptor for automatic token refresh on 401 responses, and `<ProtectedRoute>` component.',
    deliverable: 'Client-side state management handling login, signup, session restoration, and logout.',
    dod: 'Navigating to protected URL redirects unauthenticated visitors to login and preserves target redirect query.',
    completed: true,
    role: 'Frontend'
  },

  // Phase 2: Database & Backend Core Logic
  {
    id: 'T201',
    phaseId: 2,
    title: 'Database Migrations & Relational Schema Execution',
    description: 'Write DDL migration scripts for `users`, `roles`, `user_roles`, `events`, `event_rsvps`, `event_bookmarks`, and `event_updates`.',
    deliverable: 'Versioned database migration files with foreign keys, ON DELETE CASCADE/RESTRICT constraints, and indices.',
    dod: 'Migration runs forward and rollback cleanly on empty and seeded PostgreSQL databases.',
    completed: true,
    role: 'Backend'
  },
  {
    id: 'T202',
    phaseId: 2,
    title: 'Event Query Engine with Multi-Attribute Filtering',
    description: 'Implement `/api/v1/events` endpoint with SQL query builder supporting pagination, date ranges, category tags, venue names, and ILIKE search.',
    deliverable: 'Optimized event discovery repository using indexes on start_time and category.',
    dod: 'Query benchmarks under 25ms for 50,000 indexed events across compound filters.',
    completed: true,
    role: 'Backend'
  },
  {
    id: 'T203',
    phaseId: 2,
    title: 'Concurrency-Safe RSVP Transaction Handler',
    description: 'Implement RSVP reservation with `SELECT ... FOR UPDATE` or atomic decrement to prevent overbooking when capacity reaches limit.',
    deliverable: 'Transaction-safe RSVP controller managing confirmed status vs waitlist overflow.',
    dod: 'Simultaneous siege test with 50 concurrent requests for 5 remaining spots results in exactly 5 confirmations and 45 waitlists.',
    completed: true,
    role: 'Backend'
  },
  {
    id: 'T204',
    phaseId: 2,
    title: 'Campus Resource Directory Query Endpoint',
    description: 'Implement `/api/v1/resources` endpoint returning categorized student services (academic, counseling, transit, makerspace).',
    deliverable: 'Resource service with Redis caching (1-hour TTL) for high-read low-write performance.',
    dod: 'Resource endpoint returns cached payload with 304 Not Modified support.',
    completed: true,
    role: 'Backend'
  },

  // Phase 3: Frontend UI Components & Event Views
  {
    id: 'T301',
    phaseId: 3,
    title: 'Responsive Design System & Top Bar Navigation',
    description: 'Build modern 3-zone header, responsive mobile drawer, accessible dark/light themes, and university brand styling.',
    deliverable: 'Layout framework meeting WCAG AA contrast criteria and Zero-Pill metadata guidelines.',
    dod: 'Zero broken links; keyboard navigation fully functional with visible focus rings.',
    completed: true,
    role: 'Frontend'
  },
  {
    id: 'T302',
    phaseId: 3,
    title: 'Event Discovery Grid, Agenda Calendar & Filter Strip',
    description: 'Develop multi-view event explorer: visual cards with explicit Venue, Date, Time, Speaker, and Capacity indicators + Calendar view.',
    deliverable: 'Event list, grid cards, and filter controls (search input, category tabs, venue selector).',
    dod: 'Instant client-side filter response with empty state and loading skeletons.',
    completed: true,
    role: 'Frontend'
  },
  {
    id: 'T303',
    phaseId: 3,
    title: 'Event Detail Modal & RSVP / Bookmark Interaction',
    description: 'Build comprehensive event modal showing full description, host bio, venue map details, spots left progress bar, and 1-click RSVP.',
    deliverable: 'Interactive event detail dialog with optimistic UI updates for RSVP and bookmark toggles.',
    dod: 'RSVP button reflects user status immediately with animated feedback and cancel option.',
    completed: true,
    role: 'Frontend'
  },
  {
    id: 'T304',
    phaseId: 3,
    title: 'Campus Resource Directory Cards & Contact Hub',
    description: 'Render interactive resource directory with emergency contact buttons, hours of operation, and location badges.',
    deliverable: 'Filterable campus services page with direct email/phone click-to-contact hooks.',
    dod: 'Cards clearly display operational hours and map location pins.',
    completed: true,
    role: 'Frontend'
  },

  // Phase 4: Role-Based Authorization & Protected Actions
  {
    id: 'T401',
    phaseId: 4,
    title: 'RBAC Authorization Middleware & Permission Matrix',
    description: 'Implement backend `requireRole(\'organizer\', \'admin\')` middleware decoding JWT claims and inspecting user permissions.',
    deliverable: 'Centralized RBAC middleware with comprehensive error reporting (401 vs 403).',
    dod: 'Direct API requests with student token to POST /api/v1/events strictly return 403 Forbidden.',
    completed: true,
    role: 'Security'
  },
  {
    id: 'T402',
    phaseId: 4,
    title: 'Organizer Event Creation & Management Studio',
    description: 'Develop rich modal form for Organizers to create, edit, and delete events with date pickers, venue room dropdowns, and capacity guards.',
    deliverable: 'Validated event creation form with image preview, character counters, and live preview.',
    dod: 'Non-organizer users have zero visibility or access to the creation triggers.',
    completed: true,
    role: 'Frontend'
  },
  {
    id: 'T403',
    phaseId: 4,
    title: 'Attendee Roster Management & Broadcast Updates',
    description: 'Provide Organizers with attendee management drawer to inspect registered student IDs, download CSV roster, and post broadcast notices.',
    deliverable: 'Attendee table with search and announcement broadcaster modal.',
    dod: 'Organizer can export attendance CSV and published announcements appear instantly on event page.',
    completed: true,
    role: 'Frontend'
  },
  {
    id: 'T404',
    phaseId: 4,
    title: 'Student Profile & My Campus Hub Dashboard',
    description: 'Build student account management view displaying registered RSVPs, bookmarked events, and editable student ID / department info.',
    deliverable: 'Personal student hub with tabbed view of active bookings and calendar export.',
    dod: 'Student can cancel an RSVP directly from their personal dashboard.',
    completed: true,
    role: 'Frontend'
  },

  // Phase 5: Testing & Deployment
  {
    id: 'T501',
    phaseId: 5,
    title: 'End-to-End Testing (Playwright / Cypress)',
    description: 'Author automated E2E tests simulating: Guest registration -> Login -> Event filtering -> RSVP confirmation -> Organizer attendee review.',
    deliverable: 'Automated test suite covering core user journeys and edge cases.',
    dod: '100% test pass rate in CI pipeline before deployment staging.',
    completed: true,
    role: 'DevOps'
  },
  {
    id: 'T502',
    phaseId: 5,
    title: 'Security Hardening & Penetration Testing Audit',
    description: 'Audit CORS policies, CSP headers, rate-limiting (express-rate-limit), SQL injection guards (parameterized queries), and XSS sanitation.',
    deliverable: 'Security audit report with OWASP Top 10 checklist verification.',
    dod: 'Zero high or medium vulnerability findings; security headers (Helmet) active.',
    completed: true,
    role: 'Security'
  },
  {
    id: 'T503',
    phaseId: 5,
    title: 'CI/CD Pipeline & Cloud Run Production Deployment',
    description: 'Set up GitHub Actions workflow for automated linting, container builds, zero-downtime database migration rollout, and Cloud Run deploy.',
    deliverable: 'Continuous deployment pipeline with automated rollback on healthcheck failure.',
    dod: 'Production URL serves traffic with HTTPS and sub-200ms TTFB.',
    completed: true,
    role: 'DevOps'
  }
];
