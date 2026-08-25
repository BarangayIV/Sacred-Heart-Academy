import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Users, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'admin',
}) => {
  const { 
    schoolProfile, 
    setCurrentRole, 
    teachers, 
    setActiveTeacherId, 
    students, 
    setActiveStudentId, 
    setActiveParentEmail,
    logAction 
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('admin@sha.edu.ph');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || 'tch-1');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 'std-7-01');
  const [selectedParentEmail, setSelectedParentEmail] = useState(students[0]?.parentEmail || 'maria.delacruz@gmail.com');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const roleConfigs = {
    admin: {
      label: 'Administrator',
      badge: 'Principal & Registrar',
      icon: ShieldCheck,
      color: 'bg-emerald-600',
      activeBorder: 'border-emerald-600 bg-emerald-50 text-emerald-900',
      description: 'Master schedules, grade approvals, faculty/student databases & institutional settings',
      defaultUser: 'admin@sha.edu.ph',
    },
    teacher: {
      label: 'Faculty & Teacher',
      badge: 'Grade & Class Manager',
      icon: UserCheck,
      color: 'bg-indigo-600',
      activeBorder: 'border-indigo-600 bg-indigo-50 text-indigo-900',
      description: 'DepEd Electronic Class Record grading, attendance recording & teaching timetables',
      defaultUser: 'austin.alcantara@sha.edu.ph',
    },
    student: {
      label: 'Student / Learner',
      badge: 'Grades & SF9 Card',
      icon: GraduationCap,
      color: 'bg-amber-600',
      activeBorder: 'border-amber-600 bg-amber-50 text-amber-900',
      description: 'Quarterly grades, DepEd Form 138 (SF9) progress card, class schedule & notices',
      defaultUser: '109845230001 (LRN)',
    },
    parent: {
      label: 'Parent / Guardian',
      badge: 'Learner Monitoring',
      icon: Users,
      color: 'bg-rose-600',
      activeBorder: 'border-rose-600 bg-rose-50 text-rose-900',
      description: 'Child academic progress, subject teachers directory & consultation messaging',
      defaultUser: 'maria.delacruz@gmail.com',
    },
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'admin') {
      setIdentifier('admin@sha.edu.ph');
    } else if (role === 'teacher') {
      const t = teachers.find(x => x.id === selectedTeacherId) || teachers[0];
      setIdentifier(t ? t.email : 'teacher@sha.edu.ph');
    } else if (role === 'student') {
      const s = students.find(x => x.id === selectedStudentId) || students[0];
      setIdentifier(s ? s.lrn : '109845230001');
    } else if (role === 'parent') {
      setIdentifier(selectedParentEmail || 'maria.delacruz@gmail.com');
    }
  };

  const handleQuickLogin = (role: UserRole, extraId?: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setCurrentRole(role);
      if (role === 'teacher' && extraId) {
        setActiveTeacherId(extraId);
      } else if (role === 'student' && extraId) {
        setActiveStudentId(extraId);
      } else if (role === 'parent' && extraId) {
        setActiveParentEmail(extraId);
      }

      logAction('Portal Login', 'Authentication', `Authenticated as ${roleConfigs[role].label} via Sacred Heart Academy Portal`);
      setIsLoading(false);
      onLoginSuccess(role);
      onClose();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email, username, or LRN.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setCurrentRole(selectedRole);
      if (selectedRole === 'teacher') {
        setActiveTeacherId(selectedTeacherId);
      } else if (selectedRole === 'student') {
        setActiveStudentId(selectedStudentId);
      } else if (selectedRole === 'parent') {
        setActiveParentEmail(selectedParentEmail);
      }

      logAction('Portal Login', 'Authentication', `Authenticated user ${identifier} into ${roleConfigs[selectedRole].label} portal`);
      setIsLoading(false);
      onLoginSuccess(selectedRole);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden relative">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{schoolProfile.name}</h3>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Portal Login
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                DepEd Region V • Camarines Sur • S.Y. 2026–2027
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Step 1: Select Role */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Your Access Role
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map((role) => {
                const config = roleConfigs[role];
                const isSelected = selectedRole === role;
                const Icon = config.icon;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected 
                        ? config.activeBorder + ' shadow-sm ring-2 ring-offset-1 ring-slate-800' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg ${config.color} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-tight">{config.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{config.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 mt-2.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
              <span className="font-semibold text-slate-700">Role Focus:</span>
              <span>{roleConfigs[selectedRole].description}</span>
            </p>
          </div>

          {/* Quick Demo Login Presets */}
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick 1-Click Demo Profiles ({roleConfigs[selectedRole].label})
              </span>
              <span className="text-[11px] text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                Instant Access
              </span>
            </div>

            {selectedRole === 'admin' && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1.5 transition shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sign In as Principal (Dr. Maria Consuelo Hernandez)</span>
                </button>
              </div>
            )}

            {selectedRole === 'teacher' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {teachers.slice(0, 4).map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTeacherId(t.id);
                      handleQuickLogin('teacher', t.id);
                    }}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition flex items-center gap-2.5"
                  >
                    <img src={t.photoUrl} alt={t.name} className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{t.subjects[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedRole === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {students.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedStudentId(s.id);
                      handleQuickLogin('student', s.id);
                    }}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition flex items-center gap-2.5"
                  >
                    <img src={s.avatarUrl} alt={s.fullName} className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate">{s.fullName}</div>
                      <div className="text-[10px] text-slate-500">Grade {s.gradeLevel} - {s.sectionName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedRole === 'parent' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {students.slice(0, 4).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedParentEmail(s.parentEmail);
                      handleQuickLogin('parent', s.parentEmail);
                    }}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 text-left transition flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {s.parentName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate">{s.parentName}</div>
                      <div className="text-[10px] text-slate-500 truncate">Child: {s.firstName} ({s.sectionName})</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'student' ? 'Learner Reference Number (LRN) or Username' : 'School Email / Account ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white"
                  placeholder={selectedRole === 'student' ? 'Enter 12-digit LRN' : 'name@sha.edu.ph'}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Security Password
                </label>
                <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                  Default pass: admin/teacher/student
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-slate-800 bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Persona Target selector for realistic experience */}
            {selectedRole === 'teacher' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Faculty Member Account
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-indigo-600"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.subjects.join(', ')} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Enrolled Student Account
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-amber-600"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} (LRN: {s.lrn}) — Grade {s.gradeLevel} ({s.sectionName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === 'parent' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Parent / Guardian Record
                </label>
                <select
                  value={selectedParentEmail}
                  onChange={(e) => setSelectedParentEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-rose-600"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.parentEmail}>
                      {s.parentName} ({s.parentEmail}) — Parent of {s.fullName} ({s.sectionName})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter {roleConfigs[selectedRole].label} Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Help & Contact Notice */}
          <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-200 pt-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Need assistance? Contact the registrar: <strong>sacredheartacademy2@gmail.com</strong></span>
          </div>

        </div>

      </div>
    </div>
  );
};
