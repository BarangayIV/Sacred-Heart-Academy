import React from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Layers, 
  Calendar, 
  FileCheck2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { 
    schoolProfile, 
    teachers, 
    sections, 
    students, 
    schedules, 
    gradeSheets, 
    announcements,
    auditLogs 
  } = useApp();

  const enrolledStudents = students.filter(s => s.enrollmentStatus === 'Enrolled');
  const pendingApprovals = gradeSheets.filter(g => g.status === 'Submitted');
  const publishedGrades = gradeSheets.filter(g => g.status === 'Published');
  const draftGrades = gradeSheets.filter(g => g.status === 'Draft');

  // Stats calculation
  const totalClassesScheduled = schedules.length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Administrative Command Center • {schoolProfile.schoolYear}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {schoolProfile.name}
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Monitoring {teachers.length} Faculty Members, {sections.length} Active Grade 7–10 Sections, and {enrolledStudents.length} Learners in Garchitorena, Camarines Sur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('grade-approvals')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Review Grades ({pendingApprovals.length} Pending)</span>
            </button>
            <button
              onClick={() => onNavigateTab('schedules')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs sm:text-sm border border-slate-600 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Master Timetable</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Grade 7–10
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{enrolledStudents.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Enrolled Learners</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

        {/* Teachers */}
        <div 
          onClick={() => onNavigateTab('teachers')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              100% Active
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{teachers.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Faculty Teachers</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div 
          onClick={() => onNavigateTab('sections')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              4 Grade Levels
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{sections.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Grade Sections</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

        {/* Grade Sheets Pending */}
        <div 
          onClick={() => onNavigateTab('grade-approvals')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
              <FileCheck2 className="w-6 h-6" />
            </div>
            {pendingApprovals.length > 0 ? (
              <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md animate-pulse">
                Action Needed
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Up to Date
              </span>
            )}
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{pendingApprovals.length}</div>
            <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
              <span>Pending Approvals</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Two-Column Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Grade Workflow & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Grade Management & Workflow Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  DepEd Grade Verification & Release Cycle
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-stage approval pipeline: Teacher Encodes → Save Draft → Submit → Admin Review → Publish
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('grade-approvals')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View Pipeline <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Workflow steps visualization */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">1. Drafts</div>
                <div className="text-xl font-bold text-slate-800 mt-1">{draftGrades.length}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Being encoded by faculty</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">2. Submitted</div>
                <div className="text-xl font-bold text-amber-800 mt-1">{pendingApprovals.length}</div>
                <div className="text-[11px] text-amber-700 mt-0.5">Awaiting Admin Sign-off</div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">3. Approved</div>
                <div className="text-xl font-bold text-indigo-800 mt-1">
                  {gradeSheets.filter(g => g.status === 'Approved').length}
                </div>
                <div className="text-[11px] text-indigo-700 mt-0.5">Verified & Locked</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">4. Published</div>
                <div className="text-xl font-bold text-emerald-800 mt-1">{publishedGrades.length}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Live to Students & Parents</div>
              </div>

            </div>

            {/* Pending List if any */}
            {pendingApprovals.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2.5">
                  Recent Submissions Requiring Admin Review:
                </div>
                <div className="space-y-2">
                  {pendingApprovals.map(sheet => (
                    <div 
                      key={sheet.id}
                      className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{sheet.subjectName}</span>
                        <span className="text-slate-500 mx-1.5">•</span>
                        <span className="text-slate-700 font-medium">Grade {sheet.gradeLevel} ({sheet.sectionName})</span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Submitted by {sheet.teacherName} on {sheet.submissionDate || 'Recently'}
                        </div>
                      </div>
                      <button
                        onClick={() => onNavigateTab('grade-approvals')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-xs shadow-xs"
                      >
                        Review Sheet
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            
            <button
              onClick={() => onNavigateTab('students')}
              className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:bg-emerald-50/30 text-left transition group shadow-xs"
            >
              <GraduationCap className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition" />
              <div className="font-semibold text-slate-900 text-xs">Student Master Records</div>
              <div className="text-[11px] text-slate-500 mt-0.5">LRN database & enrollment</div>
            </button>

            <button
              onClick={() => onNavigateTab('schedules')}
              className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 text-left transition group shadow-xs"
            >
              <Calendar className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition" />
              <div className="font-semibold text-slate-900 text-xs">Schedule & Conflict Check</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Room, teacher & section slots</div>
            </button>

            <button
              onClick={() => onNavigateTab('reports')}
              className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/30 text-left transition group shadow-xs"
            >
              <BookOpen className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition" />
              <div className="font-semibold text-slate-900 text-xs">DepEd SF9 / Form 138</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Official report card printouts</div>
            </button>

          </div>

        </div>

        {/* Right Col: School Identity & Audit Log Feed */}
        <div className="space-y-6">
          
          {/* Institutional Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">School Institutional Profile</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">School ID:</span>
                <span className="font-semibold text-slate-800">{schoolProfile.schoolId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Division:</span>
                <span className="font-medium text-slate-800">{schoolProfile.division}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Region:</span>
                <span className="font-medium text-slate-800">{schoolProfile.region}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">School Head:</span>
                <span className="font-medium text-slate-800">{schoolProfile.principalName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Academic Term:</span>
                <span className="font-semibold text-emerald-700">{schoolProfile.schoolYear} ({schoolProfile.currentQuarter})</span>
              </div>
            </div>
          </div>

          {/* Real-time System Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Live System Audit Trail
              </h3>
              <button
                onClick={() => onNavigateTab('audit-trail')}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Full Log
              </button>
            </div>
            
            <div className="space-y-3">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-medium text-slate-700">{log.action}</span>
                    <span>{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  </div>
                  <div className="text-slate-600 line-clamp-2">{log.details}</div>
                  <div className="text-[10px] text-slate-400 mt-1">By: {log.userName}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
