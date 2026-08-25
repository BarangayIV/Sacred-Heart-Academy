import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  BookOpen, 
  Bell, 
  RotateCcw, 
  Settings, 
  ChevronDown, 
  Building2,
  Calendar,
  Sparkles,
  Home,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenAnnouncements: () => void;
  onGoToHomepage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenAnnouncements, onGoToHomepage }) => {
  const { 
    schoolProfile, 
    currentRole, 
    setCurrentRole,
    teachers,
    activeTeacherId,
    setActiveTeacherId,
    students,
    activeStudentId,
    setActiveStudentId,
    activeParentEmail,
    setActiveParentEmail,
    announcements,
    messages,
    resetToDefaults
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);

  const activeTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0];
  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];
  const parentStudents = students.filter(s => s.parentEmail);
  const currentParentStudent = students.find(s => s.parentEmail === activeParentEmail) || students[0];

  const unreadMessagesCount = messages.filter(m => !m.isRead).length;
  const activeAnnouncementsCount = announcements.length;

  const roleDetails = {
    admin: { label: 'Administrator', desc: 'Full System Control & Approval', icon: ShieldCheck, color: 'bg-emerald-600' },
    teacher: { label: 'Faculty / Teacher', desc: 'Grade Encoding & Classes', icon: UserCheck, color: 'bg-indigo-600' },
    student: { label: 'Student Portal', desc: 'Grades, Schedule & Subjects', icon: GraduationCap, color: 'bg-amber-600' },
    parent: { label: 'Parent Portal', desc: 'Child Monitoring & Inquiries', icon: Users, color: 'bg-rose-600' },
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner with School Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          
          {/* School Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                  {schoolProfile.name}
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  {schoolProfile.schoolYear}
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 rounded-md">
                  Quarter: {schoolProfile.currentQuarter}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal truncate max-w-xs sm:max-w-md">
                {schoolProfile.address} • ID: {schoolProfile.schoolId} • {schoolProfile.division}
              </p>
            </div>
          </div>

          {/* Right Actions: Role Switcher & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Reset Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset database to S.Y. 2026–2027 factory timetable records?')) {
                  resetToDefaults();
                }
              }}
              title="Reset records to default S.Y. 2026–2027 timetable data"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Baseline</span>
            </button>

            {/* School Profile / Settings Button */}
            <button
              onClick={onOpenSettings}
              title="School Profile & Settings"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Announcements & Notices Badge */}
            <button
              onClick={onOpenAnnouncements}
              title="Announcements & Circulars"
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700"
            >
              <Bell className="w-4 h-4" />
              {(activeAnnouncementsCount > 0 || unreadMessagesCount > 0) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {activeAnnouncementsCount}
                </span>
              )}
            </button>

            {/* Public Website Button */}
            {onGoToHomepage && (
              <button
                onClick={onGoToHomepage}
                title="Return to Public School Homepage"
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white transition text-xs flex items-center gap-1.5 border border-emerald-700/50"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-medium">School Website</span>
              </button>
            )}

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <div className={`w-7 h-7 rounded-lg ${roleDetails[currentRole].color} flex items-center justify-center text-white shadow-sm`}>
                  {React.createElement(roleDetails[currentRole].icon, { className: 'w-4 h-4' })}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {roleDetails[currentRole].label}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {currentRole === 'teacher' ? activeTeacher.name.split(' ')[0] : currentRole === 'student' ? activeStudent.firstName : currentRole === 'parent' ? `${currentParentStudent.firstName}'s Parent` : 'Admin Access'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Role Dropdown Menu */}
              {showRoleMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700 mb-1">
                    Switch Active Portal Role
                  </div>
                  {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map(role => {
                    const item = roleDetails[role];
                    const isSelected = currentRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          setCurrentRole(role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center gap-3 transition ${
                          isSelected ? 'bg-slate-700/80 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                          {React.createElement(item.icon, { className: 'w-4 h-4' })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">{item.label}</div>
                          <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </button>
                    );
                  })}

                  {onGoToHomepage && (
                    <div className="pt-1 mt-1 border-t border-slate-700">
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          onGoToHomepage();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-3 text-rose-400 hover:bg-slate-700/50 hover:text-rose-300 transition text-xs font-semibold"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>Log Out / Return to Website</div>
                          <div className="text-[10px] text-slate-400 font-normal">Exit active session</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Secondary Context Bar for Role Personas */}
        {currentRole !== 'admin' && (
          <div className="py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Acting as:</span>
              
              {currentRole === 'teacher' && (
                <div className="flex items-center gap-2">
                  <select
                    value={activeTeacherId}
                    onChange={(e) => setActiveTeacherId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 font-medium"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.subjects.join(', ')}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    Faculty Loaded ({activeTeacher.subjects.length} Subjects)
                  </span>
                </div>
              )}

              {currentRole === 'student' && (
                <div className="flex items-center gap-2">
                  <select
                    value={activeStudentId}
                    onChange={(e) => setActiveStudentId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 font-medium"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} — Grade {s.gradeLevel} ({s.sectionName}) • LRN: {s.lrn}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {currentRole === 'parent' && (
                <div className="flex items-center gap-2">
                  <select
                    value={activeParentEmail}
                    onChange={(e) => setActiveParentEmail(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-rose-500 font-medium"
                  >
                    {parentStudents.map(s => (
                      <option key={s.id} value={s.parentEmail}>
                        {s.parentName} (Parent of {s.fullName} - {s.sectionName})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>Camarines Sur, Region V</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Portal Synced
              </span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
