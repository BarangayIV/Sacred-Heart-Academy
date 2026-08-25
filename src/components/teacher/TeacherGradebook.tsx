import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Save, 
  Send, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Calculator,
  User,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GradeSheet, GradeStatus } from '../../types';

export const TeacherGradebook: React.FC = () => {
  const { 
    currentTeacher, 
    teachers,
    gradeSheets, 
    updateGradeSheet, 
    submitGradeSheetForApproval,
    schoolProfile 
  } = useApp();

  // Find all grade sheets assigned to current teacher (or all if admin)
  const teacherSheets = gradeSheets.filter(sheet => 
    !currentTeacher || sheet.teacherId === currentTeacher.id
  );

  const [selectedSheetId, setSelectedSheetId] = useState<string>(
    teacherSheets[0]?.id || gradeSheets[0]?.id || ''
  );

  const currentSheet = gradeSheets.find(s => s.id === selectedSheetId) || teacherSheets[0] || gradeSheets[0];

  // Local state for editing grades
  const [editableGrades, setEditableGrades] = useState(currentSheet ? currentSheet.grades : []);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (currentSheet) {
      setEditableGrades(currentSheet.grades);
    }
  }, [currentSheet]);

  if (!currentSheet) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
        No grade sheets found for this faculty member.
      </div>
    );
  }

  const isLocked = currentSheet.status === 'Submitted' || currentSheet.status === 'Approved' || currentSheet.status === 'Published';

  const handleGradeChange = (studentId: string, field: 'q1' | 'q2' | 'q3' | 'q4' | 'teacherNotes', value: any) => {
    if (isLocked) return;

    setEditableGrades(prev => prev.map(g => {
      if (g.studentId !== studentId) return g;

      const updated = { ...g, [field]: field === 'teacherNotes' ? value : (value === '' ? undefined : Number(value)) };
      
      // Auto-compute final grade and remarks
      const scores = [updated.q1, updated.q2, updated.q3, updated.q4].filter((n): n is number => typeof n === 'number' && !isNaN(n));
      if (scores.length > 0) {
        const sum = scores.reduce((a, b) => a + b, 0);
        const avg = Math.round(sum / scores.length);
        updated.finalGrade = avg;
        updated.remarks = avg >= 75 ? 'Passed' : 'Failed';
      }

      return updated;
    }));
  };

  const handleSaveDraft = () => {
    updateGradeSheet({
      ...currentSheet,
      grades: editableGrades,
      status: 'Draft',
    });
    setSaveFeedback('Draft saved successfully to local records.');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const handleSubmitForReview = () => {
    if (window.confirm('Submit this Grade Sheet to Administration for formal review and locking? You will not be able to edit scores while under review.')) {
      updateGradeSheet({
        ...currentSheet,
        grades: editableGrades,
      });
      submitGradeSheetForApproval(currentSheet.id);
      setSaveFeedback('Submitted to Principal & Administration for approval.');
      setTimeout(() => setSaveFeedback(null), 4000);
    }
  };

  const getDescriptor = (grade?: number) => {
    if (!grade) return '—';
    if (grade >= 90) return 'Outstanding (O)';
    if (grade >= 85) return 'Very Satisfactory (VS)';
    if (grade >= 80) return 'Satisfactory (S)';
    if (grade >= 75) return 'Fairly Satisfactory (FS)';
    return 'Did Not Meet Expectations (DNM)';
  };

  const getStatusBadge = (status: GradeStatus) => {
    switch (status) {
      case 'Draft':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">1. Draft (Editing Allowed)</span>;
      case 'Submitted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">2. Submitted for Review (Locked)</span>;
      case 'Approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">3. Approved by Admin</span>;
      case 'Published':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">4. Published to Portals</span>;
      case 'Returned':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Needs Correction</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            Electronic Class Record & Gradebook (DepEd ECR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quarterly assessment encoding for <strong>{currentTeacher?.name || 'Faculty Member'}</strong> • {schoolProfile.schoolYear}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {saveFeedback && (
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
              {saveFeedback}
            </span>
          )}

          {!isLocked && (
            <>
              <button
                onClick={handleSaveDraft}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={handleSubmitForReview}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit to Admin</span>
              </button>
            </>
          )}

          {isLocked && (
            <div className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Sheet is Locked</span>
            </div>
          )}
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Select Subject & Section:</span>
          <select
            value={currentSheet.id}
            onChange={(e) => setSelectedSheetId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
          >
            {gradeSheets.map(s => (
              <option key={s.id} value={s.id}>
                {s.subjectName} ({s.subjectCode}) — Gr {s.gradeLevel} {s.sectionName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(currentSheet.status)}
        </div>
      </div>

      {/* Return Feedback Alert */}
      {currentSheet.status === 'Returned' && currentSheet.adminFeedback && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-rose-950">Revision Requested by Administrator:</div>
            <div className="mt-0.5">{currentSheet.adminFeedback}</div>
            <div className="text-[11px] text-rose-700 mt-1 font-medium">Please correct the highlighted scores below and re-submit.</div>
          </div>
        </div>
      )}

      {/* Grade Encoding Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Learner Grading Roster ({editableGrades.length} Students)
          </div>
          <div className="text-xs text-slate-500">
            Passing Threshold: <strong>75.00</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-700 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4 w-12">No.</th>
                <th className="py-3 px-4">Learner Full Name</th>
                <th className="py-3 px-4">LRN</th>
                <th className="py-3 px-2 text-center w-20">Q1</th>
                <th className="py-3 px-2 text-center w-20">Q2</th>
                <th className="py-3 px-2 text-center w-20">Q3</th>
                <th className="py-3 px-2 text-center w-20">Q4</th>
                <th className="py-3 px-2 text-center w-24">Final Rating</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-4">Teacher Observation Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {editableGrades.map((grade, idx) => {
                const finalAvg = grade.finalGrade || (
                  grade.q1 && grade.q2 && grade.q3 && grade.q4 
                    ? Math.round((grade.q1 + grade.q2 + grade.q3 + grade.q4) / 4)
                    : (grade.q1 && grade.q2 ? Math.round((grade.q1 + grade.q2) / 2) : grade.q1 || 0)
                );
                const isPassed = finalAvg >= 75;

                return (
                  <tr key={grade.studentId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{grade.studentName}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{grade.lrn}</td>
                    
                    {/* Q1 Input */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="number"
                        min={60}
                        max={100}
                        disabled={isLocked}
                        value={grade.q1 ?? ''}
                        onChange={(e) => handleGradeChange(grade.studentId, 'q1', e.target.value)}
                        className="w-16 p-1.5 text-center bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                        placeholder="—"
                      />
                    </td>

                    {/* Q2 Input */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="number"
                        min={60}
                        max={100}
                        disabled={isLocked}
                        value={grade.q2 ?? ''}
                        onChange={(e) => handleGradeChange(grade.studentId, 'q2', e.target.value)}
                        className="w-16 p-1.5 text-center bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                        placeholder="—"
                      />
                    </td>

                    {/* Q3 Input */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="number"
                        min={60}
                        max={100}
                        disabled={isLocked}
                        value={grade.q3 ?? ''}
                        onChange={(e) => handleGradeChange(grade.studentId, 'q3', e.target.value)}
                        className="w-16 p-1.5 text-center bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                        placeholder="—"
                      />
                    </td>

                    {/* Q4 Input */}
                    <td className="py-2 px-1 text-center">
                      <input
                        type="number"
                        min={60}
                        max={100}
                        disabled={isLocked}
                        value={grade.q4 ?? ''}
                        onChange={(e) => handleGradeChange(grade.studentId, 'q4', e.target.value)}
                        className="w-16 p-1.5 text-center bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-600"
                        placeholder="—"
                      />
                    </td>

                    {/* Final Grade Calculated */}
                    <td className="py-3 px-2 text-center font-bold text-slate-900 bg-slate-50 text-sm">
                      {finalAvg || '—'}
                    </td>

                    {/* Remarks */}
                    <td className="py-3 px-3 text-center">
                      {finalAvg ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {isPassed ? 'Passed' : 'Failed'}
                        </span>
                      ) : (
                        <span className="text-slate-400">Incomplete</span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        disabled={isLocked}
                        value={grade.teacherNotes || ''}
                        onChange={(e) => handleGradeChange(grade.studentId, 'teacherNotes', e.target.value)}
                        placeholder="e.g. Active participant in class discussions"
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 disabled:bg-transparent disabled:border-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
