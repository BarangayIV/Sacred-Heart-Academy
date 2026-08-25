export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface SchoolProfile {
  name: string;
  subTitle?: string;
  address: string;
  division: string;
  region: string;
  schoolId: string;
  schoolYear: string;
  currentQuarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  activeQuarter?: '1st Quarter' | '2nd Quarter' | '3rd Quarter' | '4th Quarter';
  principalName: string;
  contactEmail?: string;
  contactPhone?: string;
  email?: string;
  logoUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  subjects: string[]; // e.g. ["Mathematics 7", "ESP 7"]
  gradeLevels: number[]; // e.g. [7]
  assignedSections: string[]; // Section IDs
  adviserOfSectionId?: string; // If section adviser
  status: 'Active' | 'On Leave' | 'Inactive';
  specialization: string;
  notes?: string;
}

export interface Subject {
  id: string;
  code: string; // e.g. "MATH-7"
  name: string; // e.g. "Mathematics 7"
  gradeLevel: number;
  assignedTeacherId: string;
  assignedTeacherName: string;
  units: number;
  description: string;
  category: 'Core' | 'Applied' | 'Specialized';
}

export interface Section {
  id: string;
  name: string; // e.g. "St. Paul"
  gradeLevel: number; // e.g. 7
  room: string; // e.g. "Bldg A - Room 101"
  adviserId: string;
  adviserName: string;
  capacity: number;
  schoolYear: string;
}

export interface Student {
  id: string;
  lrn: string; // 12-digit Learner Reference Number
  fullName: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  birthDate: string;
  gradeLevel: number;
  sectionId: string;
  sectionName: string;
  schoolYear: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentRelationship: string;
  address: string;
  enrollmentStatus: 'Enrolled' | 'Transferred' | 'Dropped' | 'Archived';
  avatarUrl: string;
  generalAverage?: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  startTime: string; // "07:30"
  endTime: string;   // "08:30"
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string;
  teacherName: string;
  sectionId: string;
  sectionName: string;
  gradeLevel: number;
  room: string;
}

export type GradeStatus = 'Draft' | 'Submitted' | 'Approved' | 'Published' | 'Returned';

export interface StudentSubjectGrade {
  studentId: string;
  studentName: string;
  lrn: string;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  finalGrade?: number;
  remarks?: 'Passed' | 'Failed' | 'Pending';
  teacherNotes?: string;
}

export interface GradeSheet {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  sectionId: string;
  sectionName: string;
  gradeLevel: number;
  teacherId: string;
  teacherName: string;
  schoolYear: string;
  status: GradeStatus;
  submissionDate?: string;
  approvalDate?: string;
  adminFeedback?: string;
  grades: StudentSubjectGrade[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents' | 'Grade7' | 'Grade8' | 'Grade9' | 'Grade10' | 'SpecificSection';
  targetSectionId?: string;
  targetSectionName?: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  publishedDate: string;
  expiryDate?: string;
  category: 'Academic' | 'Administrative' | 'Events' | 'Exam Schedule' | 'General';
}

export interface ThreadMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  text: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  studentId: string;
  studentName: string;
  participantIds: string[];
  participantNames: string[];
  lastUpdated: string;
  isRead: boolean;
  messages: ThreadMessage[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  studentId?: string;
  studentName?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  replies?: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    content: string;
    timestamp: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  sectionId: string;
  date: string;
  status: 'Present' | 'Late' | 'Absent' | 'Excused';
  remarks?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'Grades' | 'Enrollment' | 'Schedule' | 'Authentication' | 'System' | 'Communication';
  details: string;
  ipAddress?: string;
}

export interface ScheduleConflict {
  type: 'TeacherConflict' | 'SectionConflict' | 'RoomConflict';
  message: string;
  conflictingSlot: ScheduleSlot;
}

