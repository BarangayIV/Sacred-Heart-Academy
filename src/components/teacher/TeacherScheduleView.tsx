import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Building, 
  AlertCircle, 
  Printer, 
  UserCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TeacherScheduleView: React.FC = () => {
  const { currentTeacher, teachers, schedules, sections } = useApp();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    currentTeacher?.id || teachers[0]?.id || ''
  );

  const activeTeacher = teachers.find(t => t.id === selectedTeacherId) || currentTeacher || teachers[0];
  const teacherSchedules = schedules.filter(s => s.teacherId === activeTeacher?.id);
  const advisorySection = sections.find(s => s.id === activeTeacher?.adviserOfSectionId);

  const timeSlots = [
    { label: '7:30 AM - 8:30 AM', start: '07:30', end: '08:30' },
    { label: '8:30 AM - 9:30 AM', start: '08:30', end: '09:30' },
    { label: '9:30 AM - 10:00 AM (RECESS)', start: '09:30', end: '10:00', isBreak: true },
    { label: '10:00 AM - 11:00 AM', start: '10:00', end: '11:00' },
    { label: '11:00 AM - 12:00 PM', start: '11:00', end: '12:00' },
    { label: '12:00 PM - 1:00 PM (LUNCH BREAK)', start: '12:00', end: '13:00', isBreak: true },
    { label: '1:00 PM - 2:00 PM', start: '13:00', end: '14:00' },
    { label: '2:00 PM - 3:00 PM', start: '14:00', end: '15:00' },
    { label: '3:00 PM - 4:00 PM', start: '15:00', end: '16:00' },
    { label: '4:00 PM - 5:00 PM', start: '16:00', end: '17:00' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSlot = (day: string, startTime: string) => {
    return teacherSchedules.find(s => s.day === day && s.startTime === startTime);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Faculty Teaching Schedule & Room Assignment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official transcribed timetable for <strong>{activeTeacher?.name}</strong> • S.Y. 2026–2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Teacher switcher if needed */}
          <select
            value={activeTeacher?.id}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold shadow-2xs"
          >
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Teacher Summary Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={activeTeacher?.photoUrl}
            alt={activeTeacher?.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
          />
          <div>
            <h3 className="font-bold text-slate-900 text-base">{activeTeacher?.name}</h3>
            <p className="text-xs text-indigo-700 font-medium">{activeTeacher?.specialization}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Subjects</span>
            <span className="font-bold text-slate-800">{activeTeacher?.subjects.join(', ')}</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Teaching Slots</span>
            <span className="font-bold text-indigo-700">{teacherSchedules.length} class periods / week</span>
          </div>

          {advisorySection && (
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-amber-800 block text-[10px] uppercase font-bold">Advisory Section</span>
              <span className="font-bold text-amber-950">Grade {advisorySection.gradeLevel} - {advisorySection.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Handwritten Timetable Note if present */}
      {activeTeacher?.notes && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Timetable Document Remark: </span>
            {activeTeacher.notes}
          </div>
        </div>
      )}

      {/* Weekly Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase">
                <th className="py-3 px-3 w-40 text-center">Time Slot</th>
                {days.map(d => (
                  <th key={d} className="py-3 px-3 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeSlots.map((slot, idx) => (
                <tr key={idx} className={slot.isBreak ? 'bg-slate-50/70' : 'hover:bg-slate-50/30'}>
                  
                  {/* Time label */}
                  <td className="py-3 px-3 text-center font-mono text-[11px] font-semibold text-slate-600 border-r border-slate-100">
                    {slot.label}
                  </td>

                  {slot.isBreak ? (
                    <td colSpan={5} className="py-2 text-center text-slate-400 font-semibold text-[11px] tracking-wider uppercase">
                      {slot.label.includes('RECESS') ? 'Morning Recess' : 'Lunch Break & Faculty Rest'}
                    </td>
                  ) : (
                    days.map(day => {
                      const entry = getSlot(day, slot.start);
                      return (
                        <td key={day} className="py-2 px-2 text-center border-r border-slate-50 last:border-none">
                          {entry ? (
                            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-left space-y-1 shadow-2xs">
                              <div className="font-bold text-xs leading-tight text-indigo-900">{entry.subjectName}</div>
                              <div className="text-[11px] font-semibold text-emerald-800">
                                Gr {entry.gradeLevel} - {entry.sectionName}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Building className="w-3 h-3 text-slate-400" />
                                <span>{entry.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-14 flex items-center justify-center text-slate-300 text-[11px]">
                              —
                            </div>
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

    </div>
  );
};
