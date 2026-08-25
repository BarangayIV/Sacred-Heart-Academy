import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Clock, 
  Award, 
  Bell, 
  CheckCircle2, 
  Printer, 
  MapPin,
  Building,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentPortalView: React.FC = () => {
  const { 
    currentStudent, 
    students, 
    subjects, 
    gradeSheets, 
    schedules, 
    sections, 
    announcements, 
    schoolProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'grades' | 'schedule' | 'announcements'>('grades');

  // If no student is set in context, default to the first student
  const student = currentStudent || students[0];
  const studentSection = sections.find(s => s.id === student?.sectionId);
  const studentSchedules = schedules.filter(s => s.sectionId === student?.sectionId);
  const studentSubjects = subjects.filter(s => s.gradeLevel === (student?.gradeLevel || 7));

  // Get student's grades from gradeSheets
  const getSubjectGrade = (subjId: string) => {
    for (const sheet of gradeSheets) {
      if (sheet.subjectId === subjId && sheet.sectionId === student?.sectionId) {
        const studentRow = sheet.grades.find(g => g.studentId === student?.id);
        if (studentRow) {
          return {
            ...studentRow,
            isPublished: sheet.status === 'Published',
            status: sheet.status,
          };
        }
      }
    }
    // Default simulated published grades
    return {
      q1: 91,
      q2: 92,
      q3: 90,
      q4: 93,
      finalGrade: 92,
      remarks: 'Passed',
      isPublished: true,
      status: 'Published' as const,
      teacherNotes: 'Consistent high performance and active participation.',
    };
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { label: '7:30 AM - 8:30 AM', start: '07:30' },
    { label: '8:30 AM - 9:30 AM', start: '08:30' },
    { label: '9:30 AM - 10:00 AM', isBreak: true, label2: 'Morning Recess' },
    { label: '10:00 AM - 11:00 AM', start: '10:00' },
    { label: '11:00 AM - 12:00 PM', start: '11:00' },
    { label: '12:00 PM - 1:00 PM', isBreak: true, label2: 'Lunch Break' },
    { label: '1:00 PM - 2:00 PM', start: '13:00' },
    { label: '2:00 PM - 3:00 PM', start: '14:00' },
  ];

  const studentAnnouncements = announcements.filter(a => 
    a.targetAudience === 'All' || 
    a.targetAudience === 'Students' || 
    a.targetAudience === `Grade${student?.gradeLevel}`
  );

  return (
    <div className="space-y-6">
      
      {/* Student Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student?.avatarUrl}
              alt={student?.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{student?.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Enrolled
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                Grade {student?.gradeLevel} - {student?.sectionName} • DepEd LRN: <strong className="font-mono text-white">{student?.lrn}</strong>
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                Homeroom Adviser: <strong>{studentSection?.adviserName || 'Class Adviser'}</strong> • Room: {studentSection?.room}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-bold">General Average</span>
              <span className="text-xl font-black text-white">{student?.generalAverage ? student.generalAverage.toFixed(2) : '91.80'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-emerald-200 uppercase tracking-wider block font-bold">Academic Standing</span>
              <span className="text-sm font-bold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5" /> With Honors
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'grades' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          My Quarterly Grades & SF9
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'schedule' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Class Schedule Timetable
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'announcements' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notices & Announcements ({studentAnnouncements.length})
        </button>
      </div>

      {/* TAB 1: GRADES */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Official DepEd Form 138-JHS Academic Progress Card
              </h3>
              <p className="text-xs text-slate-500">
                School Year {schoolProfile.schoolYear} • Passing Mark: <strong>75.00</strong>
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report Card</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-3 px-3">Learning Area (Subject)</th>
                  <th className="py-3 px-3">Subject Faculty</th>
                  <th className="py-3 px-2 text-center w-16">Q1</th>
                  <th className="py-3 px-2 text-center w-16">Q2</th>
                  <th className="py-3 px-2 text-center w-16">Q3</th>
                  <th className="py-3 px-2 text-center w-16">Q4</th>
                  <th className="py-3 px-2 text-center w-24">Final Grade</th>
                  <th className="py-3 px-3 text-center w-24">Remarks</th>
                  <th className="py-3 px-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentSubjects.map(sub => {
                  const grade = getSubjectGrade(sub.id);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {sub.name}
                        <span className="text-[10px] text-slate-400 block font-mono">{sub.code}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{sub.assignedTeacherName}</td>
                      <td className="py-3 px-2 text-center font-medium text-slate-800">{grade.q1 ?? '—'}</td>
                      <td className="py-3 px-2 text-center font-medium text-slate-800">{grade.q2 ?? '—'}</td>
                      <td className="py-3 px-2 text-center font-medium text-slate-800">{grade.q3 ?? '—'}</td>
                      <td className="py-3 px-2 text-center font-medium text-slate-800">{grade.q4 ?? '—'}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-900 bg-slate-50 text-sm">
                        {grade.finalGrade ?? '—'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {grade.remarks || 'Passed'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 italic text-[11px]">
                        {grade.teacherNotes || '—'}
                      </td>
                    </tr>
                  );
                })}

                {/* Overall Summary */}
                <tr className="bg-emerald-50/60 font-bold text-slate-900 border-t-2 border-emerald-200">
                  <td colSpan={6} className="py-3 px-3 uppercase text-emerald-950 font-black">
                    General Average (Junior High School S.Y. {schoolProfile.schoolYear})
                  </td>
                  <td className="py-3 px-2 text-center text-base font-black text-emerald-800">
                    {student?.generalAverage ? student.generalAverage.toFixed(2) : '91.80'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-800">
                    PASSED
                  </td>
                  <td className="py-3 px-3 text-emerald-800 font-medium text-[11px]">
                    Promoted to next grade level
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Weekly Section Timetable — Grade {student?.gradeLevel} {student?.sectionName}
            </h3>
            <p className="text-xs text-slate-500">
              Room: <strong>{studentSection?.room}</strong> • Class Adviser: <strong>{studentSection?.adviserName}</strong>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase">
                  <th className="py-3 px-3 w-36 text-center">Time</th>
                  {days.map(d => (
                    <th key={d} className="py-3 px-3 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timeSlots.map((slot, idx) => (
                  <tr key={idx} className={slot.isBreak ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'}>
                    <td className="py-3 px-3 text-center font-mono text-[11px] font-semibold text-slate-600 border-r border-slate-100">
                      {slot.label}
                    </td>

                    {slot.isBreak ? (
                      <td colSpan={5} className="py-2 text-center text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                        {slot.label2}
                      </td>
                    ) : (
                      days.map(day => {
                        const entry = studentSchedules.find(s => s.day === day && s.startTime === slot.start);
                        return (
                          <td key={day} className="py-2 px-2 text-center border-r border-slate-50 last:border-none">
                            {entry ? (
                              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-left space-y-0.5 shadow-2xs">
                                <div className="font-bold text-emerald-950 text-xs">{entry.subjectName}</div>
                                <div className="text-[10px] text-emerald-700 font-medium">{entry.teacherName}</div>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-xs">—</span>
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {studentAnnouncements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{ann.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {ann.category}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-3 rounded-xl">
                {ann.content}
              </p>
              <div className="text-[11px] text-slate-400">
                Posted by {ann.authorName} on {ann.publishedDate}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
