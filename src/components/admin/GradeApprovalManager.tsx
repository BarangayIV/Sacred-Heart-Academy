import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Eye, 
  AlertCircle, 
  Check, 
  X, 
  MessageSquare,
  Lock,
  Globe,
  Filter,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GradeSheet, GradeStatus } from '../../types';

export const GradeApprovalManager: React.FC = () => {
  const { 
    gradeSheets, 
    approveGradeSheet, 
    returnGradeSheet, 
    publishGradeSheet,
    schoolProfile 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedGradeSheet, setSelectedGradeSheet] = useState<GradeSheet | null>(null);
  const [returnFeedback, setReturnFeedback] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [activeSheetToReturn, setActiveSheetToReturn] = useState<GradeSheet | null>(null);

  const filteredSheets = gradeSheets.filter(sheet => {
    if (statusFilter === 'All') return true;
    return sheet.status === statusFilter;
  });

  const getStatusBadge = (status: GradeStatus) => {
    switch (status) {
      case 'Draft':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">1. Draft (Encoding)</span>;
      case 'Submitted':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">2. Submitted for Review</span>;
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">3. Approved & Locked</span>;
      case 'Published':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">4. Published Live</span>;
      case 'Returned':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">Returned for Correction</span>;
      default:
        return null;
    }
  };

  const handleApprove = (id: string) => {
    approveGradeSheet(id);
    if (selectedGradeSheet?.id === id) {
      setSelectedGradeSheet(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const handlePublish = (id: string) => {
    publishGradeSheet(id);
    if (selectedGradeSheet?.id === id) {
      setSelectedGradeSheet(prev => prev ? { ...prev, status: 'Published' } : null);
    }
  };

  const handleOpenReturn = (sheet: GradeSheet) => {
    setActiveSheetToReturn(sheet);
    setReturnFeedback('');
    setShowReturnModal(true);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSheetToReturn) return;
    returnGradeSheet(activeSheetToReturn.id, returnFeedback || 'Please review and verify calculations.');
    if (selectedGradeSheet?.id === activeSheetToReturn.id) {
      setSelectedGradeSheet(prev => prev ? { ...prev, status: 'Returned', adminFeedback: returnFeedback } : null);
    }
    setShowReturnModal(false);
    setActiveSheetToReturn(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            Grade Review, Approval & Publication
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin verification pipeline: Verify teacher submissions, approve calculations, and publish to Student & Parent Portals.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs">
            {['All', 'Submitted', 'Approved', 'Published', 'Draft'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 font-semibold rounded-lg transition ${
                  statusFilter === status ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Sheets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Subject & Code</th>
                <th className="py-3.5 px-4">Grade & Section</th>
                <th className="py-3.5 px-4">Subject Teacher</th>
                <th className="py-3.5 px-4">Learners</th>
                <th className="py-3.5 px-4">Workflow Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSheets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No grade records matching the selected status filter.
                  </td>
                </tr>
              ) : (
                filteredSheets.map(sheet => (
                  <tr key={sheet.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{sheet.subjectName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{sheet.subjectCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      Grade {sheet.gradeLevel} - {sheet.sectionName}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {sheet.teacherName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {sheet.grades.length} Enrolled
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(sheet.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedGradeSheet(sheet)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {sheet.status === 'Submitted' && (
                          <>
                            <button
                              onClick={() => handleApprove(sheet.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1 shadow-xs transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleOpenReturn(sheet)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium text-xs flex items-center gap-1 border border-rose-200 transition"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Return</span>
                            </button>
                          </>
                        )}

                        {sheet.status === 'Approved' && (
                          <button
                            onClick={() => handlePublish(sheet.id)}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs flex items-center gap-1 shadow-xs transition"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </button>
                        )}

                        {sheet.status === 'Published' && (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Sheet Detail Modal */}
      {selectedGradeSheet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {selectedGradeSheet.subjectName} ({selectedGradeSheet.subjectCode})
                  </h3>
                  {getStatusBadge(selectedGradeSheet.status)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Grade {selectedGradeSheet.gradeLevel} - {selectedGradeSheet.sectionName} • Teacher: <strong>{selectedGradeSheet.teacherName}</strong> • {schoolProfile.schoolYear}
                </p>
              </div>
              <button 
                onClick={() => setSelectedGradeSheet(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin feedback warning banner if returned */}
            {selectedGradeSheet.adminFeedback && (
              <div className="my-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Administrator Feedback: </span>
                  {selectedGradeSheet.adminFeedback}
                </div>
              </div>
            )}

            {/* Student Grades Roster */}
            <div className="flex-1 overflow-y-auto py-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold uppercase text-[11px]">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">DepEd LRN</th>
                    <th className="py-2.5 px-2 text-center w-16">Q1</th>
                    <th className="py-2.5 px-2 text-center w-16">Q2</th>
                    <th className="py-2.5 px-2 text-center w-16">Q3</th>
                    <th className="py-2.5 px-2 text-center w-16">Q4</th>
                    <th className="py-2.5 px-2 text-center w-20">Final Grade</th>
                    <th className="py-2.5 px-3 text-center">Remarks</th>
                    <th className="py-2.5 px-3">Teacher Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedGradeSheet.grades.map(grade => {
                    const finalAvg = grade.finalGrade || (
                      grade.q1 && grade.q2 && grade.q3 && grade.q4 
                        ? Math.round((grade.q1 + grade.q2 + grade.q3 + grade.q4) / 4)
                        : (grade.q1 && grade.q2 ? Math.round((grade.q1 + grade.q2) / 2) : grade.q1 || 0)
                    );
                    const isPassed = finalAvg >= 75;

                    return (
                      <tr key={grade.studentId} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{grade.studentName}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{grade.lrn}</td>
                        <td className="py-2.5 px-2 text-center font-medium text-slate-800">{grade.q1 ?? '—'}</td>
                        <td className="py-2.5 px-2 text-center font-medium text-slate-800">{grade.q2 ?? '—'}</td>
                        <td className="py-2.5 px-2 text-center font-medium text-slate-800">{grade.q3 ?? '—'}</td>
                        <td className="py-2.5 px-2 text-center font-medium text-slate-800">{grade.q4 ?? '—'}</td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-900 text-sm bg-slate-50">
                          {finalAvg || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {finalAvg ? (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {isPassed ? 'Passed' : 'Failed'}
                            </span>
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 italic truncate max-w-xs">
                          {grade.teacherNotes || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                DepEd Standard Passing Mark: <strong>75.00</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedGradeSheet(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition"
                >
                  Close Window
                </button>

                {selectedGradeSheet.status === 'Submitted' && (
                  <>
                    <button
                      onClick={() => handleOpenReturn(selectedGradeSheet)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-semibold text-xs border border-rose-200 transition"
                    >
                      Return for Correction
                    </button>
                    <button
                      onClick={() => handleApprove(selectedGradeSheet.id)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Approve & Lock Sheet
                    </button>
                  </>
                )}

                {selectedGradeSheet.status === 'Approved' && (
                  <button
                    onClick={() => handlePublish(selectedGradeSheet.id)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <Globe className="w-4 h-4" />
                    Publish to Student & Parent Portals
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Return for Correction Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-rose-600" />
                Return Grades for Revision
              </h3>
              <button onClick={() => setShowReturnModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4 pt-4 text-xs">
              <p className="text-slate-600">
                Provide remarks and feedback for <strong>{activeSheetToReturn?.teacherName}</strong> regarding {activeSheetToReturn?.subjectName} ({activeSheetToReturn?.sectionName}):
              </p>

              <textarea
                value={returnFeedback}
                onChange={(e) => setReturnFeedback(e.target.value)}
                placeholder="e.g. Please verify student Christian Paul Reyes' Q1 quiz average; values seem miscalculated..."
                className="w-full h-28 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500"
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm & Return Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
