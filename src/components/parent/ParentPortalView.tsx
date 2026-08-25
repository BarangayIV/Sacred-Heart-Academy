import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Award, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Phone, 
  Mail,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ParentPortalViewProps {
  onOpenMessages?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({ onOpenMessages }) => {
  const { 
    currentStudent, 
    students, 
    teachers, 
    subjects, 
    gradeSheets, 
    sections, 
    announcements, 
    schoolProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'grades' | 'teachers' | 'announcements'>('grades');
  const [showPtcModal, setShowPtcModal] = useState(false);
  const [ptcTeacherId, setPtcTeacherId] = useState('');
  const [ptcTopic, setPtcTopic] = useState('');
  const [ptcFeedback, setPtcFeedback] = useState<string | null>(null);

  // Student linked to this parent
  const student = currentStudent || students[0];
  const studentSection = sections.find(s => s.id === student?.sectionId);
  const studentSubjects = subjects.filter(s => s.gradeLevel === (student?.gradeLevel || 7));

  // Get subject grades
  const getSubjectGrade = (subjId: string) => {
    for (const sheet of gradeSheets) {
      if (sheet.subjectId === subjId && sheet.sectionId === student?.sectionId) {
        const studentRow = sheet.grades.find(g => g.studentId === student?.id);
        if (studentRow) {
          return studentRow;
        }
      }
    }
    return {
      q1: 91,
      q2: 92,
      q3: 90,
      q4: 93,
      finalGrade: 92,
      remarks: 'Passed' as const,
      teacherNotes: 'Excellent work and disciplined study habits.',
    };
  };

  const parentAnnouncements = announcements.filter(a => 
    a.targetAudience === 'All' || 
    a.targetAudience === 'Parents'
  );

  const handleRequestPtc = (e: React.FormEvent) => {
    e.preventDefault();
    setPtcFeedback('Your consultation request has been sent to the faculty adviser. They will reply with a confirmed time slot.');
    setTimeout(() => {
      setPtcFeedback(null);
      setShowPtcModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Parent Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={student?.avatarUrl}
              alt={student?.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{student?.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30">
                  Child Record
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                Parent / Guardian: <strong>{student?.parentName}</strong> ({student?.parentRelationship}) • Contact: {student?.parentPhone}
              </p>
              <p className="text-[11px] text-indigo-300/80 mt-0.5">
                Grade {student?.gradeLevel} - {student?.sectionName} • DepEd LRN: <strong className="font-mono text-white">{student?.lrn}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <span className="text-[10px] text-indigo-200 uppercase tracking-wider block font-bold">General Average</span>
              <span className="text-xl font-black text-white">{student?.generalAverage ? student.generalAverage.toFixed(2) : '91.80'}</span>
            </div>
            <button
              onClick={() => setShowPtcModal(true)}
              className="px-4 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Request Teacher Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'grades' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Academic Progress (Form 138)
        </button>
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'teachers' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Subject Teachers & Advisers
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'announcements' ? 'bg-white text-indigo-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Parent Circulars & Notices ({parentAnnouncements.length})
        </button>
      </div>

      {/* TAB 1: ACADEMIC PROGRESS */}
      {activeTab === 'grades' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Learner Official Grades (S.Y. {schoolProfile.schoolYear})
              </h3>
              <p className="text-xs text-slate-500">
                Verified and Approved by Sacred Heart Academy Administration
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Card</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Teacher</th>
                  <th className="py-3 px-2 text-center w-16">Q1</th>
                  <th className="py-3 px-2 text-center w-16">Q2</th>
                  <th className="py-3 px-2 text-center w-16">Q3</th>
                  <th className="py-3 px-2 text-center w-16">Q4</th>
                  <th className="py-3 px-2 text-center w-24">Final Grade</th>
                  <th className="py-3 px-3 text-center w-24">Remarks</th>
                  <th className="py-3 px-3">Teacher Feedback</th>
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
                      <td className="py-3 px-3 text-slate-700 font-medium">{sub.assignedTeacherName}</td>
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
                      <td className="py-3 px-3 text-slate-600 italic text-[11px]">
                        {grade.teacherNotes || 'Consistently attentive.'}
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-indigo-50/60 font-bold text-slate-900 border-t-2 border-indigo-200">
                  <td colSpan={6} className="py-3 px-3 uppercase text-indigo-950 font-black">
                    General Average
                  </td>
                  <td className="py-3 px-2 text-center text-base font-black text-indigo-900">
                    {student?.generalAverage ? student.generalAverage.toFixed(2) : '91.80'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-indigo-900">
                    PASSED
                  </td>
                  <td className="py-3 px-3 text-indigo-900 font-medium text-[11px]">
                    Academic Excellence (With Honors)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TEACHERS & DIRECT CONTACT */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentSubjects.map(sub => {
            const teacher = teachers.find(t => t.id === sub.assignedTeacherId) || teachers[0];
            return (
              <div 
                key={sub.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img 
                      src={teacher?.photoUrl} 
                      alt="" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{teacher?.name}</h4>
                      <p className="text-xs text-indigo-700 font-semibold">{sub.name}</p>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{teacher?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher?.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={onOpenMessages}
                    className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-indigo-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message to Teacher</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {parentAnnouncements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{ann.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
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

      {/* PTC Request Modal */}
      {showPtcModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Request Parent-Teacher Conference (PTC)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Schedule a 1-on-1 meeting with your child's teachers or homeroom adviser.
            </p>

            {ptcFeedback && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {ptcFeedback}
              </div>
            )}

            <form onSubmit={handleRequestPtc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Select Faculty</label>
                <select
                  value={ptcTeacherId}
                  onChange={(e) => setPtcTeacherId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                >
                  <option value="">Choose Subject Teacher or Adviser</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.subjects[0]})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Preferred Consultation Topic</label>
                <textarea
                  value={ptcTopic}
                  onChange={(e) => setPtcTopic(e.target.value)}
                  placeholder="e.g. Discussing Christian's performance in Mathematics and upcoming 2nd quarter exam preparations..."
                  className="w-full h-24 p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPtcModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Submit PTC Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
