/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile, CampusEvent, EventRSVP, EventBookmark } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_RESOURCES, 
  INITIAL_RSVPS, 
  INITIAL_BOOKMARKS 
} from './data/mockData';
import { FULL_SPEC_MARKDOWN } from './utils/specContent';
import { Navbar } from './components/Navbar';
import { LiveHubDemo } from './components/LiveHubDemo';
import { ProcessFlowVisualizer } from './components/ProcessFlowVisualizer';
import { ErdStudio } from './components/ErdStudio';
import { ApiExplorer } from './components/ApiExplorer';
import { SprintTracker } from './components/SprintTracker';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'live' | 'spec' | 'erd' | 'api' | 'sprint'>('live');

  // Role simulation & authentication state
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]);

  // Data states
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [resources] = useState(INITIAL_RESOURCES);
  const [rsvps, setRsvps] = useState<EventRSVP[]>(INITIAL_RSVPS);
  const [bookmarks, setBookmarks] = useState<EventBookmark[]>(INITIAL_BOOKMARKS);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle role simulation quick-switch
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'guest') {
      setCurrentUser(null);
    } else if (newRole === 'student') {
      setCurrentUser(INITIAL_USERS[0]); // Jane Doe
    } else if (newRole === 'organizer_admin') {
      setCurrentUser(INITIAL_USERS[1]); // Dr. Aris Thorne
    }
  };

  // Auth actions
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
  };

  // Event actions
  const handleAddEvent = (newEvent: CampusEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setRsvps(prev => prev.filter(r => r.eventId !== eventId));
    setBookmarks(prev => prev.filter(b => b.eventId !== eventId));
  };

  const handleToggleRSVP = (eventId: string) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }

    const existingRsvp = rsvps.find(r => r.eventId === eventId && r.userId === currentUser.id && r.status === 'confirmed');

    if (existingRsvp) {
      // Cancel RSVP
      setRsvps(prev => prev.filter(r => !(r.eventId === eventId && r.userId === currentUser.id)));
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendeeCount: Math.max(0, e.attendeeCount - 1) } : e));
    } else {
      // Add confirmed RSVP
      const newRsvp: EventRSVP = {
        id: `rsvp_${Date.now()}`,
        eventId,
        userId: currentUser.id,
        userName: currentUser.fullName,
        userEmail: currentUser.email,
        studentId: currentUser.studentId,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      };
      setRsvps(prev => [...prev, newRsvp]);
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendeeCount: e.attendeeCount + 1 } : e));
    }
  };

  const handleToggleBookmark = (eventId: string) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }

    const existingBm = bookmarks.find(b => b.eventId === eventId && b.userId === currentUser.id);

    if (existingBm) {
      setBookmarks(prev => prev.filter(b => !(b.eventId === eventId && b.userId === currentUser.id)));
    } else {
      const newBm: EventBookmark = {
        id: `bm_${Date.now()}`,
        eventId,
        userId: currentUser.id,
        bookmarkedAt: new Date().toISOString()
      };
      setBookmarks(prev => [...prev, newBm]);
    }
  };

  const handleAddEventUpdate = (eventId: string, message: string) => {
    const newUpdate = {
      id: `upd_${Date.now()}`,
      timestamp: new Date().toISOString(),
      authorName: currentUser ? currentUser.fullName : 'Event Organizer',
      message
    };
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, updates: [newUpdate, ...e.updates] } : e));
  };

  // Export Markdown Tech Spec
  const handleExportSpec = () => {
    const blob = new Blob([FULL_SPEC_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Student-Resource-Hub-Technical-Specification.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Navbar & Role Simulator */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setIsProfileOpen(true)}
        onExportSpec={handleExportSpec}
      />

      {/* Main Content Viewport (1440px max width baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'live' && (
          <LiveHubDemo
            currentRole={currentRole}
            currentUser={currentUser}
            events={events}
            resources={resources}
            rsvps={rsvps}
            bookmarks={bookmarks}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleRSVP={handleToggleRSVP}
            onToggleBookmark={handleToggleBookmark}
            onAddEventUpdate={handleAddEventUpdate}
            onOpenAuth={handleOpenAuth}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {activeTab === 'spec' && <ProcessFlowVisualizer />}

        {activeTab === 'erd' && <ErdStudio />}

        {activeTab === 'api' && <ApiExplorer currentRole={currentRole} />}

        {activeTab === 'sprint' && <SprintTracker />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">Student Resource Hub — Architecture Blueprint & Interactive Sandbox</p>
            <p className="mt-0.5">Designed with PostgreSQL 16, Redis 7, React 19, and RBAC security specifications.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('spec')}
              className="hover:text-blue-600 transition-colors"
            >
              Process Flows
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('erd')}
              className="hover:text-blue-600 transition-colors"
            >
              Database ERD
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('api')}
              className="hover:text-blue-600 transition-colors"
            >
              REST APIs
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleExportSpec}
              className="hover:text-blue-600 font-semibold transition-colors"
            >
              Download Full Spec (.md)
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />
    </div>
  );
}
