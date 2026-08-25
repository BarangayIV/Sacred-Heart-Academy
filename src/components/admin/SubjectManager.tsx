import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  User, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subject } from '../../types';

export const SubjectManager: React.FC = () => {
  const { subjects, teachers, addSubject, updateSubject, deleteSubject } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<number>(7);
  const [assignedTeacherId, setAssignedTeacherId] = useState(teachers[0]?.id || '');
  const [units, setUnits] = useState<number>(4);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Core' | 'Applied' | 'Specialized'>('Core');

  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.assignedTeacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || sub.gradeLevel.toString() === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setCode('MATH-7');
    setName('Mathematics 7');
    setGradeLevel(7);
    setAssignedTeacherId(teachers[0]?.id || '');
    setUnits(4);
    setDescription('Junior High School DepEd Curriculum Unit');
    setCategory('Core');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setCode(sub.code);
    setName(sub.name);
    setGradeLevel(sub.gradeLevel);
    setAssignedTeacherId(sub.assignedTeacherId);
    setUnits(sub.units);
    setDescription(sub.description);
    setCategory(sub.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === assignedTeacherId);

    const payload = {
      code,
      name,
      gradeLevel,
      assignedTeacherId,
      assignedTeacherName: teacher?.name || 'Assigned Faculty',
      units,
      description,
      category,
    };

    if (editingSubject) {
      updateSubject({ ...payload, id: editingSubject.id });
    } else {
      addSubject(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            DepEd Curriculum & Subject Database
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Junior High School Subjects (Grades 7–10) with assigned faculty, units, and learning competencies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Curriculum Subject</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subjects by name, code (e.g. MATH-7), or faculty..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Grade Level:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Grade Levels</option>
              <option value="7">Grade 7 Subjects</option>
              <option value="8">Grade 8 Subjects</option>
              <option value="9">Grade 9 Subjects</option>
              <option value="10">Grade 10 Subjects</option>
            </select>
          </div>

        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.map(sub => (
          <div 
            key={sub.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    {sub.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{sub.name}</h3>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                  Grade {sub.gradeLevel}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {sub.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Assigned Faculty:</span>
                  <span className="font-semibold text-slate-900">{sub.assignedTeacherName}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Curriculum Units:</span>
                  <span className="font-medium text-slate-800">{sub.units} Units ({sub.category})</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
              <button
                onClick={() => handleOpenEdit(sub)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Delete curriculum subject ${sub.name}?`)) {
                    deleteSubject(sub.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Subject Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                {editingSubject ? 'Edit Curriculum Subject' : 'Add Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="MATH-7"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
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
                <label className="block text-slate-600 font-semibold mb-1">Subject Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics 7"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Assigned Faculty</label>
                  <select
                    value={assignedTeacherId}
                    onChange={(e) => setAssignedTeacherId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Units</label>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    min={1}
                    max={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Subject Description & Scope</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope, topics, and competencies..."
                  className="w-full h-20 p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Subject
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
