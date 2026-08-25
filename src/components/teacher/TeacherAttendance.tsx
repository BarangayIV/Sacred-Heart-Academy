import React, { useState } from 'react';
import { 
  UserCheck, 
  Calendar, 
  Check, 
  Clock, 
  X, 
  Save, 
  Filter, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';

export const TeacherAttendance: React.FC = () => {
  const { students, sections, attendance, recordAttendance } = useApp();

  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const sectionStudents = students.filter(s => s.sectionId === selectedSectionId);

  // Local attendance state mapping studentId -> status & remarks
  const [localAttendance, setLocalAttendance] = useState<Record<string, { status: AttendanceRecord['status'], remarks: string }>>({});

  const setStudentStatus = (studentId: string, status: AttendanceRecord['status']) => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: {
        status,
        remarks: prev[studentId]?.remarks || '',
      }
    }));
  };

  const setStudentRemarks = (studentId: string, remarks: string) => {
    setLocalAttendance(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || 'Present',
        remarks,
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceRecord['status'], remarks: string }> = {};
    sectionStudents.forEach(s => {
      updated[s.id] = { status: 'Present', remarks: '' };
    });
    setLocalAttendance(updated);
  };

  const handleSaveAttendance = () => {
    const records: Omit<AttendanceRecord, 'id'>[] = sectionStudents.map(s => ({
      studentId: s.id,
      studentName: s.fullName,
      sectionId: selectedSectionId,
      date: selectedDate,
      status: localAttendance[s.id]?.status || 'Present',
      remarks: localAttendance[s.id]?.remarks || undefined,
    }));

    recordAttendance(records);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Homeroom Daily Attendance Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record and monitor learner daily attendance for DepEd School Form 2 (SF2).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedFeedback && (
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Attendance Saved!
            </span>
          )}
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Section:</span>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>
                  Grade {s.gradeLevel} - {s.name} ({s.adviserName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold"
            />
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Learners in Section: <strong>{sectionStudents.length}</strong>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase">
                <th className="py-3 px-4 w-12">No.</th>
                <th className="py-3 px-4">Learner Name</th>
                <th className="py-3 px-4">LRN</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Remarks / Excuse Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sectionStudents.map((student, idx) => {
                const currentStatus = localAttendance[student.id]?.status || 'Present';
                const currentRemarks = localAttendance[student.id]?.remarks || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <img 
                          src={student.avatarUrl} 
                          alt="" 
                          className="w-6 h-6 rounded-full object-cover border border-slate-200" 
                        />
                        <span>{student.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{student.lrn}</td>
                    
                    {/* Status Buttons */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                        <button
                          onClick={() => setStudentStatus(student.id, 'Present')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'Present' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => setStudentStatus(student.id, 'Late')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'Late' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          onClick={() => setStudentStatus(student.id, 'Absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'Absent' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => setStudentStatus(student.id, 'Excused')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'Excused' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>

                    {/* Remarks Input */}
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={currentRemarks}
                        onChange={(e) => setStudentRemarks(student.id, e.target.value)}
                        placeholder="e.g. Medical certificate provided"
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs focus:ring-2 focus:ring-emerald-500"
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
