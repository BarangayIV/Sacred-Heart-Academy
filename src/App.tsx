import React, { useState, useEffect } from 'react';
import { 
  AppContextProvider, 
  useApp 
} from './context/AppContext';
import { Header } from './components/common/Header';

// Homepage Component
import { SchoolHomepage } from './components/home/SchoolHomepage';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ScheduleManager } from './components/admin/ScheduleManager';
import { GradeApprovalManager } from './components/admin/GradeApprovalManager';
import { StudentManager } from './components/admin/StudentManager';
import { TeacherManager } from './components/admin/TeacherManager';
import { SubjectManager } from './components/admin/SubjectManager';
import { SectionManager } from './components/admin/SectionManager';
import { ReportsManager } from './components/admin/ReportsManager';
import { AnnouncementManager } from './components/admin/AnnouncementManager';
import { AuditTrail } from './components/admin/AuditTrail';
import { SchoolProfileModal } from './components/admin/SchoolProfileModal';

// Teacher Components
import { TeacherGradebook } from './components/teacher/TeacherGradebook';
import { TeacherScheduleView } from './components/teacher/TeacherScheduleView';
import { TeacherAttendance } from './components/teacher/TeacherAttendance';

// Student & Parent Components
import { StudentPortalView } from './components/student/StudentPortalView';
import { ParentPortalView } from './components/parent/ParentPortalView';

// Communication Hub
import { MessagingCenter } from './components/communication/MessagingCenter';

// Types & Icons
import { UserRole } from './types';
import { 
  LayoutDashboard, 
  Calendar, 
  FileCheck2, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  Layers, 
  MessageSquare, 
  Bell, 
  FileText, 
  Clock,
  Calculator,
  Users,
  Home,
  LogOut
} from 'lucide-react';

interface PortalMainContentProps {
  onGoToHomepage: () => void;
}

const PortalMainContent: React.FC<PortalMainContentProps> = ({ onGoToHomepage }) => {
  const { currentRole } = useApp();

  // Active View Tab State
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [teacherTab, setTeacherTab] = useState<string>('gradebook');
  const [studentTab, setStudentTab] = useState<string>('portal');
  const [parentTab, setParentTab] = useState<string>('portal');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      {/* Top Header & Role Persona Switcher */}
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAnnouncements={() => {
          if (currentRole === 'admin') setAdminTab('announcements');
          else if (currentRole === 'teacher') setTeacherTab('announcements');
          else if (currentRole === 'student') setStudentTab('announcements');
          else if (currentRole === 'parent') setParentTab('announcements');
        }}
        onGoToHomepage={onGoToHomepage}
      />

      {/* Role Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-[68px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
            
            {/* ADMIN NAVIGATION */}
            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setAdminTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setAdminTab('schedules')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'schedules' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Timetable & Conflicts</span>
                </button>

                <button
                  onClick={() => setAdminTab('grades')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'grades' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Grade Approval Workflow</span>
                </button>

                <button
                  onClick={() => setAdminTab('students')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'students' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Students & LRN</span>
                </button>

                <button
                  onClick={() => setAdminTab('teachers')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'teachers' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Faculty (17)</span>
                </button>

                <button
                  onClick={() => setAdminTab('subjects')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'subjects' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Subjects</span>
                </button>

                <button
                  onClick={() => setAdminTab('sections')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'sections' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sections (15)</span>
                </button>

                <button
                  onClick={() => setAdminTab('reports')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'reports' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reports & SF9</span>
                </button>

                <button
                  onClick={() => setAdminTab('messages')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'messages' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Parent Threads</span>
                </button>

                <button
                  onClick={() => setAdminTab('announcements')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'announcements' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Announcements</span>
                </button>

                <button
                  onClick={() => setAdminTab('audit')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    adminTab === 'audit' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Audit Logs</span>
                </button>
              </>
            )}

            {/* TEACHER NAVIGATION */}
            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => setTeacherTab('gradebook')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    teacherTab === 'gradebook' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>ECR Grade Encoder</span>
                </button>

                <button
                  onClick={() => setTeacherTab('schedule')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    teacherTab === 'schedule' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>My Teaching Schedule</span>
                </button>

                <button
                  onClick={() => setTeacherTab('attendance')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    teacherTab === 'attendance' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Homeroom Attendance</span>
                </button>

                <button
                  onClick={() => setTeacherTab('messages')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    teacherTab === 'messages' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Parent Communication</span>
                </button>

                <button
                  onClick={() => setTeacherTab('announcements')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    teacherTab === 'announcements' ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notices</span>
                </button>
              </>
            )}

            {/* STUDENT NAVIGATION */}
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setStudentTab('portal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    studentTab === 'portal' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Dashboard & SF9</span>
                </button>

                <button
                  onClick={() => setStudentTab('messages')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    studentTab === 'messages' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Teacher Inquiries</span>
                </button>
              </>
            )}

            {/* PARENT NAVIGATION */}
            {currentRole === 'parent' && (
              <>
                <button
                  onClick={() => setParentTab('portal')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    parentTab === 'portal' ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Child Progress & SF9</span>
                </button>

                <button
                  onClick={() => setParentTab('messages')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    parentTab === 'messages' ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Teacher Messages & Consultations</span>
                </button>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* Main Role Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ADMIN VIEWS */}
        {currentRole === 'admin' && (
          <>
            {adminTab === 'dashboard' && (
              <AdminDashboard
                onNavigateToSchedules={() => setAdminTab('schedules')}
                onNavigateToGrades={() => setAdminTab('grades')}
                onNavigateToStudents={() => setAdminTab('students')}
                onNavigateToTeachers={() => setAdminTab('teachers')}
              />
            )}
            {adminTab === 'schedules' && <ScheduleManager />}
            {adminTab === 'grades' && <GradeApprovalManager />}
            {adminTab === 'students' && <StudentManager />}
            {adminTab === 'teachers' && <TeacherManager />}
            {adminTab === 'subjects' && <SubjectManager />}
            {adminTab === 'sections' && <SectionManager />}
            {adminTab === 'reports' && <ReportsManager />}
            {adminTab === 'messages' && <MessagingCenter />}
            {adminTab === 'announcements' && <AnnouncementManager />}
            {adminTab === 'audit' && <AuditTrail />}
          </>
        )}

        {/* TEACHER VIEWS */}
        {currentRole === 'teacher' && (
          <>
            {teacherTab === 'gradebook' && <TeacherGradebook />}
            {teacherTab === 'schedule' && <TeacherScheduleView />}
            {teacherTab === 'attendance' && <TeacherAttendance />}
            {teacherTab === 'messages' && <MessagingCenter />}
            {teacherTab === 'announcements' && <AnnouncementManager />}
          </>
        )}

        {/* STUDENT VIEWS */}
        {currentRole === 'student' && (
          <>
            {studentTab === 'portal' && <StudentPortalView />}
            {studentTab === 'messages' && <MessagingCenter />}
          </>
        )}

        {/* PARENT VIEWS */}
        {currentRole === 'parent' && (
          <>
            {parentTab === 'portal' && <ParentPortalView onOpenMessages={() => setParentTab('messages')} />}
            {parentTab === 'messages' && <MessagingCenter />}
          </>
        )}

      </main>

      {/* Institutional Settings Modal */}
      <SchoolProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            © 2026–2027 Sacred Heart Academy, Garchitorena, Camarines Sur • DepEd Region V (Bicol)
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGoToHomepage}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to School Website</span>
            </button>
            <span>•</span>
            <span>Contact: sacredheartacademy2@gmail.com</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

const AppRoot: React.FC = () => {
  const { setCurrentRole } = useApp();
  const [viewMode, setViewMode] = useState<'landing' | 'portal'>(() => {
    return (localStorage.getItem('sha_view_mode') as 'landing' | 'portal') || 'landing';
  });

  useEffect(() => {
    localStorage.setItem('sha_view_mode', viewMode);
  }, [viewMode]);

  const handleEnterPortal = (role?: UserRole) => {
    if (role) {
      setCurrentRole(role);
    }
    setViewMode('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToHomepage = () => {
    setViewMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'landing') {
    return (
      <SchoolHomepage onEnterPortal={handleEnterPortal} />
    );
  }

  return (
    <PortalMainContent onGoToHomepage={handleGoToHomepage} />
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <AppRoot />
    </AppContextProvider>
  );
}
