import React, { useState } from 'react';
import { SCHEMA_TABLES } from '../data/mockData';
import { Database, Key, Link2, Copy, Check, Table2, Layers, ShieldCheck } from 'lucide-react';

export const ErdStudio: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>(SCHEMA_TABLES[0].name);
  const [copiedDdl, setCopiedDdl] = useState(false);
  const [schemaFormat, setSchemaFormat] = useState<'sql' | 'mongodb'>('sql');

  const activeTable = SCHEMA_TABLES.find(t => t.name === selectedTable) || SCHEMA_TABLES[0];

  const fullSqlDdl = `-- ============================================================================
-- STUDENT RESOURCE HUB: PRODUCTION POSTGRESQL SCHEMA (DDL)
-- Includes UUID generation, composite constraints, cascade rules & indices
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. USERS TABLE
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

-- 2. ROLES TABLE
CREATE TABLE roles (
    id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(32) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

INSERT INTO roles (name, description) VALUES
('guest', 'Unauthenticated visitor with read-only access to public directory'),
('student', 'Authenticated student with profile, RSVP, and bookmark privileges'),
('organizer', 'Elevated university organizer authorized to create and manage events'),
('admin', 'Super administrator with full system, event, and RBAC governance');

-- 3. USER_ROLES JUNCTION TABLE
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id SMALLINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    granted_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    granted_by UUID REFERENCES users(id),
    CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- 4. EVENTS TABLE
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
CREATE INDEX idx_events_organizer_id ON events(organizer_id);

-- 5. EVENT RSVPs TABLE
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed' NOT NULL, -- confirmed, waitlist, cancelled
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE UNIQUE INDEX idx_unique_event_user_rsvp ON event_rsvps(event_id, user_id) 
WHERE status != 'cancelled';
CREATE INDEX idx_rsvps_user_id ON event_rsvps(user_id);
CREATE INDEX idx_rsvps_event_id ON event_rsvps(event_id);

-- 6. EVENT BOOKMARKS TABLE
CREATE TABLE event_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE UNIQUE INDEX idx_unique_event_user_bookmark ON event_bookmarks(event_id, user_id);
CREATE INDEX idx_bookmarks_user_id ON event_bookmarks(user_id);

-- 7. EVENT ANNOUNCEMENTS & UPDATES
CREATE TABLE event_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT clock_timestamp() NOT NULL
);

CREATE INDEX idx_event_updates_event_id ON event_updates(event_id);`;

  const mongoDbSchema = `// ============================================================================
// STUDENT RESOURCE HUB: MONGODB / MONGOOSE SCHEMAS
// ============================================================================

import mongoose, { Schema } from 'mongoose';

// 1. User Schema
export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true, trim: true },
  studentId: { type: String, sparse: true, unique: true },
  department: { type: String },
  phone: { type: String },
  roles: [{ type: String, enum: ['guest', 'student', 'organizer', 'admin'], default: ['student'] }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// 2. Event Schema
export const EventSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Social', 'Sports', 'Career', 'Arts', 'Technology'], required: true, index: true },
  venue: {
    name: { type: String, required: true, index: true },
    room: { type: String, required: true },
    address: { type: String, required: true }
  },
  schedule: {
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true }
  },
  speakerHost: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
  attendeeCount: { type: Number, default: 0, min: 0 },
  bannerUrl: { type: String },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'published' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// 3. RSVP Schema (Compound Index for Single Active RSVP)
export const RsvpSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['confirmed', 'waitlist', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

RsvpSchema.index({ event: 1, user: 1 }, { unique: true, partialFilterExpression: { status: { $ne: 'cancelled' } } });

// 4. Bookmark Schema
export const BookmarkSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

BookmarkSchema.index({ event: 1, user: 1 }, { unique: true });`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Database Schema & ERD Specification</h2>
          <p className="text-sm text-slate-600 mt-1">
            Production relational PostgreSQL schema with referential integrity constraints, composite indices, and MongoDB alternative.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSchemaFormat('sql')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                schemaFormat === 'sql'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PostgreSQL (DDL)
            </button>
            <button
              onClick={() => setSchemaFormat('mongodb')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                schemaFormat === 'mongodb'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              MongoDB (Mongoose)
            </button>
          </div>

          <button
            onClick={() => copyToClipboard(schemaFormat === 'sql' ? fullSqlDdl : mongoDbSchema)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {copiedDdl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDdl ? 'Copied' : 'Copy Full Schema'}</span>
          </button>
        </div>
      </div>

      {/* Relational Entity Relationships Diagram (Visual Architecture) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Entity Relationship Overview (ERD Visual Model)</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Strict Foreign Key Enforcement (ON DELETE CASCADE / RESTRICT)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between font-mono text-xs text-blue-400 mb-2">
              <span className="font-bold">users</span>
              <span>1</span>
            </div>
            <p className="text-xs text-slate-300">Identity, credentials, student_id, department, contact info.</p>
            <div className="mt-3 pt-2 border-t border-slate-700 text-[11px] font-mono text-slate-400 space-y-1">
              <div>→ 1:N with user_roles</div>
              <div>→ 1:N with events (as organizer)</div>
              <div>→ 1:N with event_rsvps</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between font-mono text-xs text-purple-400 mb-2">
              <span className="font-bold">events</span>
              <span>1</span>
            </div>
            <p className="text-xs text-slate-300">Title, venue, timestamps, category, capacity, attendee_count.</p>
            <div className="mt-3 pt-2 border-t border-slate-700 text-[11px] font-mono text-slate-400 space-y-1">
              <div>← FK to users(id)</div>
              <div>→ 1:N with event_rsvps</div>
              <div>→ 1:N with event_updates</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between font-mono text-xs text-emerald-400 mb-2">
              <span className="font-bold">event_rsvps</span>
              <span>N</span>
            </div>
            <p className="text-xs text-slate-300">Tickets, confirmed/waitlist, registration timestamp.</p>
            <div className="mt-3 pt-2 border-t border-slate-700 text-[11px] font-mono text-slate-400 space-y-1">
              <div>← FK to events(id)</div>
              <div>← FK to users(id)</div>
              <div>Unique constraint on (event, user)</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between font-mono text-xs text-amber-400 mb-2">
              <span className="font-bold">event_bookmarks</span>
              <span>N</span>
            </div>
            <p className="text-xs text-slate-300">Saved events for student calendar synchronization.</p>
            <div className="mt-3 pt-2 border-t border-slate-700 text-[11px] font-mono text-slate-400 space-y-1">
              <div>← FK to events(id)</div>
              <div>← FK to users(id)</div>
              <div>Instant removal upon event delete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Table Explorer & DDL Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Selector */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Table2 className="w-4 h-4 text-blue-600" />
            <span>Select Table to Inspect</span>
          </div>

          <div className="space-y-1.5">
            {SCHEMA_TABLES.map((table) => {
              const isSelected = selectedTable === table.name;
              return (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{table.name}</span>
                    <span className="text-[11px] font-mono text-slate-400">{table.columns.length} cols</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{table.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Table Columns & Constraints */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-slate-900">{activeTable.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">
                  PostgreSQL Table
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{activeTable.description}</p>
            </div>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3">Column Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Key / Constraints</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                      {col.isPrimary && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      {col.isForeign && <Link2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-purple-700 font-medium">
                      {col.type}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {col.constraints}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {col.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indices */}
          {activeTable.indices && activeTable.indices.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Indices & Performance Optimizations
              </h4>
              <div className="space-y-1.5">
                {activeTable.indices.map((idx, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-800">
                    <code>{idx}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
