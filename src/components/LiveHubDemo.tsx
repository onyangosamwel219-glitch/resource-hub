import React, { useState, useMemo } from 'react';
import { 
  CampusEvent, 
  CampusResource, 
  EventRSVP, 
  EventBookmark, 
  UserProfile, 
  UserRole,
  EventCategory
} from '../types';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  Check, 
  X, 
  ExternalLink, 
  Phone, 
  Mail, 
  Info, 
  AlertCircle,
  Megaphone,
  Download,
  Filter,
  Grid,
  List,
  CalendarDays,
  Sparkles,
  Building,
  GraduationCap,
  ShieldCheck,
  Trash2
} from 'lucide-react';

interface LiveHubDemoProps {
  currentRole: UserRole;
  currentUser: UserProfile | null;
  events: CampusEvent[];
  resources: CampusResource[];
  rsvps: EventRSVP[];
  bookmarks: EventBookmark[];
  onAddEvent: (event: CampusEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleRSVP: (eventId: string) => void;
  onToggleBookmark: (eventId: string) => void;
  onAddEventUpdate: (eventId: string, message: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenProfile: () => void;
}

export const LiveHubDemo: React.FC<LiveHubDemoProps> = ({
  currentRole,
  currentUser,
  events,
  resources,
  rsvps,
  bookmarks,
  onAddEvent,
  onDeleteEvent,
  onToggleRSVP,
  onToggleBookmark,
  onAddEventUpdate,
  onOpenAuth,
  onOpenProfile
}) => {
  // Navigation inside Hub
  const [hubSection, setHubSection] = useState<'events' | 'resources' | 'my_hub'>('events');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');

  // Modal states
  const [selectedEventForModal, setSelectedEventForModal] = useState<CampusEvent | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [eventForAttendees, setEventForAttendees] = useState<CampusEvent | null>(null);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Create Event Form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<EventCategory>('Academic');
  const [newEventVenueName, setNewEventVenueName] = useState('St. Mark University Library');
  const [newEventVenueRoom, setNewEventVenueRoom] = useState('Conference Room B');
  const [newEventVenueAddress, setNewEventVenueAddress] = useState('120 Campus Drive');
  const [newEventDate, setNewEventDate] = useState('2026-11-24');
  const [newEventStartTime, setNewEventStartTime] = useState('14:00');
  const [newEventEndTime, setNewEventEndTime] = useState('16:00');
  const [newEventSpeaker, setNewEventSpeaker] = useState('Dean of Academic Affairs');
  const [newEventCapacity, setNewEventCapacity] = useState('100');
  const [newEventBanner, setNewEventBanner] = useState('/src/assets/images/campus_quad_gathering_1794039953331.jpg');
  const [createFormError, setCreateFormError] = useState<string | null>(null);

  // Categories list
  const categories = ['All', 'Academic', 'Social', 'Sports', 'Career', 'Arts', 'Technology'];

  // Distinct Venues list
  const venues = useMemo(() => {
    const set = new Set(events.map(e => e.venueName));
    return ['All', ...Array.from(set)];
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.speakerHost.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
      const matchesVenue = selectedVenue === 'All' || e.venueName === selectedVenue;

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = e.date === '2026-11-07';
      } else if (dateFilter === 'week') {
        matchesDate = e.date >= '2026-11-07' && e.date <= '2026-11-15';
      }

      return matchesSearch && matchesCat && matchesVenue && matchesDate;
    });
  }, [events, searchQuery, selectedCategory, selectedVenue, dateFilter]);

  // Filtered Resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resources, searchQuery]);

  // My RSVP'd and Bookmarked Events
  const myRsvpdEvents = useMemo(() => {
    if (!currentUser) return [];
    const myRsvpIds = new Set(rsvps.filter(r => r.userId === currentUser.id && r.status === 'confirmed').map(r => r.eventId));
    return events.filter(e => myRsvpIds.has(e.id));
  }, [events, rsvps, currentUser]);

  const myBookmarkedEvents = useMemo(() => {
    if (!currentUser) return [];
    const myBmIds = new Set(bookmarks.filter(b => b.userId === currentUser.id).map(b => b.eventId));
    return events.filter(e => myBmIds.has(e.id));
  }, [events, bookmarks, currentUser]);

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFormError(null);

    if (!newEventTitle.trim()) {
      setCreateFormError('Please provide an event title.');
      return;
    }
    if (!newEventDesc.trim()) {
      setCreateFormError('Please provide a description.');
      return;
    }
    if (newEventEndTime <= newEventStartTime) {
      setCreateFormError('Event End Time must be strictly after Start Time.');
      return;
    }
    const cap = parseInt(newEventCapacity, 10);
    if (isNaN(cap) || cap <= 0) {
      setCreateFormError('Capacity must be a positive integer.');
      return;
    }

    const created: CampusEvent = {
      id: `evt_${Date.now()}`,
      title: newEventTitle.trim(),
      description: newEventDesc.trim(),
      category: newEventCategory,
      venueName: newEventVenueName.trim(),
      venueRoom: newEventVenueRoom.trim(),
      venueAddress: newEventVenueAddress.trim(),
      date: newEventDate,
      startTime: newEventStartTime,
      endTime: newEventEndTime,
      speakerHost: newEventSpeaker.trim() || 'Campus Faculty / Student Organization',
      capacity: cap,
      attendeeCount: 1, // Organizer automatically reserved
      bannerUrl: newEventBanner,
      organizerId: currentUser ? currentUser.id : 'usr_admin_01',
      organizerName: currentUser ? currentUser.fullName : 'Dr. Aris Thorne',
      updates: []
    };

    onAddEvent(created);
    setIsCreateEventOpen(false);
    // Reset form
    setNewEventTitle('');
    setNewEventDesc('');
  };

  const handlePostAnnouncement = (eventId: string) => {
    if (!newAnnouncementText.trim()) return;
    onAddEventUpdate(eventId, newAnnouncementText.trim());
    setNewAnnouncementText('');
  };

  const downloadRosterCsv = (event: CampusEvent) => {
    const eventAttendees = rsvps.filter(r => r.eventId === event.id);
    const headers = 'Attendee ID,Full Name,Email,Student ID,Registered At,Status\n';
    const rows = eventAttendees.map(a => 
      `"${a.id}","${a.userName}","${a.userEmail}","${a.studentId || 'N/A'}","${a.registeredAt}","${a.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roster-${event.title.replace(/\\s+/g, '-').toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Strip with Role Context */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              <span>University Campus Hub</span>
              <span>·</span>
              <span className="text-slate-500 font-mono">Current Identity: {currentUser ? currentUser.fullName : 'Guest'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Campus Happenings, Events & Key Resources
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Discover verified campus lectures, career fairs, sports tournaments, and student life resources with guaranteed capacity reservation.
            </p>
          </div>

          {/* Organizer / Admin Action Button */}
          {currentRole === 'organizer_admin' && (
            <button
              onClick={() => setIsCreateEventOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          )}

          {currentRole === 'student' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Student Account Active · 1-Click RSVP & Bookmarking Enabled</span>
            </div>
          )}

          {currentRole === 'guest' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Sign Up for RSVP Access
              </button>
            </div>
          )}
        </div>

        {/* Section Navigation Tabs: Events vs Resources vs My Hub */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHubSection('events')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                hubSection === 'events'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Campus Events ({events.length})
            </button>
            <button
              onClick={() => setHubSection('resources')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                hubSection === 'resources'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Student Resource Directory ({resources.length})
            </button>
            {currentUser && (
              <button
                onClick={() => setHubSection('my_hub')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  hubSection === 'my_hub'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                My Campus Hub ({myRsvpdEvents.length} RSVPs · {myBookmarkedEvents.length} Saved)
              </button>
            )}
          </div>

          {/* View Mode Switcher for Events */}
          {hubSection === 'events' && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                title="Agenda List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CAMPUS EVENTS VIEW                                              */}
      {/* ========================================================================= */}
      {hubSection === 'events' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Query */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search events by title, description, venue, or speaker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Venue Dropdown */}
              <div className="md:col-span-4">
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="All">All Campus Venues</option>
                  {venues.filter(v => v !== 'All').map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="md:col-span-3">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full py-2 px-3 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Upcoming Dates</option>
                  <option value="today">Happening Today (Nov 7)</option>
                  <option value="week">This Week (Nov 7 - 15)</option>
                </select>
              </div>
            </div>

            {/* Category Filter Buttons (Interactive Filter Controls per Zero-Pill Spec) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Category:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Discovery Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No events matched your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try clearing your search term, switching categories, or clearing date range constraints.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedVenue('All');
                  setDateFilter('all');
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => {
                const isRsvpd = currentUser && rsvps.some(r => r.eventId === event.id && r.userId === currentUser.id && r.status === 'confirmed');
                const isBookmarked = currentUser && bookmarks.some(b => b.eventId === event.id && b.userId === currentUser.id);
                const capacityPercentage = Math.round((event.attendeeCount / event.capacity) * 100);
                const spotsRemaining = Math.max(0, event.capacity - event.attendeeCount);

                return (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Banner Image with subtle contrast gradient */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img
                          src={event.bannerUrl}
                          alt={event.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        
                        {/* Category & Status Overlay (Zero-Pill clean text) */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow-md">
                          <span className="font-semibold">{event.category}</span>
                          {event.isFeatured && (
                            <span className="text-[11px] font-mono bg-blue-600/90 px-2 py-0.5 rounded backdrop-blur-xs font-bold">
                              FEATURED
                            </span>
                          )}
                        </div>

                        {/* Quick Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!currentUser) { onOpenAuth('login'); return; }
                            onToggleBookmark(event.id);
                          }}
                          className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white transition-colors"
                          title={isBookmarked ? 'Remove Bookmark' : 'Save Event'}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Card Content with Explicit Metadata (Venue, Date, Time) */}
                      <div className="p-5 space-y-3">
                        <h3 
                          onClick={() => setSelectedEventForModal(event)}
                          className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                        >
                          {event.title}
                        </h3>

                        {/* Explicit Venue, Date, Time Metadata (Section 3.B.2) */}
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">
                              <strong className="text-slate-800">{event.venueName}</strong> · {event.venueRoom}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="font-medium text-slate-800">{event.date}</span>
                            <span>·</span>
                            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-500">
                            <Users className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="truncate">Host: {event.speakerHost}</span>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                            <span>Capacity ({capacityPercentage}%)</span>
                            <span className={spotsRemaining < 20 ? 'text-rose-600 font-bold' : ''}>
                              {spotsRemaining > 0 ? `${spotsRemaining} spots left` : 'Waitlist Only'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                capacityPercentage >= 90 ? 'bg-rose-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedEventForModal(event)}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                      >
                        Details & Map
                      </button>

                      <div className="flex items-center gap-2">
                        {currentRole === 'organizer_admin' && (
                          <button
                            onClick={() => {
                              setEventForAttendees(event);
                              setIsAttendeesModalOpen(true);
                            }}
                            className="text-xs px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition-colors"
                            title="Manage Roster"
                          >
                            Roster
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (!currentUser) { onOpenAuth('login'); return; }
                            onToggleRSVP(event.id);
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                            isRsvpd
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isRsvpd && <Check className="w-3.5 h-3.5" />}
                          <span>{isRsvpd ? 'RSVP Confirmed' : 'RSVP Now'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Agenda List View */
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
              {filteredEvents.map(event => {
                const isRsvpd = currentUser && rsvps.some(r => r.eventId === event.id && r.userId === currentUser.id && r.status === 'confirmed');
                return (
                  <div key={event.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <span className="font-bold text-blue-600">{event.date}</span>
                        <span>·</span>
                        <span>{event.startTime} - {event.endTime}</span>
                        <span>·</span>
                        <span className="text-slate-700 font-medium">{event.category}</span>
                      </div>
                      <h3 
                        onClick={() => setSelectedEventForModal(event)}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.venueName} ({event.venueRoom})</span>
                        <span className="text-slate-400">· Host: {event.speakerHost}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-500">
                        {event.attendeeCount}/{event.capacity} seats
                      </span>
                      <button
                        onClick={() => {
                          if (!currentUser) { onOpenAuth('login'); return; }
                          onToggleRSVP(event.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isRsvpd
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isRsvpd ? 'Confirmed' : 'RSVP'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CAMPUS RESOURCE DIRECTORY                                      */}
      {/* ========================================================================= */}
      {hubSection === 'resources' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">University Student Resource Directory</h2>
            <p className="text-xs text-slate-600 mt-1">
              Essential academic support, health services, transit routes, and physical campus study facilities available to all university students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map(res => (
              <div 
                key={res.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-blue-600">
                      {res.category}
                    </span>
                    {res.isPopular && (
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        High Demand
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{res.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{res.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={`mailto:${res.contactEmail}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{res.contactEmail}</span>
                  </a>
                  <a
                    href={`tel:${res.contactPhone}`}
                    className="flex items-center gap-1.5 font-mono text-slate-500 hover:text-slate-900"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{res.contactPhone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: MY CAMPUS HUB (MY RSVPs & BOOKMARKS)                          */}
      {/* ========================================================================= */}
      {hubSection === 'my_hub' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Student Hub & Registrations</h2>
              <p className="text-xs text-slate-600 mt-1">
                Manage your confirmed RSVP seat reservations and quick-access bookmarked events.
              </p>
            </div>

            <button
              onClick={onOpenProfile}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
            >
              Edit Profile & Student ID
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confirmed RSVPs */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Confirmed Event RSVPs ({myRsvpdEvents.length})</span>
                </h3>
              </div>

              {myRsvpdEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  You have not reserved a seat at any upcoming campus event yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {myRsvpdEvents.map(event => (
                    <div key={event.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-blue-600 font-semibold">{event.date} · {event.startTime}</span>
                        <h4 className="font-bold text-xs text-slate-900">{event.title}</h4>
                        <p className="text-[11px] text-slate-500">{event.venueName} ({event.venueRoom})</p>
                      </div>

                      <button
                        onClick={() => onToggleRSVP(event.id)}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors shrink-0"
                      >
                        Cancel RSVP
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Events */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Saved Bookmarks ({myBookmarkedEvents.length})</span>
                </h3>
              </div>

              {myBookmarkedEvents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No bookmarked events. Click the bookmark icon on any event card to save it here.
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookmarkedEvents.map(event => (
                    <div key={event.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-purple-600 font-semibold">{event.category}</span>
                        <h4 className="font-bold text-xs text-slate-900">{event.title}</h4>
                        <p className="text-[11px] text-slate-500">{event.date} · {event.venueName}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEventForModal(event)}
                          className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onToggleBookmark(event.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                          title="Remove bookmark"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EVENT DETAILS & ACTIONS                                            */}
      {/* ========================================================================= */}
      {selectedEventForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative h-56 bg-slate-100">
              <img
                src={selectedEventForModal.bannerUrl}
                alt={selectedEventForModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedEventForModal(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-blue-600 font-mono">
                  {selectedEventForModal.category}
                </span>
                <span className="text-slate-400 font-mono">
                  Organized by: {selectedEventForModal.organizerName}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {selectedEventForModal.title}
              </h2>

              {/* Explicit Metadata Box */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">{selectedEventForModal.venueName}</strong>
                    <span className="text-slate-500">{selectedEventForModal.venueRoom}</span>
                    <p className="text-[11px] text-slate-400">{selectedEventForModal.venueAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800">{selectedEventForModal.date}</strong>
                    <span className="text-slate-500">{selectedEventForModal.startTime} - {selectedEventForModal.endTime}</span>
                    <p className="text-[11px] text-slate-400">Host: {selectedEventForModal.speakerHost}</p>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About This Event</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedEventForModal.description}
                </p>
              </div>

              {/* Organizer Updates Notice */}
              {selectedEventForModal.updates && selectedEventForModal.updates.length > 0 && (
                <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Megaphone className="w-4 h-4" />
                    <span>Organizer Broadcast Update</span>
                  </div>
                  {selectedEventForModal.updates.map(upd => (
                    <p key={upd.id} className="text-xs leading-relaxed">{upd.message}</p>
                  ))}
                </div>
              )}

              {/* Capacity Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-1">
                  <span>Capacity: {selectedEventForModal.attendeeCount} / {selectedEventForModal.capacity} Seats Reserved</span>
                  <span className="font-bold text-blue-600">
                    {Math.max(0, selectedEventForModal.capacity - selectedEventForModal.attendeeCount)} Spots Available
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600"
                    style={{ width: `${Math.min(100, (selectedEventForModal.attendeeCount / selectedEventForModal.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!currentUser) { onOpenAuth('login'); return; }
                      onToggleBookmark(selectedEventForModal.id);
                    }}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>
                      {currentUser && bookmarks.some(b => b.eventId === selectedEventForModal.id && b.userId === currentUser.id)
                        ? 'Saved in Bookmarks'
                        : 'Bookmark'}
                    </span>
                  </button>

                  {/* Organizer Controls */}
                  {currentRole === 'organizer_admin' && (
                    <button
                      onClick={() => {
                        onDeleteEvent(selectedEventForModal.id);
                        setSelectedEventForModal(null);
                      }}
                      className="px-3 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Event</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!currentUser) { onOpenAuth('login'); return; }
                    onToggleRSVP(selectedEventForModal.id);
                  }}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentUser && rsvps.some(r => r.eventId === selectedEventForModal.id && r.userId === currentUser.id && r.status === 'confirmed')
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {currentUser && rsvps.some(r => r.eventId === selectedEventForModal.id && r.userId === currentUser.id && r.status === 'confirmed') ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>RSVP Confirmed (Click to Cancel)</span>
                    </>
                  ) : (
                    <span>Confirm My RSVP Seat</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ORGANIZER CREATE EVENT                                             */}
      {/* ========================================================================= */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Post & Publish New Campus Event</h2>
                <p className="text-xs text-slate-500">Authorized Organizer Portal (Role-Guarded Endpoint: POST /api/v1/events)</p>
              </div>
              <button
                onClick={() => setIsCreateEventOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createFormError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Drone Racing & AI Workshop"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category / Tag *</label>
                  <select
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Social">Social</option>
                    <option value="Sports">Sports</option>
                    <option value="Career">Career</option>
                    <option value="Arts">Arts</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Speaker / Department Host *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robotics Club & Dr. Smith"
                    value={newEventSpeaker}
                    onChange={(e) => setNewEventSpeaker(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Venue details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue Name *</label>
                  <input
                    type="text"
                    required
                    value={newEventVenueName}
                    onChange={(e) => setNewEventVenueName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue Room / Sector *</label>
                  <input
                    type="text"
                    required
                    value={newEventVenueRoom}
                    onChange={(e) => setNewEventVenueRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity Limit *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="5000"
                    value={newEventCapacity}
                    onChange={(e) => setNewEventCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={newEventStartTime}
                    onChange={(e) => setNewEventStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={newEventEndTime}
                    onChange={(e) => setNewEventEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Description & Agenda *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide comprehensive details for students..."
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              {/* Banner Artwork Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Banner Artwork</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Campus Quad', url: '/src/assets/images/campus_quad_gathering_1794039953331.jpg' },
                    { label: 'Lecture Hall', url: '/src/assets/images/academic_symposium_hall_1794039953003.jpg' },
                    { label: 'Student Commons', url: '/src/assets/images/campus_student_commons_1794039953412.jpg' }
                  ].map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewEventBanner(img.url)}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        newEventBanner === img.url ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1 rounded">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateEventOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  Publish Campus Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ORGANIZER ATTENDEES ROSTER & ANNOUNCEMENTS                         */}
      {/* ========================================================================= */}
      {isAttendeesModalOpen && eventForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Attendee Roster & Broadcast: {eventForAttendees.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Confirmed: {rsvps.filter(r => r.eventId === eventForAttendees.id).length} / {eventForAttendees.capacity} seats
                </p>
              </div>
              <button
                onClick={() => setIsAttendeesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Broadcast Announcement Bar */}
            <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2">
              <label className="text-xs font-bold text-blue-900 block">
                Post Live Announcement to Attendees:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Event moved to Auditorium B; refreshments provided."
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-blue-300 bg-white"
                />
                <button
                  onClick={() => handlePostAnnouncement(eventForAttendees.id)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Broadcast
                </button>
              </div>
            </div>

            {/* Attendee Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Registered Students</span>
                <button
                  onClick={() => downloadRosterCsv(eventForAttendees)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Matriculation ID</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rsvps.filter(r => r.eventId === eventForAttendees.id).map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-medium text-slate-900">{r.userName}</td>
                        <td className="p-2.5 text-slate-600">{r.userEmail}</td>
                        <td className="p-2.5 font-mono text-slate-500">{r.studentId || 'N/A'}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
