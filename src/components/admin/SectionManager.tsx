import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  Building, 
  UserCheck, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Section } from '../../types';

export const SectionManager: React.FC = () => {
  const { sections, teachers, students, addSection, updateSection, deleteSection, schoolProfile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(7);
  const [room, setRoom] = useState('Bldg A - Room 101');
  const [adviserId, setAdviserId] = useState(teachers[0]?.id || '');
  const [capacity, setCapacity] = useState<number>(45);

  const filteredSections = sections.filter(sec => {
    const matchesSearch = 
      sec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.adviserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || sec.gradeLevel.toString() === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleOpenAdd = () => {
    setEditingSection(null);
    setName('');
    setGradeLevel(7);
    setRoom('Bldg A - Room 101');
    setAdviserId(teachers[0]?.id || '');
    setCapacity(45);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sec: Section) => {
    setEditingSection(sec);
    setName(sec.name);
    setGradeLevel(sec.gradeLevel);
    setRoom(sec.room);
    setAdviserId(sec.adviserId);
    setCapacity(sec.capacity);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const adviser = teachers.find(t => t.id === adviserId);

    const payload = {
      name,
      gradeLevel,
      room,
      adviserId,
      adviserName: adviser?.name || 'Unassigned',
      capacity,
      schoolYear: schoolProfile.schoolYear,
    };

    if (editingSection) {
      updateSection({ ...payload, id: editingSection.id });
    } else {
      addSection(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            Grade-Level Sections & Homeroom Advisers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing all 15 official Grade 7 to 10 sections transcribed from the timetable schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Section</span>
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search section name (e.g. St. Paul), adviser, or room..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Grade Level:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Grade Sections (15)</option>
              <option value="7">Grade 7 (St. Paul, St. Francis, St. Augustine, St. Andrew)</option>
              <option value="8">Grade 8 (St. Margarette, St. Martha, St. Regina, St. Claire)</option>
              <option value="9">Grade 9 (St. Martin, St. Benedict, St. Matthew, St. John)</option>
              <option value="10">Grade 10 (St. Lourdes, St. Fatima, St. Monica)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map(sec => {
          const studentCount = students.filter(s => s.sectionId === sec.id).length;

          return (
            <div 
              key={sec.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Grade {sec.gradeLevel} Section
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mt-2">{sec.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {sec.room}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Homeroom Adviser:</span>
                    <span className="font-bold text-slate-900">{sec.adviserName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">Enrolled Learners:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {studentCount} / {sec.capacity} Capacity
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400">School Year:</span>
                    <span className="font-medium text-slate-700">{sec.schoolYear}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(sec)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Section</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete Section ${sec.name}?`)) {
                      deleteSection(sec.id);
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

      {/* Add / Edit Section Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                {editingSection ? 'Edit Section Details' : 'Create Grade Section'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Section Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. St. Paul"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Grade Level</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value={7}>Grade 7</option>
                    <option value={8}>Grade 8</option>
                    <option value={9}>Grade 9</option>
                    <option value={10}>Grade 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Assigned Homeroom Adviser</label>
                <select
                  value={adviserId}
                  onChange={(e) => setAdviserId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Room Assignment</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Bldg A - Room 101"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Learner Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    min={20}
                    max={60}
                    required
                  />
                </div>
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Section
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
