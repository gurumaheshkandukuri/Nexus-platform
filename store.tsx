
import React, { createContext, useContext, useState } from 'react';
import { 
  User, Course, Event, HostelAnnouncement, ClassroomTopic, StudentFeedback, StatusType, Meeting, AnonymousQuestion, PlatformNotification, UserRole, Enrollment, OfficeHourSlot
} from './types';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  targetRole?: UserRole;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  announcementTab: 'Courses' | 'Hostels' | 'Events';
  setAnnouncementTab: (tab: 'Courses' | 'Hostels' | 'Events') => void;
  courses: Course[];
  addCourse: (course: Course) => void;
  events: Event[];
  addEvent: (event: Event) => void;
  enrollments: Enrollment[];
  addEnrollment: (enrollment: Omit<Enrollment, 'id' | 'timestamp'>) => void;
  hostelAnnouncements: HostelAnnouncement[];
  addHostelAnnouncement: (ann: HostelAnnouncement) => void;
  topics: ClassroomTopic[];
  updateTopic: (topic: ClassroomTopic) => void;
  feedbacks: StudentFeedback[];
  submitFeedback: (fb: StudentFeedback) => void;
  questions: AnonymousQuestion[];
  addQuestion: (q: AnonymousQuestion) => void;
  toggleQuestionPriority: (id: string) => void;
  meetings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  officeHourSlots: OfficeHourSlot[];
  approveOfficeHour: (id: string) => void;
  notifications: PlatformNotification[];
  addNotification: (notif: Omit<PlatformNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsRead: () => void;
  toasts: Toast[];
  notify: (message: string, type?: 'success' | 'info' | 'error', targetRole?: UserRole) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState('Home');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [announcementTab, setAnnouncementTab] = useState<'Courses' | 'Hostels' | 'Events'>('Courses');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<PlatformNotification[]>([
    {
      id: 'n1',
      title: 'Platform Launched',
      message: 'Nexus is now active for campus students.',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      type: 'info',
      read: false,
      targetRole: UserRole.STUDENT
    }
  ]);
  
  const [courses, setCourses] = useState<Course[]>([
    { id: 'c1', name: 'Cisco Networking Academy', cost: '₹0 (Free)', deadline: '2026-01-27', description: 'Master foundational networking skills used globally.', website: 'https://www.netacad.com/' },
    { id: 'c2', name: 'DSA Mastery Program', cost: '₹2,499', deadline: '2026-01-15', description: 'Advanced structures and algorithm optimization techniques.', website: 'https://nexus.edu/dsa' },
    { id: 'c3', name: 'Python for AI/ML', cost: '₹1,999', deadline: '2026-01-20', description: 'Fast-track your career in Artificial Intelligence.', website: 'https://nexus.edu/python' },
    { id: 'c4', name: 'Full Stack Development', cost: '₹4,500', deadline: '2026-02-05', description: 'End-to-end web development with React and Node.js.', website: 'https://nexus.edu/fullstack' },
    { id: 'c5', name: 'Cloud Computing Essentials', cost: '₹3,000', deadline: '2026-01-30', description: 'Introduction to AWS, Azure, and GCP architectures.', website: 'https://nexus.edu/cloud' },
  ]);

  const [events, setEvents] = useState<Event[]>([
    { id: 'e1', name: 'Google Developer Groups', venue: 'CSE Department Seminar Hall', time: '04:00 PM', date: '2026-01-05', capacity: 100 },
    { id: 'e2', name: 'Swecha Open Source Summit', venue: 'Mechanical Seminar Hall', time: '10:00 AM', date: '2026-01-12', capacity: 150 },
    { id: 'e3', name: 'Emerging Technologies Club', venue: 'Main Auditorium', time: '02:00 PM', date: '2026-01-20', capacity: 300 },
  ]);

  const [hostelAnnouncements, setHostelAnnouncements] = useState<HostelAnnouncement[]>([
    { id: 'h1', type: 'Girls', content: 'Mess timings for lunch changed to 12:30 PM.', date: '2025-12-28' },
    { id: 'h6', type: 'Boys', content: 'Cricket tournament registration closes today.', date: '2025-12-28' },
  ]);

  const [topics, setTopics] = useState<ClassroomTopic[]>([
    { id: 't1', subject: 'DSA', topicName: 'Dynamic Programming Optimization' },
    { id: 't2', subject: 'Python', topicName: 'Asynchronous Programming' },
    { id: 't3', subject: 'Machine Learning', topicName: 'Neural Networks Architecture' },
  ]);

  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 'm1', title: 'Python Revision', date: '2025-12-28', time: '02:30 PM', type: 'Student', link: 'https://meet.google.com/abc-defg-hij' }
  ]);

  const [officeHourSlots, setOfficeHourSlots] = useState<OfficeHourSlot[]>([
    { id: 's1', time: '10:00 AM - 10:40 AM', day: 'Saturday', studentName: 'Rahul Sharma', reason: 'Need help with DP Optimization', status: 'requested' },
    { id: 's2', time: '10:40 AM - 11:20 AM', day: 'Saturday', studentName: 'Sneha Reddy', reason: 'ML Project Architecture Review', status: 'requested' },
    { id: 's3', time: '11:20 AM - 12:00 PM', day: 'Saturday', status: 'available' },
  ]);

  const notify = (message: string, type: 'success' | 'info' | 'error' = 'success', targetRole?: UserRole) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, targetRole }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const addNotification = (notif: Omit<PlatformNotification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [{
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    }, ...prev]);
  };

  const markNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const updateCurrentUser = (updates: Partial<User>) => setCurrentUser(prev => prev ? { ...prev, ...updates } : null);

  const addCourse = (course: Course) => {
    setCourses(prev => [course, ...prev]);
    addNotification({ title: 'New Course', message: `Catalog updated: ${course.name}`, type: 'success', targetRole: UserRole.STUDENT });
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [event, ...prev]);
    addNotification({ title: 'New Campus Event', message: `${event.name} on ${event.date}`, type: 'info', targetRole: UserRole.STUDENT });
  };

  const addEnrollment = (e: Omit<Enrollment, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    const newEnrollment: Enrollment = { ...e, id: Math.random().toString(36).substring(2, 9), timestamp };
    setEnrollments(prev => [newEnrollment, ...prev]);
    addNotification({ 
      title: 'Action Required: Enrollment Logged', 
      message: `Student ${e.studentName} (${e.studentEmail}) has registered for the ${e.type}: ${e.itemName}. Check catalog availability.`, 
      type: 'success', 
      targetRole: UserRole.ADMIN 
    });
  };

  const addHostelAnnouncement = (ann: HostelAnnouncement) => setHostelAnnouncements(prev => [ann, ...prev]);
  
  const updateTopic = (topic: ClassroomTopic) => {
    setTopics(prev => {
      const idx = prev.findIndex(t => t.subject === topic.subject);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = topic;
        return next;
      }
      return [...prev, topic];
    });
    addNotification({ title: 'Curriculum Update', message: `New topic for ${topic.subject}: ${topic.topicName}`, type: 'info', targetRole: UserRole.STUDENT });
  };

  const submitFeedback = (fb: StudentFeedback) => {
    setFeedbacks(prev => [...prev.filter(f => f.studentId !== fb.studentId || f.subject !== fb.subject), fb]);
    addNotification({ title: 'Student Review', message: `Sentiment for ${fb.subject}: ${fb.status}`, type: 'warning', targetRole: UserRole.EDUCATOR });
  };

  const addQuestion = (q: AnonymousQuestion) => {
    setQuestions(prev => [q, ...prev]);
    addNotification({ title: 'Anonymous Query', message: `Query on ${q.subject}`, type: 'info', targetRole: UserRole.EDUCATOR });
  };

  const toggleQuestionPriority = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, priority: q.priority === 'high' ? 'normal' : 'high' } : q));
  };

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
    addNotification({ title: 'Meeting Scheduled', message: `${meeting.title} on ${meeting.date}`, type: 'meeting', targetRole: meeting.type === 'Student' ? UserRole.STUDENT : UserRole.EDUCATOR });
  };

  const approveOfficeHour = (id: string) => {
    const slotToApprove = officeHourSlots.find(s => s.id === id);
    if (!slotToApprove) return;
    setOfficeHourSlots(prev => prev.map(s => s.id === id ? { ...s, status: 'booked' } : s));
    if (slotToApprove.studentName) {
      addMeeting({ id: Math.random().toString(36).substring(2, 9), title: `Mentorship: ${slotToApprove.studentName}`, date: '2026-01-10', time: slotToApprove.time.split(' - ')[0], type: 'Student', link: 'https://meet.google.com/new' });
      addNotification({ title: 'Mentorship Confirmed', message: `Prof. approved your session for ${slotToApprove.time}.`, type: 'meeting', targetRole: UserRole.STUDENT });
      notify(`Session Scheduled: Slot approved for ${slotToApprove.time}!`, 'info', UserRole.STUDENT);
      notify(`Slot ${slotToApprove.time} confirmed.`, 'success');
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, updateCurrentUser,
      currentRoute, setCurrentRoute,
      isCalendarOpen, setIsCalendarOpen,
      announcementTab, setAnnouncementTab,
      courses, addCourse,
      events, addEvent,
      enrollments, addEnrollment,
      hostelAnnouncements, addHostelAnnouncement,
      topics, updateTopic,
      feedbacks, submitFeedback,
      questions, addQuestion, toggleQuestionPriority,
      meetings, addMeeting,
      officeHourSlots, approveOfficeHour,
      notifications, addNotification, markNotificationsRead,
      toasts, notify, removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
