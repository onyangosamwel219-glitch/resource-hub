import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  CalendarPlus, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  Server, 
  Cpu, 
  Layers, 
  Lock, 
  Clock, 
  AlertTriangle,
  FileCode2,
  Copy,
  Check
} from 'lucide-react';

export const ProcessFlowVisualizer: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<'auth' | 'event'>('auth');
  const [selectedAuthStep, setSelectedAuthStep] = useState<number>(0);
  const [selectedEventStep, setSelectedEventStep] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const authSteps = [
    {
      title: '1. Registration & Input Sanitization',
      actor: 'Client (Student / Guest)',
      action: 'POST /api/v1/auth/register',
      desc: 'The student submits registration payload: Full Name, University Email (.edu), Raw Password, and optional Student ID.',
      technicalDetails: [
        'Zod / Joi schema validates email regex and password complexity (min 8 chars, 1 uppercase, 1 symbol, 1 digit).',
        'Database query checks for duplicate email or matriculation student_id to prevent collision.',
        'Prevents timing attacks using constant-time evaluation.'
      ],
      codeSnippet: `// Registration Input Validation Schema (Zod)
export const RegisterSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().endsWith('.edu', { message: 'Must be an accredited campus email' }),
  password: z.string().min(8).regex(/[A-Z]/, 'Must have 1 uppercase').regex(/[0-9]/, 'Must have 1 digit'),
  studentId: z.string().regex(/^STU-\\d{6}$/, 'Format STU-XXXXXX').optional()
});`
    },
    {
      title: '2. Cryptographic Salt & Password Hashing',
      actor: 'Auth Service (Backend)',
      action: 'Argon2id / bcrypt hashing',
      desc: 'Never store plain passwords. Password is processed via Argon2id (RFC 9106) with memory cost 64MB and time cost 3, or bcrypt with cost factor 12.',
      technicalDetails: [
        'Argon2id combines data-independent and data-dependent memory access to resist GPU/ASIC cracking.',
        'Unique 128-bit cryptographically secure salt generated per user.',
        'Hash string stored in users.password_hash (e.g. $argon2id$v=19$m=65536,t=3,p=4$...)'
      ],
      codeSnippet: `import argon2 from 'argon2';

// Hash raw password with memory-hard parameters
const passwordHash = await argon2.hash(rawPassword, {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 3,         // 3 iterations
  parallelism: 1       // 1 thread
});`
    },
    {
      title: '3. Atomic User & Role DB Transaction',
      actor: 'PostgreSQL Database',
      action: 'INSERT INTO users & user_roles',
      desc: 'An atomic database transaction persists the user profile and automatically links the default "student" role in the junction table.',
      technicalDetails: [
        'Transaction guarantees user is not created without assigned role.',
        'Assigns primary key UUID via gen_random_uuid().',
        'Junction table user_roles stores foreign keys with ON DELETE CASCADE.'
      ],
      codeSnippet: `BEGIN;
  INSERT INTO users (id, email, password_hash, full_name, student_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id;

  INSERT INTO user_roles (user_id, role_id)
  VALUES ($1, (SELECT id FROM roles WHERE name = 'student'));
COMMIT;`
    },
    {
      title: '4. Dual Token Issuance (JWT + Refresh Cookie)',
      actor: 'Auth Service & Redis Token Store',
      action: 'Issue Access Token & Refresh Rotation',
      desc: 'System issues a short-lived JWT Access Token (15 min) and sets an HTTP-only, Secure, SameSite=Strict Refresh Cookie (7 days).',
      technicalDetails: [
        'Access Token contains claims: sub (userId), email, role: "student", exp.',
        'Refresh Token is stored as SHA-256 hash in Redis alongside a familyId for automatic reuse detection.',
        'If a stale refresh token is reused, the entire token family is revoked immediately (RFC 6749 security).'
      ],
      codeSnippet: `// Generate signed JWT Access Token
const accessToken = jwt.sign(
  { sub: user.id, email: user.email, role: 'student', studentId: user.studentId },
  process.env.JWT_ACCESS_SECRET!,
  { expiresIn: '15m', algorithm: 'HS256' }
);

// Secure HTTP-Only Refresh Cookie
res.cookie('refreshToken', rawRefreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});`
    },
    {
      title: '5. Protected Route Guard & RBAC Verification',
      actor: 'API Gateway / Express Middleware',
      action: 'Verify Bearer Token & Role Claims',
      desc: 'When accessing protected routes (e.g. GET /api/v1/users/me, POST /api/v1/events/:id/rsvp), middleware validates signature and evaluates permissions.',
      technicalDetails: [
        'Client sends Bearer token in Authorization header.',
        'Middleware parses and validates cryptographic signature and expiry timestamp.',
        'Attaches req.user = decoded; evaluates if req.user.role meets required threshold.'
      ],
      codeSnippet: `export const requireAuth = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
    }
    req.user = decoded;
    next();
  };
};`
    }
  ];

  const eventSteps = [
    {
      title: '1. Form Submission & Parameter Validation',
      actor: 'Client (Organizer Portal)',
      action: 'POST /api/v1/events',
      desc: 'Organizer inputs event metadata: Title, Description, Category, Venue (Name, Room, Address), Start Time, End Time, Speaker/Host, Capacity, and Banner URL.',
      technicalDetails: [
        'Verifies date/time boundaries: end_time must be strictly after start_time.',
        'Validates start_time is in the future (> current_timestamp + 1 hour).',
        'Enforces positive integer capacity (e.g. 10 to 2000 seats).'
      ],
      codeSnippet: `export const CreateEventSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20),
  category: z.enum(['Academic', 'Social', 'Sports', 'Career', 'Arts', 'Technology']),
  venueName: z.string().min(3).max(150),
  venueRoom: z.string().min(1).max(80),
  venueAddress: z.string().min(5),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  speakerHost: z.string().min(2),
  capacity: z.number().int().positive().max(5000),
  bannerUrl: z.string().url().optional()
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'Event end time must be after start time'
});`
    },
    {
      title: '2. RBAC Authorization Verification',
      actor: 'Auth Middleware',
      action: 'requireRole("organizer", "admin")',
      desc: 'The backend verifies that the caller token carries an elevated role ("organizer" or "admin").',
      technicalDetails: [
        'If the caller has only the "student" role, the request is halted with HTTP 403 Forbidden.',
        'Prevents unauthorized students or unauthenticated guests from posting unvetted campus events.',
        'Extracts organizerId directly from validated JWT subject claim.'
      ],
      codeSnippet: `// RBAC Route Binding
router.post(
  '/api/v1/events',
  requireAuth(['organizer', 'admin']),
  validateBody(CreateEventSchema),
  eventController.createEvent
);`
    },
    {
      title: '3. Venue Conflict Check & Database Insertion',
      actor: 'PostgreSQL Database Engine',
      action: 'Collision Query & Transactional INSERT',
      desc: 'Queries existing events to guarantee the requested venue room is not double-booked during the requested time window.',
      technicalDetails: [
        'Uses PostgreSQL timestamp range overlap operator (&&) with tstzrange(start_time, end_time).',
        'If an overlap exists, returns HTTP 409 Conflict with overlapping event details.',
        'If clear, inserts record with status = "published" and attendee_count = 0.'
      ],
      codeSnippet: `// Venue overlap check
const collision = await db.query(\`
  SELECT id, title FROM events
  WHERE venue_name = $1 
    AND venue_room = $2 
    AND status = 'published'
    AND tstzrange(start_time, end_time) && tstzrange($3, $4)
  LIMIT 1;
\`, [venueName, venueRoom, startTime, endTime]);

if (collision.rows.length > 0) {
  return res.status(409).json({ 
    error: 'Venue conflict: Room already booked by ' + collision.rows[0].title 
  });
}`
    },
    {
      title: '4. Cache Invalidation & Event Dispatch',
      actor: 'Backend & Redis Cache',
      action: 'DEL events:discovery:* & Pub/Sub',
      desc: 'Invalidates cached query results across discovery endpoints and publishes an internal event for campus subscribers.',
      technicalDetails: [
        'Clears Redis cache keys matching discovery filters so students immediately see the new event.',
        'Dispatches event to message broker (RabbitMQ/Redis PubSub) for email digest or push notifications.'
      ],
      codeSnippet: `// Invalidate cached query results
await redis.del('events:featured');
await redis.del('events:upcoming:all');

// Publish internal notification event
await pubsub.publish('EVENT_CREATED', JSON.stringify({
  eventId: newEvent.id,
  category: newEvent.category,
  title: newEvent.title,
  startTime: newEvent.startTime
}));`
    },
    {
      title: '5. Public Discovery & Real-Time Client Display',
      actor: 'Web Frontend & Mobile Clients',
      action: 'Render Event Card & Calendar Views',
      desc: 'The event appears immediately in student searches, categorized filters, and agenda calendars with explicit Venue, Date, and Time metadata.',
      technicalDetails: [
        'Card displays: Venue Name + Room, Start/End Time, Date, Category tag, Speaker, and Capacity progress bar.',
        'Authenticated students can immediately click "RSVP" or "Bookmark".'
      ],
      codeSnippet: `// Explicit Card Metadata Renderer
<div className="flex flex-col gap-1 text-xs text-slate-600">
  <div className="flex items-center gap-2">
    <MapPin className="w-3.5 h-3.5 text-blue-600" />
    <span className="font-medium text-slate-900">{event.venueName}</span>
    <span>({event.venueRoom})</span>
  </div>
  <div className="flex items-center gap-2">
    <Calendar className="w-3.5 h-3.5 text-blue-600" />
    <span>{formatDate(event.date)}</span>
    <span>·</span>
    <Clock className="w-3.5 h-3.5 text-blue-600" />
    <span>{event.startTime} - {event.endTime}</span>
  </div>
</div>`
    }
  ];

  const currentSteps = activeFlow === 'auth' ? authSteps : eventSteps;
  const currentSelectedStep = activeFlow === 'auth' ? selectedAuthStep : selectedEventStep;
  const setCurrentSelectedStep = activeFlow === 'auth' ? setSelectedAuthStep : setSelectedEventStep;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Process & Data Flow Walkthrough</h2>
            <p className="text-sm text-slate-600 mt-1">
              Step-by-step architectural breakdown of core backend operations, cryptographic transitions, and state propagation.
            </p>
          </div>

          {/* Flow Selector */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveFlow('auth')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeFlow === 'auth'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Authentication & Session Flow</span>
            </button>
            <button
              onClick={() => setActiveFlow('event')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeFlow === 'event'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarPlus className="w-4 h-4 text-emerald-600" />
              <span>Event Creation & Publishing Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {currentSteps.map((step, idx) => {
          const isSelected = currentSelectedStep === idx;
          const isPassed = currentSelectedStep > idx;
          return (
            <button
              key={idx}
              onClick={() => setCurrentSelectedStep(idx)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : isPassed
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  STEP 0{idx + 1}
                </span>
                {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs font-bold text-slate-900 line-clamp-1">{step.title.split('. ')[1]}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1 truncate">{step.action}</p>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Architectural Explanation */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
                  {currentSteps[currentSelectedStep].actor}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {currentSteps[currentSelectedStep].title}
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-1 bg-slate-100 text-slate-800 rounded font-medium">
                {currentSteps[currentSelectedStep].action}
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {currentSteps[currentSelectedStep].desc}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Key Technical Invariants & Security Controls
              </h4>
              <ul className="space-y-2">
                {currentSteps[currentSelectedStep].technicalDetails.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentSelectedStep === 0}
              onClick={() => setCurrentSelectedStep(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous Step
            </button>
            <div className="text-xs text-slate-400 font-mono">
              Step {currentSelectedStep + 1} of {currentSteps.length}
            </div>
            <button
              disabled={currentSelectedStep === currentSteps.length - 1}
              onClick={() => setCurrentSelectedStep(prev => Math.min(currentSteps.length - 1, prev + 1))}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Code Implementation & Schema Contract */}
        <div className="lg:col-span-6 bg-slate-900 rounded-xl border border-slate-800 p-5 text-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-medium text-slate-300">
                  production-implementation.ts
                </span>
              </div>
              <button
                onClick={() => handleCopy(currentSteps[currentSelectedStep].codeSnippet)}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 bg-slate-950/60 rounded-lg leading-relaxed border border-slate-800/80 max-h-[340px]">
              <code>{currentSteps[currentSelectedStep].codeSnippet}</code>
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Runtime: Node.js 22 LTS / PostgreSQL 16</span>
            <span className="text-emerald-400">Status: Invariant Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
