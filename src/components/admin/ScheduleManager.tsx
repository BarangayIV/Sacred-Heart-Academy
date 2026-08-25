import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  User, 
  Building, 
  Filter,
  Download,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleSlot, DayOfWeek, ScheduleConflict } from '../../types';

export const ScheduleManager: React.FC = () => {
  const { 
    schedules, 
    teachers, 
    subjects, 
    sections, 
    addScheduleSlot, 
    updateScheduleSlot, 
    deleteScheduleSlot,
    checkScheduleConflicts 
  } = useApp();

  const [viewMode, setViewMode] = useState<'section' | 'teacher' | 'room'>('section');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [selectedRoom, setSelectedRoom] = useState<string>('Bldg A - Room 101');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  
  // Form State
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('08:30');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [sectionId, setSectionId] = useState(sections[0]?.id || '');
  const [room, setRoom] = useState('Bldg A - Room 101');
  const [formConflicts, setFormConflicts] = useState<ScheduleConflict[]>([]);

  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { start: '07:30', end: '08:30', label: '7:30 AM - 8:30 AM (Period 1)' },
    { start: '08:30', end: '09:30', label: '8:30 AM - 9:30 AM (Period 2)' },
    { start: '09:30', end: '10:00', label: '9:30 AM - 10:00 AM (Recess / Break)', isBreak: true },
    { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM (Period 3)' },
    { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM (Period 4)' },
    { start: '12:00', end: '13:00', label: '12:00 PM - 1:00 PM (Lunch Break)', isBreak: true },
    { start: '13:00', end: '14:00', label: '1:00 PM - 2:00 PM (Period 5)' },
    { start: '14:00', end: '15:00', label: '2:00 PM - 3:00 PM (Period 6)' },
    { start: '15:00', end: '16:00', label: '3:00 PM - 4:00 PM (Period 7)' },
  ];

  // Distinct rooms for selection
  const allRooms = Array.from(new Set(sections.map(s => s.room))).filter(Boolean);

  // Filter schedules based on active view mode
  const filteredSchedules = useMemo(() => {
    if (viewMode === 'section') {
      return schedules.filter(s => s.sectionId === selectedSectionId);
    } else if (viewMode === 'teacher') {
      return schedules.filter(s => s.teacherId === selectedTeacherId);
    } else {
      return schedules.filter(s => s.room.trim().toLowerCase() === selectedRoom.trim().toLowerCase());
    }
  }, [schedules, viewMode, selectedSectionId, selectedTeacherId, selectedRoom]);

  // Check all existing global conflicts
  const globalConflicts = useMemo(() => {
    const conflicts: { slot: ScheduleSlot; issues: ScheduleConflict[] }[] = [];
    schedules.forEach(slot => {
      const issues = checkScheduleConflicts(slot, slot.id);
      if (issues.length > 0) {
        conflicts.push({ slot, issues });
      }
    });
    return conflicts;
  }, [schedules, checkScheduleConflicts]);

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setDay('Monday');
    setStartTime('07:30');
    setEndTime('08:30');
    const defaultSec = sections.find(s => s.id === selectedSectionId) || sections[0];
    setSectionId(defaultSec?.id || '');
    setRoom(defaultSec?.room || 'Bldg A - Room 101');
    const defaultSubj = subjects.find(s => s.gradeLevel === defaultSec?.gradeLevel) || subjects[0];
    setSubjectId(defaultSubj?.id || '');
    setTeacherId(defaultSubj?.assignedTeacherId || teachers[0]?.id || '');
    setFormConflicts([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: ScheduleSlot) => {
    setEditingSlot(slot);
    setDay(slot.day);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setSubjectId(slot.subjectId);
    setTeacherId(slot.teacherId);
    setSectionId(slot.sectionId);
    setRoom(slot.room);
    setFormConflicts([]);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selSubject = subjects.find(s => s.id === subjectId);
    const selTeacher = teachers.find(t => t.id === teacherId);
    const selSection = sections.find(s => s.id === sectionId);

    if (!selSubject || !selTeacher || !selSection) {
      alert('Please fill out all required schedule fields.');
      return;
    }

    const slotPayload = {
      day,
      startTime,
      endTime,
      subjectId: selSubject.id,
      subjectName: selSubject.name,
      subjectCode: selSubject.code,
      teacherId: selTeacher.id,
      teacherName: selTeacher.name,
      sectionId: selSection.id,
      sectionName: selSection.name,
      gradeLevel: selSection.gradeLevel,
      room,
    };

    if (editingSlot) {
      const res = updateScheduleSlot({ ...slotPayload, id: editingSlot.id });
      if (!res.success && res.conflicts) {
        setFormConflicts(res.conflicts);
        return;
      }
    } else {
      const res = addScheduleSlot(slotPayload);
      if (!res.success && res.conflicts) {
        setFormConflicts(res.conflicts);
        return;
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Conflict Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Schedule Management & Conflict Detection
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Master timetable with automatic collision warnings for teachers, classrooms, and grade sections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timetable Slot</span>
          </button>
        </div>
      </div>

      {/* Global Conflict Alert if any detected */}
      {globalConflicts.length > 0 ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-rose-900 text-sm">
              Schedule Conflicts Detected ({globalConflicts.length} item{globalConflicts.length > 1 ? 's' : ''})
            </div>
            <p className="text-rose-700 mt-0.5">
              The automated detection engine identified schedule collisions. Please review and adjust the overlapping timetable slots below:
            </p>
            <div className="mt-2 space-y-1.5">
              {globalConflicts.map((item, idx) => (
                <div key={idx} className="bg-white/80 p-2 rounded-lg border border-rose-200 text-rose-800">
                  <span className="font-semibold">{item.slot.day} {item.slot.startTime}-{item.slot.endTime}</span>: {item.slot.subjectName} ({item.slot.sectionName}) — {item.issues[0]?.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>Automatic Conflict Detection Active:</strong> 0 overlapping teacher, room, or section timetable collisions found.</span>
        </div>
      )}

      {/* View Mode Tabs and Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('section')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'section' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Section Schedule
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'teacher' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Teacher Schedule
            </button>
            <button
              onClick={() => setViewMode('room')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'room' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Room Schedule
            </button>
          </div>

          {/* Selector corresponding to view mode */}
          <div className="flex items-center gap-2 min-w-[280px]">
            <Filter className="w-4 h-4 text-slate-400" />
            {viewMode === 'section' && (
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    Grade {sec.gradeLevel} - {sec.name} ({sec.room}) • Adviser: {sec.adviserName}
                  </option>
                ))}
              </select>
            )}

            {viewMode === 'teacher' && (
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                {teachers.map(tch => (
                  <option key={tch.id} value={tch.id}>
                    {tch.name} ({tch.subjects.join(', ')})
                  </option>
                ))}
              </select>
            )}

            {viewMode === 'room' && (
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
              >
                {allRooms.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            )}
          </div>

        </div>

        {/* Timetable Grid Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-44">Time / Period</th>
                {daysOfWeek.map(d => (
                  <th key={d} className="py-3 px-3 text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {timeSlots.map(timeSlot => {
                if (timeSlot.isBreak) {
                  return (
                    <tr key={timeSlot.start} className="bg-slate-100/70">
                      <td className="py-2.5 px-3 font-semibold text-slate-500 text-[11px]">
                        {timeSlot.start} - {timeSlot.end}
                      </td>
                      <td colSpan={5} className="py-2.5 px-3 text-center text-slate-500 font-medium tracking-wide text-xs italic">
                        — {timeSlot.label} —
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={timeSlot.start} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-medium text-slate-600 bg-slate-50/30 whitespace-nowrap align-top">
                      <div className="font-semibold text-slate-900">{timeSlot.start} - {timeSlot.end}</div>
                      <div className="text-[10px] text-slate-400">60 mins</div>
                    </td>

                    {daysOfWeek.map(dayName => {
                      const slotInCell = filteredSchedules.find(
                        s => s.day === dayName && s.startTime === timeSlot.start
                      );

                      if (!slotInCell) {
                        return (
                          <td key={dayName} className="py-2 px-2 align-top text-center border-l border-slate-100">
                            <button
                              onClick={() => {
                                setEditingSlot(null);
                                setDay(dayName);
                                setStartTime(timeSlot.start);
                                setEndTime(timeSlot.end);
                                setIsModalOpen(true);
                              }}
                              className="w-full h-16 rounded-xl border border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-slate-300 hover:text-indigo-600 transition flex items-center justify-center text-xs group"
                            >
                              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                            </button>
                          </td>
                        );
                      }

                      // Check if slot has conflict
                      const hasConflict = checkScheduleConflicts(slotInCell, slotInCell.id).length > 0;

                      return (
                        <td key={dayName} className="py-2 px-2 align-top border-l border-slate-100">
                          <div className={`p-2.5 rounded-xl border transition relative group shadow-2xs ${
                            hasConflict 
                              ? 'bg-rose-50 border-rose-300 text-rose-900' 
                              : 'bg-indigo-50/60 border-indigo-200 text-indigo-950 hover:border-indigo-300'
                          }`}>
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-xs leading-tight">
                                {slotInCell.subjectName}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-white/80 rounded border border-indigo-200">
                                {slotInCell.subjectCode}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 mt-1 flex flex-col gap-0.5">
                              {viewMode !== 'teacher' && (
                                <div className="font-medium text-slate-800 truncate">
                                  👨‍🏫 {slotInCell.teacherName}
                                </div>
                              )}
                              {viewMode !== 'section' && (
                                <div className="font-medium text-indigo-700">
                                  🏫 Grade {slotInCell.gradeLevel} - {slotInCell.sectionName}
                                </div>
                              )}
                              {viewMode !== 'room' && (
                                <div className="text-[10px] text-slate-500">
                                  📍 {slotInCell.room}
                                </div>
                              )}
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-white/90 p-0.5 rounded-md shadow-xs">
                              <button
                                onClick={() => handleOpenEdit(slotInCell)}
                                className="p-1 text-slate-600 hover:text-indigo-600"
                                title="Edit Slot"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete ${slotInCell.subjectName} slot on ${slotInCell.day}?`)) {
                                    deleteScheduleSlot(slotInCell.id);
                                  }
                                }}
                                className="p-1 text-slate-600 hover:text-rose-600"
                                title="Delete Slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {hasConflict && (
                              <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-rose-700">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>Collision Conflict!</span>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add / Edit Schedule Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                {editingSlot ? 'Edit Timetable Slot' : 'Create Timetable Slot'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Conflict Warning Box if form values collide */}
            {formConflicts.length > 0 && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-700">
                  <AlertCircle className="w-4 h-4" /> Cannot Save: Schedule Conflict Detected
                </div>
                {formConflicts.map((c, i) => (
                  <p key={i} className="text-[11px] text-rose-800">{c.message}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Day of Week</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Grade & Section</label>
                <select
                  value={sectionId}
                  onChange={(e) => {
                    setSectionId(e.target.value);
                    const sec = sections.find(s => s.id === e.target.value);
                    if (sec) {
                      setRoom(sec.room);
                    }
                  }}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>
                      Grade {s.gradeLevel} - {s.name} (Room: {s.room})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => {
                      setSubjectId(e.target.value);
                      const subj = subjects.find(s => s.id === e.target.value);
                      if (subj && subj.assignedTeacherId) {
                        setTeacherId(subj.assignedTeacherId);
                      }
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} - {sub.name} (Gr {sub.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Assigned Faculty</label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subjects.join(', ')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Classroom / Room Assignment</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  placeholder="e.g. Bldg A - Room 101"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs transition"
                >
                  {editingSlot ? 'Update Timetable Slot' : 'Save Timetable Slot'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
