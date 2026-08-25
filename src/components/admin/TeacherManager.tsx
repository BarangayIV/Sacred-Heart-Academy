import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  BookOpen, 
  Layers, 
  FileText,
  AlertCircle,
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';

export const TeacherManager: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, sections, schedules } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subjectsStr, setSubjectsStr] = useState('');
  const [gradeLevelsStr, setGradeLevelsStr] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [adviserOfSectionId, setAdviserOfSectionId] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');
  const [notes, setNotes] = useState('');

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || t.gradeLevels.includes(Number(gradeFilter));
    return matchesSearch && matchesGrade;
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setName('');
    setEmail('');
    setPhone('+63 9');
    setSubjectsStr('Mathematics 7, ESP 7');
    setGradeLevelsStr('7');
    setSpecialization('Secondary Education');
    setAdviserOfSectionId('');
    setStatus('Active');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setEmail(t.email);
    setPhone(t.phone);
    setSubjectsStr(t.subjects.join(', '));
    setGradeLevelsStr(t.gradeLevels.join(', '));
    setSpecialization(t.specialization);
    setAdviserOfSectionId(t.adviserOfSectionId || '');
    setStatus(t.status);
    setNotes(t.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const subjects = subjectsStr.split(',').map(s => s.trim()).filter(Boolean);
    const gradeLevels = gradeLevelsStr.split(',').map(g => Number(g.trim())).filter(n => !isNaN(n));

    const payload = {
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@sha.edu.ph`,
      phone,
      photoUrl: editingTeacher?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      subjects,
      gradeLevels,
      assignedSections: editingTeacher?.assignedSections || [],
      adviserOfSectionId: adviserOfSectionId || undefined,
      status,
      specialization,
      notes: notes || undefined,
    };

    if (editingTeacher) {
      updateTeacher({ ...payload, id: editingTeacher.id });
    } else {
      addTeacher(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            Faculty & Subject Master List
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserving official Sacred Heart Academy S.Y. 2026–2027 timetable transcriptions and faculty assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty by name, assigned subject (e.g. Science, Math), or specialization..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Grade Level:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Grades (7–10)</option>
              <option value="7">Grade 7 Faculty</option>
              <option value="8">Grade 8 Faculty</option>
              <option value="9">Grade 9 Faculty</option>
              <option value="10">Grade 10 Faculty</option>
            </select>
          </div>

        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map(teacher => {
          const advisorySection = sections.find(s => s.id === teacher.adviserOfSectionId);
          const teacherScheduleCount = schedules.filter(s => s.teacherId === teacher.id).length;

          return (
            <div 
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                
                {/* Top Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{teacher.name}</h3>
                      <p className="text-[11px] text-indigo-700 font-medium">{teacher.specialization}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {teacher.status}
                  </span>
                </div>

                {/* Subjects Handled */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Assigned Subjects & Grade Levels:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.subjects.map((subj, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-indigo-50 text-indigo-900 rounded-lg text-xs font-semibold border border-indigo-100"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Advisory & Timetable Load */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  {advisorySection && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Homeroom Advisory:</span>
                      <span className="font-bold text-slate-800 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                        Grade {advisorySection.gradeLevel} - {advisorySection.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Scheduled Teaching Slots:</span>
                    <span className="font-semibold text-slate-700">{teacherScheduleCount} class periods / week</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate pt-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{teacher.email}</span>
                  </div>
                </div>

                {/* Handwritten Timetable Transcription Note */}
                {teacher.notes && (
                  <div className="mt-2.5 p-2 bg-amber-50/70 border border-amber-200/70 rounded-lg text-[11px] text-amber-900 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Timetable Note:</strong> {teacher.notes}</span>
                  </div>
                )}

              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(teacher)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete faculty record for ${teacher.name}?`)) {
                      deleteTeacher(teacher.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                {editingTeacher ? 'Update Faculty Record' : 'Add Faculty Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-4 pt-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Full Teacher Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Austin Alcantara"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Institutional Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="austin.alcantara@sha.edu.ph"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+63 919 234 5671"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Academic Specialization</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Secondary Mathematics & ESP"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Subjects (comma-separated)</label>
                <input
                  type="text"
                  value={subjectsStr}
                  onChange={(e) => setSubjectsStr(e.target.value)}
                  placeholder="e.g. Mathematics 7, ESP 7"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Grade Levels Taught (e.g. 7, 8)</label>
                  <input
                    type="text"
                    value={gradeLevelsStr}
                    onChange={(e) => setGradeLevelsStr(e.target.value)}
                    placeholder="7, 8"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Advisory Section</label>
                  <select
                    value={adviserOfSectionId}
                    onChange={(e) => setAdviserOfSectionId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="">None (Subject Teacher Only)</option>
                    {sections.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        Grade {sec.gradeLevel} - {sec.name} ({sec.room})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Timetable Notes / Handwritten Remarks</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Handwritten update appears in higher-grade schedule"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingTeacher ? 'Update Faculty Record' : 'Save Faculty Record'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
