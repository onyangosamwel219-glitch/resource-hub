export type UserRole = 'guest' | 'student' | 'organizer_admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  studentId?: string;
  department?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type EventCategory = 'Academic' | 'Social' | 'Sports' | 'Career' | 'Arts' | 'Technology';

export interface EventUpdate {
  id: string;
  timestamp: string;
  authorName: string;
  message: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  venueName: string;
  venueRoom: string;
  venueAddress: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (e.g. 14:00)
  endTime: string; // HH:MM (e.g. 16:30)
  speakerHost: string;
  capacity: number;
  attendeeCount: number;
  bannerUrl: string;
  organizerId: string;
  organizerName: string;
  updates: EventUpdate[];
  isFeatured?: boolean;
}

export interface EventRSVP {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  studentId?: string;
  registeredAt: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
}

export interface EventBookmark {
  id: string;
  eventId: string;
  userId: string;
  bookmarkedAt: string;
}

export interface CampusResource {
  id: string;
  name: string;
  category: 'Academic' | 'Health & Counseling' | 'Facilities' | 'Career' | 'Technology' | 'Financial & Food';
  description: string;
  location: string;
  hours: string;
  contactEmail: string;
  contactPhone: string;
  linkUrl: string;
  isPopular?: boolean;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  roleRequired: string;
  summary: string;
  description: string;
  requestBody?: string;
  responseSuccess: string;
  statusSuccess: number;
  errorCodes: { code: number; reason: string }[];
}

export interface SchemaTableSpec {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
    isPrimary?: boolean;
    isForeign?: boolean;
  }[];
  indices: string[];
}

export interface SprintTask {
  id: string;
  phaseId: number;
  title: string;
  description: string;
  deliverable: string;
  dod: string; // Definition of Done
  completed: boolean;
  role: 'Backend' | 'Frontend' | 'DevOps' | 'Security';
}
