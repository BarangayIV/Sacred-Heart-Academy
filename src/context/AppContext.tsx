import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SchoolProfile, 
  Teacher, 
  Subject, 
  Section, 
  Student, 
  ScheduleSlot, 
  GradeSheet, 
  Announcement, 
  Message, 
  MessageThread,
  ThreadMessage,
  AuditLog, 
  AttendanceRecord,
  UserRole,
  ScheduleConflict
} from '../types';
import { 
  initialSchoolProfile, 
  initialTeachers, 
  initialSections, 
  initialSubjects, 
  initialStudents, 
  initialSchedules, 
  initialGradeSheets, 
  initialAnnouncements, 
  initialMessages, 
  initialMessageThreads,
  initialAttendance, 
  initialAuditLogs 
} from '../data/initialData';

interface AppContextType {
  // Role & Session State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeParentEmail: string;
  setActiveParentEmail: (email: string) => void;
  
  // Dynamic User & Role objects
  currentUser: { id: string; name: string; role: string };
  currentTeacher: Teacher | null;
  currentStudent: Student | null;

  // Core Data
  schoolProfile: SchoolProfile;
  teachers: Teacher[];
  subjects: Subject[];
  sections: Section[];
  students: Student[];
  schedules: ScheduleSlot[];
  gradeSheets: GradeSheet[];
  announcements: Announcement[];
  messages: Message[];
  messageThreads: MessageThread[];
  attendance: AttendanceRecord[];
  auditLogs: AuditLog[];

  // Profile Modifiers
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  
  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  archiveStudent: (id: string) => void;
  deleteStudent: (id: string) => void;

  // Subject Actions
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;

  // Section Actions
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (section: Section) => void;
  deleteSection: (id: string) => void;

  // Schedule & Conflict Actions
  checkScheduleConflicts: (slot: Omit<ScheduleSlot, 'id'>, excludeSlotId?: string) => ScheduleConflict[];
  addScheduleSlot: (slot: Omit<ScheduleSlot, 'id'>) => { success: boolean; conflicts?: ScheduleConflict[] };
  updateScheduleSlot: (slot: ScheduleSlot) => { success: boolean; conflicts?: ScheduleConflict[] };
  deleteScheduleSlot: (id: string) => void;

  // Grades Workflow
  saveGradeSheet: (gradeSheet: GradeSheet) => void;
  updateGradeSheet: (gradeSheet: GradeSheet) => void;
  submitGradeSheetForApproval: (gradeSheetId: string) => void;
  approveGradeSheet: (gradeSheetId: string) => void;
  returnGradeSheet: (gradeSheetId: string, feedback: string) => void;
  publishGradeSheet: (gradeSheetId: string) => void;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedDate'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Communications & Threads
  sendMessage: (
    threadIdOrMsg: string | Omit<Message, 'id' | 'timestamp' | 'isRead'>,
    text?: string,
    senderName?: string,
    senderRole?: 'Admin' | 'Teacher' | 'Parent' | 'Student'
  ) => void;
  createMessageThread: (data: {
    subject: string;
    studentId: string;
    studentName: string;
    participantIds: string[];
    participantNames: string[];
    initialMessage: string;
    senderName: string;
    senderRole: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  }) => void;
  replyToMessage: (messageId: string, content: string) => void;
  markMessageAsRead: (messageId: string) => void;

  // Attendance
  recordAttendance: (studentId: string, date: string, status: AttendanceRecord['status'], remarks?: string) => void;

  // System
  logAction: (action: string, category: AuditLog['category'], details: string) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function isTimeOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or initial fallback
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('sha_current_role') as UserRole) || 'admin';
  });
  
  const [activeTeacherId, setActiveTeacherId] = useState<string>(() => {
    return localStorage.getItem('sha_active_teacher') || 'tch-1'; // Austin Alcantara
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return localStorage.getItem('sha_active_student') || 'std-7-01'; // Juan Carlo Dela Cruz
  });

  const [activeParentEmail, setActiveParentEmail] = useState<string>(() => {
    return localStorage.getItem('sha_active_parent') || 'maria.delacruz@gmail.com';
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('sha_school_profile');
    return saved ? JSON.parse(saved) : initialSchoolProfile;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('sha_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('sha_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [sections, setSections] = useState<Section[]>(() => {
    const saved = localStorage.getItem('sha_sections');
    return saved ? JSON.parse(saved) : initialSections;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sha_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [schedules, setSchedules] = useState<ScheduleSlot[]>(() => {
    const saved = localStorage.getItem('sha_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [gradeSheets, setGradeSheets] = useState<GradeSheet[]>(() => {
    const saved = localStorage.getItem('sha_gradesheets');
    return saved ? JSON.parse(saved) : initialGradeSheets;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('sha_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('sha_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(() => {
    const saved = localStorage.getItem('sha_message_threads');
    return saved ? JSON.parse(saved) : initialMessageThreads;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sha_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sha_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Current entity computations
  const currentTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0] || null;
  const currentStudent = students.find(s => s.id === activeStudentId) || students[0] || null;
  
  let currentUser = { id: 'admin-1', name: 'Dr. Maria Consuelo Hernandez', role: 'Administrator' };
  if (currentRole === 'teacher' && currentTeacher) {
    currentUser = { id: currentTeacher.id, name: currentTeacher.name, role: 'Teacher' };
  } else if (currentRole === 'student' && currentStudent) {
    currentUser = { id: currentStudent.id, name: currentStudent.fullName, role: 'Student' };
  } else if (currentRole === 'parent' && currentStudent) {
    currentUser = { id: `parent-${currentStudent.id}`, name: currentStudent.parentName, role: 'Parent' };
  }

  // Persistence effects
  useEffect(() => { localStorage.setItem('sha_current_role', currentRole); }, [currentRole]);
  useEffect(() => { localStorage.setItem('sha_active_teacher', activeTeacherId); }, [activeTeacherId]);
  useEffect(() => { localStorage.setItem('sha_active_student', activeStudentId); }, [activeStudentId]);
  useEffect(() => { localStorage.setItem('sha_active_parent', activeParentEmail); }, [activeParentEmail]);
  useEffect(() => { localStorage.setItem('sha_school_profile', JSON.stringify(schoolProfile)); }, [schoolProfile]);
  useEffect(() => { localStorage.setItem('sha_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('sha_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('sha_sections', JSON.stringify(sections)); }, [sections]);
  useEffect(() => { localStorage.setItem('sha_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('sha_schedules', JSON.stringify(schedules)); }, [schedules]);
  useEffect(() => { localStorage.setItem('sha_gradesheets', JSON.stringify(gradeSheets)); }, [gradeSheets]);
  useEffect(() => { localStorage.setItem('sha_announcements', JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { localStorage.setItem('sha_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('sha_message_threads', JSON.stringify(messageThreads)); }, [messageThreads]);
  useEffect(() => { localStorage.setItem('sha_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('sha_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  // Helper log function
  const logAction = (action: string, category: AuditLog['category'], details: string) => {
    let userName = 'Administrator';
    let userRoleStr = 'Admin';
    if (currentRole === 'teacher') {
      const t = teachers.find(x => x.id === activeTeacherId);
      userName = t ? `${t.name} (Teacher)` : 'Teacher';
      userRoleStr = 'Teacher';
    } else if (currentRole === 'parent') {
      const s = students.find(x => x.parentEmail === activeParentEmail);
      userName = s ? `${s.parentName} (Parent)` : 'Parent';
      userRoleStr = 'Parent';
    } else if (currentRole === 'student') {
      const s = students.find(x => x.id === activeStudentId);
      userName = s ? `${s.fullName} (Student)` : 'Student';
      userRoleStr = 'Student';
    }

    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('en-US', { hour12: true }),
      userName,
      userRole: userRoleStr,
      action,
      category,
      details,
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Modifiers
  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile(prev => ({ ...prev, ...profile }));
    logAction('School Profile Updated', 'System', 'Updated institutional credentials and S.Y. parameters');
  };

  // Teachers
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
    };
    setTeachers(prev => [...prev, newTeacher]);
    logAction('Faculty Added', 'Authentication', `Registered faculty profile: ${newTeacher.name} (${newTeacher.specialization})`);
  };

  const updateTeacher = (updated: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
    logAction('Faculty Updated', 'Authentication', `Modified faculty profile: ${updated.name}`);
  };

  const deleteTeacher = (id: string) => {
    const t = teachers.find(x => x.id === id);
    setTeachers(prev => prev.filter(x => x.id !== id));
    logAction('Faculty Removed', 'Authentication', `Removed faculty member: ${t?.name || id}`);
  };

  // Students
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
    };
    setStudents(prev => [...prev, newStudent]);
    logAction('Learner Enrolled', 'Enrollment', `Registered learner: ${newStudent.fullName} (LRN: ${newStudent.lrn}, Sec: ${newStudent.sectionName})`);
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    logAction('Learner Record Updated', 'Enrollment', `Updated details for ${updated.fullName} (LRN: ${updated.lrn})`);
  };

  const archiveStudent = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, enrollmentStatus: 'Archived' as const } : s));
    const s = students.find(x => x.id === id);
    logAction('Learner Archived', 'Enrollment', `Archived student record: ${s?.fullName}`);
  };

  const deleteStudent = (id: string) => {
    const s = students.find(x => x.id === id);
    setStudents(prev => prev.filter(x => x.id !== id));
    logAction('Learner Deleted', 'Enrollment', `Deleted record for: ${s?.fullName || id}`);
  };

  // Subjects
  const addSubject = (subjData: Omit<Subject, 'id'>) => {
    const newSubj: Subject = {
      ...subjData,
      id: `subj-${Date.now()}`,
    };
    setSubjects(prev => [...prev, newSubj]);
    logAction('Subject Added', 'System', `Added curriculum subject: ${newSubj.name} (${newSubj.code})`);
  };

  const updateSubject = (updated: Subject) => {
    setSubjects(prev => prev.map(s => s.id === updated.id ? updated : s));
    logAction('Subject Updated', 'System', `Updated subject: ${updated.name}`);
  };

  const deleteSubject = (id: string) => {
    const s = subjects.find(x => x.id === id);
    setSubjects(prev => prev.filter(x => x.id !== id));
    logAction('Subject Deleted', 'System', `Removed curriculum subject: ${s?.name || id}`);
  };

  // Sections
  const addSection = (secData: Omit<Section, 'id'>) => {
    const newSec: Section = {
      ...secData,
      id: `sec-${Date.now()}`,
    };
    setSections(prev => [...prev, newSec]);
    logAction('Section Added', 'System', `Created Section Grade ${newSec.gradeLevel} - ${newSec.name}`);
  };

  const updateSection = (updated: Section) => {
    setSections(prev => prev.map(s => s.id === updated.id ? updated : s));
    logAction('Section Updated', 'System', `Updated Section: ${updated.name}`);
  };

  const deleteSection = (id: string) => {
    const s = sections.find(x => x.id === id);
    setSections(prev => prev.filter(x => x.id !== id));
    logAction('Section Deleted', 'System', `Removed section: ${s?.name || id}`);
  };

  // Schedule Conflicts
  const checkScheduleConflicts = (slot: Omit<ScheduleSlot, 'id'>, excludeSlotId?: string): ScheduleConflict[] => {
    const conflicts: ScheduleConflict[] = [];

    const otherSlots = schedules.filter(s => s.id !== excludeSlotId && s.day === slot.day);

    for (const other of otherSlots) {
      if (isTimeOverlapping(slot.startTime, slot.endTime, other.startTime, other.endTime)) {
        // Teacher conflict
        if (slot.teacherId && other.teacherId === slot.teacherId) {
          conflicts.push({
            type: 'TeacherConflict',
            message: `Teacher ${slot.teacherName} is already assigned to ${other.subjectName} (${other.sectionName}) during ${other.startTime}–${other.endTime} on ${slot.day}.`,
            conflictingSlot: other,
          });
        }
        // Section conflict
        if (slot.sectionId && other.sectionId === slot.sectionId) {
          conflicts.push({
            type: 'SectionConflict',
            message: `Section ${slot.sectionName} already has class ${other.subjectName} with ${other.teacherName} at ${other.startTime}–${other.endTime}.`,
            conflictingSlot: other,
          });
        }
        // Room conflict
        if (slot.room && other.room && slot.room.toLowerCase() === other.room.toLowerCase()) {
          conflicts.push({
            type: 'RoomConflict',
            message: `Room ${slot.room} is occupied by ${other.sectionName} (${other.subjectName}) during this period.`,
            conflictingSlot: other,
          });
        }
      }
    }

    return conflicts;
  };

  const addScheduleSlot = (slotData: Omit<ScheduleSlot, 'id'>) => {
    const conflicts = checkScheduleConflicts(slotData);
    if (conflicts.length > 0) {
      return { success: false, conflicts };
    }

    const newSlot: ScheduleSlot = {
      ...slotData,
      id: `sch-${Date.now()}`,
    };

    setSchedules(prev => [...prev, newSlot]);
    logAction('Schedule Slot Added', 'Schedule', `Scheduled ${newSlot.subjectName} for ${newSlot.sectionName} on ${newSlot.day} ${newSlot.startTime}–${newSlot.endTime} (Teacher: ${newSlot.teacherName})`);
    return { success: true };
  };

  const updateScheduleSlot = (updated: ScheduleSlot) => {
    const conflicts = checkScheduleConflicts(updated, updated.id);
    if (conflicts.length > 0) {
      return { success: false, conflicts };
    }

    setSchedules(prev => prev.map(s => s.id === updated.id ? updated : s));
    logAction('Schedule Slot Updated', 'Schedule', `Updated timetable entry for ${updated.subjectName} (${updated.sectionName})`);
    return { success: true };
  };

  const deleteScheduleSlot = (id: string) => {
    const slot = schedules.find(s => s.id === id);
    setSchedules(prev => prev.filter(s => s.id !== id));
    logAction('Schedule Slot Removed', 'Schedule', `Removed schedule slot ${slot?.subjectName} (${slot?.sectionName})`);
  };

  // Grade Workflow
  const saveGradeSheet = (sheet: GradeSheet) => {
    setGradeSheets(prev => {
      const exists = prev.some(g => g.id === sheet.id);
      if (exists) {
        return prev.map(g => g.id === sheet.id ? sheet : g);
      }
      return [...prev, sheet];
    });
    logAction('Grade Sheet Saved', 'Grades', `Saved draft grades for ${sheet.subjectName} (${sheet.sectionName})`);
  };

  const updateGradeSheet = saveGradeSheet;

  const submitGradeSheetForApproval = (gradeSheetId: string) => {
    setGradeSheets(prev => prev.map(g => {
      if (g.id === gradeSheetId) {
        return {
          ...g,
          status: 'Submitted',
          submissionDate: new Date().toISOString().split('T')[0],
        };
      }
      return g;
    }));
    const sheet = gradeSheets.find(g => g.id === gradeSheetId);
    logAction('Grades Submitted for Review', 'Grades', `Teacher submitted grade sheet for ${sheet?.subjectName} (${sheet?.sectionName}) to Administration.`);
  };

  const approveGradeSheet = (gradeSheetId: string) => {
    setGradeSheets(prev => prev.map(g => {
      if (g.id === gradeSheetId) {
        return {
          ...g,
          status: 'Approved',
          approvalDate: new Date().toISOString().split('T')[0],
        };
      }
      return g;
    }));
    const sheet = gradeSheets.find(g => g.id === gradeSheetId);
    logAction('Grades Approved', 'Grades', `Administrator approved grade sheet for ${sheet?.subjectName} (${sheet?.sectionName})`);
  };

  const returnGradeSheet = (gradeSheetId: string, feedback: string) => {
    setGradeSheets(prev => prev.map(g => {
      if (g.id === gradeSheetId) {
        return {
          ...g,
          status: 'Returned',
          adminFeedback: feedback,
        };
      }
      return g;
    }));
    const sheet = gradeSheets.find(g => g.id === gradeSheetId);
    logAction('Grades Returned for Correction', 'Grades', `Administrator returned grade sheet ${sheet?.subjectName} (${sheet?.sectionName}) with note: "${feedback}"`);
  };

  const publishGradeSheet = (gradeSheetId: string) => {
    setGradeSheets(prev => prev.map(g => {
      if (g.id === gradeSheetId) {
        return {
          ...g,
          status: 'Published',
          approvalDate: g.approvalDate || new Date().toISOString().split('T')[0],
        };
      }
      return g;
    }));
    const sheet = gradeSheets.find(g => g.id === gradeSheetId);
    logAction('Grades Published', 'Grades', `Published grades for ${sheet?.subjectName} (${sheet?.sectionName}) to Student & Parent portals.`);
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'publishedDate'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logAction('Announcement Posted', 'Communication', `Posted notice: "${newAnn.title}" for [${newAnn.targetAudience}]`);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    logAction('Announcement Deleted', 'Communication', `Removed announcement: ${id}`);
  };

  // Communications & Threads
  const sendMessage = (
    threadIdOrMsg: string | Omit<Message, 'id' | 'timestamp' | 'isRead'>,
    text?: string,
    senderName?: string,
    senderRole?: 'Admin' | 'Teacher' | 'Parent' | 'Student'
  ) => {
    if (typeof threadIdOrMsg === 'string' && text) {
      // Thread response
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMsg: ThreadMessage = {
        id: `tmsg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: senderName || currentUser.name,
        senderRole: senderRole || 'Teacher',
        text,
        timestamp,
      };

      setMessageThreads(prev => prev.map(thread => {
        if (thread.id === threadIdOrMsg) {
          return {
            ...thread,
            lastUpdated: `Today, ${timestamp}`,
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      }));

      logAction('Message Sent', 'Communication', `Sent reply in thread ${threadIdOrMsg} from ${senderName || currentUser.name}`);
    } else if (typeof threadIdOrMsg === 'object') {
      const msgObj = threadIdOrMsg as Omit<Message, 'id' | 'timestamp' | 'isRead'>;
      const newMsg: Message = {
        ...msgObj,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        replies: [],
      };
      setMessages(prev => [newMsg, ...prev]);
      logAction('Message Sent', 'Communication', `Sent communication from ${newMsg.senderName} (${newMsg.senderRole}) to ${newMsg.recipientName}`);
    }
  };

  const createMessageThread = (data: {
    subject: string;
    studentId: string;
    studentName: string;
    participantIds: string[];
    participantNames: string[];
    initialMessage: string;
    senderName: string;
    senderRole: 'Admin' | 'Teacher' | 'Parent' | 'Student';
  }) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newThread: MessageThread = {
      id: `th-${Date.now()}`,
      subject: data.subject,
      studentId: data.studentId,
      studentName: data.studentName,
      participantIds: data.participantIds,
      participantNames: data.participantNames,
      lastUpdated: `Today, ${timestamp}`,
      isRead: true,
      messages: [
        {
          id: `tmsg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: data.senderName,
          senderRole: data.senderRole,
          text: data.initialMessage,
          timestamp,
        },
      ],
    };

    setMessageThreads(prev => [newThread, ...prev]);
    logAction('Conversation Started', 'Communication', `Started conversation: "${data.subject}" with ${data.participantNames.join(', ')}`);
  };

  const replyToMessage = (messageId: string, content: string) => {
    let replierId = 'admin-user';
    let replierName = 'Administrator';
    let replierRole: UserRole = currentRole;

    if (currentRole === 'teacher') {
      const t = teachers.find(x => x.id === activeTeacherId);
      if (t) { replierId = t.id; replierName = t.name; }
    } else if (currentRole === 'parent') {
      const s = students.find(x => x.parentEmail === activeParentEmail);
      if (s) { replierId = s.parentEmail; replierName = s.parentName; }
    } else if (currentRole === 'student') {
      const s = students.find(x => x.id === activeStudentId);
      if (s) { replierId = s.id; replierName = s.fullName; }
    }

    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const newReply = {
          id: `rep-${Date.now()}`,
          senderId: replierId,
          senderName: replierName,
          senderRole: replierRole,
          content,
          timestamp: new Date().toISOString(),
        };
        return {
          ...m,
          replies: [...(m.replies || []), newReply],
        };
      }
      return m;
    }));

    logAction('Message Reply', 'Communication', `Replied to thread "${messageId}" by ${replierName}`);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isRead: true } : m));
  };

  const recordAttendance = (studentId: string, date: string, status: AttendanceRecord['status'], remarks?: string) => {
    setAttendance(prev => {
      const student = students.find(s => s.id === studentId);
      const studentName = student?.fullName || 'Unknown Student';
      const sectionId = student?.sectionId || '';
      
      const filtered = prev.filter(a => !(a.studentId === studentId && a.date === date));
      return [...filtered, {
        id: `att-${Date.now()}-${studentId}`,
        studentId,
        studentName,
        sectionId,
        date,
        status,
        remarks,
      }];
    });
  };

  const resetToDefaults = () => {
    setSchoolProfile(initialSchoolProfile);
    setTeachers(initialTeachers);
    setSubjects(initialSubjects);
    setSections(initialSections);
    setStudents(initialStudents);
    setSchedules(initialSchedules);
    setGradeSheets(initialGradeSheets);
    setAnnouncements(initialAnnouncements);
    setMessages(initialMessages);
    setMessageThreads(initialMessageThreads);
    setAttendance(initialAttendance);
    setAuditLogs(initialAuditLogs);
    localStorage.clear();
    logAction('Database Reset', 'System', 'Reset all records back to Sacred Heart Academy S.Y. 2026–2027 Timetable Baseline');
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      activeTeacherId,
      setActiveTeacherId,
      activeStudentId,
      setActiveStudentId,
      activeParentEmail,
      setActiveParentEmail,

      currentUser,
      currentTeacher,
      currentStudent,

      schoolProfile,
      teachers,
      subjects,
      sections,
      students,
      schedules,
      gradeSheets,
      announcements,
      messages,
      messageThreads,
      attendance,
      auditLogs,

      updateSchoolProfile,
      addTeacher,
      updateTeacher,
      deleteTeacher,

      addStudent,
      updateStudent,
      archiveStudent,
      deleteStudent,

      addSubject,
      updateSubject,
      deleteSubject,

      addSection,
      updateSection,
      deleteSection,

      checkScheduleConflicts,
      addScheduleSlot,
      updateScheduleSlot,
      deleteScheduleSlot,

      saveGradeSheet,
      updateGradeSheet,
      submitGradeSheetForApproval,
      approveGradeSheet,
      returnGradeSheet,
      publishGradeSheet,

      addAnnouncement,
      deleteAnnouncement,

      sendMessage,
      createMessageThread,
      replyToMessage,
      markMessageAsRead,

      recordAttendance,
      logAction,
      resetToDefaults,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppContextProvider = AppProvider;

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
