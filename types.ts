
export enum UserRole {
  STUDENT = 'Student',
  EDUCATOR = 'Educator',
  ADMIN = 'Admin'
}

export enum AdminType {
  OFFICIAL = 'Official',
  WARDEN = 'Warden'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adminType?: AdminType;
  profilePicture?: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'meeting' | 'ai';
  read: boolean;
  targetRole?: UserRole;
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Course {
  id: string;
  name: string;
  cost: string;
  deadline: string;
  description: string;
  website: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  time: string;
  date: string;
  capacity: number;
}

export interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  itemName: string; // Course or Event Name
  type: 'Course' | 'Event';
  timestamp: string;
}

export interface HostelAnnouncement {
  id: string;
  type: 'Girls' | 'Boys';
  content: string;
  date: string;
}

export interface ClassroomTopic {
  id: string;
  subject: string;
  topicName: string;
}

export enum StatusType {
  ON_TRACK = 'On Track',
  NEED_REFRESH = 'Need a Refresh',
  STUCK = 'Help! I\'m Stuck'
}

export interface StudentFeedback {
  studentId: string;
  subject: string;
  status: StatusType;
}

export interface AnonymousQuestion {
  id: string;
  subject: string;
  text: string;
  timestamp: string;
  priority?: 'normal' | 'high';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string; // Added time field
  type: 'Student' | 'Faculty';
  link: string;
}

export interface OfficeHourSlot {
  id: string;
  time: string;
  day: string;
  studentName?: string;
  reason?: string;
  status: 'available' | 'requested' | 'booked';
}
