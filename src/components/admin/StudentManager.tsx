import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Edit3, 
  Archive, 
  FileText, 
  UserCheck, 
  Filter, 
  Download,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

interface StudentManagerProps {
  onViewReportCard?: (student: Student) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({ onViewReportCard }) => {
  const { students, sections, addStudent, updateStudent, archiveStudent, deleteStudent, schoolProfile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [sectionFilter, setSectionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewDetailStudent, setViewDetailStudent] = useState<Student | null>(null);

  // Form Fields
  const [lrn, setLrn] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [birthDate, setBirthDate] = useState('2013-01-01');
  const [gradeLevel, setGradeLevel] = useState<number>(7);
  const [sectionId, setSectionId] = useState(sections[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Mother');
  const [address, setAddress] = useState('Garchitorena, Camarines Sur');

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lrn.includes(searchTerm) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || s.gradeLevel.toString() === gradeFilter;
    const matchesSection = sectionFilter === 'All' || s.sectionId === sectionFilter;
    const matchesStatus = statusFilter === 'All' || s.enrollmentStatus === statusFilter;
    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const randLrn = `109283${Math.floor(100000 + Math.random() * 900000)}`;
    setLrn(randLrn);
    setFirstName('');
    setLastName('');
    setGender('Male');
    setBirthDate('2013-01-01');
    setGradeLevel(7);
    const defaultSec = sections.find(sec => sec.gradeLevel === 7) || sections[0];
    setSectionId(defaultSec?.id || '');
    setParentName('');
    setParentEmail('');
    setParentPhone('+63 918 ');
    setParentRelationship('Mother');
    setAddress('Garchitorena, Camarines Sur');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setLrn(s.lrn);
    setFirstName(s.firstName);
    setLastName(s.lastName);
    setGender(s.gender);
    setBirthDate(s.birthDate);
    setGradeLevel(s.gradeLevel);
    setSectionId(s.sectionId);
    setParentName(s.parentName);
    setParentEmail(s.parentEmail);
    setParentPhone(s.parentPhone);
    setParentRelationship(s.parentRelationship);
    setAddress(s.address);
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const selSection = sections.find(sec => sec.id === sectionId);
    const fullName = `${firstName} ${lastName}`.trim();

    const studentPayload = {
      lrn,
      fullName,
      firstName,
      lastName,
      gender,
      birthDate,
      gradeLevel,
      sectionId: selSection?.id || sectionId,
      sectionName: selSection?.name || 'St. Paul',
      schoolYear: schoolProfile.schoolYear,
      parentName,
      parentEmail: parentEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      parentPhone,
      parentRelationship,
      address,
      enrollmentStatus: 'Enrolled' as const,
      avatarUrl: gender === 'Male' 
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    };

    if (editingStudent) {
      updateStudent({ ...studentPayload, id: editingStudent.id, generalAverage: editingStudent.generalAverage });
    } else {
      addStudent(studentPayload);
    }

    setIsModalOpen(false);
  };

  const exportToCSV = () => {
    const headers = ['LRN,Full Name,Grade Level,Section,Gender,Birth Date,Parent/Guardian,Parent Contact,Address,Status'];
    const rows = filteredStudents.map(s => 
      `"${s.lrn}","${s.fullName}","${s.gradeLevel}","${s.sectionName}","${s.gender}","${s.birthDate}","${s.parentName} (${s.parentRelationship})","${s.parentPhone}","${s.address}","${s.enrollmentStatus}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SHA_Learners_Masterlist_${schoolProfile.schoolYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Student Master Records & LRN Database
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing DepEd Learner Reference Numbers (LRN), enrollment profiles, section rosters, and parent contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Learner</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, 12-digit LRN, or parent..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Grades (7–10)</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Section:</span>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Sections (15)</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  Gr {sec.gradeLevel} - {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Archived">Archived</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>

        </div>
      </div>

      {/* Students Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Learner / LRN</th>
                <th className="py-3.5 px-4">Grade & Section</th>
                <th className="py-3.5 px-4">Gender & Age</th>
                <th className="py-3.5 px-4">Parent / Guardian</th>
                <th className="py-3.5 px-4">Gen. Average</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No learners found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatarUrl} 
                          alt={student.fullName} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono tracking-tight">LRN: {student.lrn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">Grade {student.gradeLevel}</div>
                      <div className="text-[11px] text-emerald-700 font-medium">{student.sectionName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{student.gender}</div>
                      <div className="text-[11px] text-slate-400">Born: {student.birthDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{student.parentName}</div>
                      <div className="text-[11px] text-slate-500">{student.parentPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {student.generalAverage ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {student.generalAverage.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        student.enrollmentStatus === 'Enrolled' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {student.enrollmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDetailStudent(student)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                          title="View Profile Details"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                          title="Edit Information"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Archive record for ${student.fullName}? Historical data will be preserved.`)) {
                              archiveStudent(student.id);
                            }
                          }}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                          title="Archive Record"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                {editingStudent ? 'Update Learner Record' : 'Enroll New Learner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 pt-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">12-Digit DepEd LRN</label>
                  <input
                    type="text"
                    value={lrn}
                    onChange={(e) => setLrn(e.target.value)}
                    placeholder="109283746501"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan Carlo"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dela Cruz"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Grade Level</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => {
                      const gl = Number(e.target.value);
                      setGradeLevel(gl);
                      const matchingSec = sections.find(s => s.gradeLevel === gl);
                      if (matchingSec) setSectionId(matchingSec.id);
                    }}
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
                <label className="block text-slate-600 font-semibold mb-1">Section Assignment</label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {sections.filter(s => s.gradeLevel === gradeLevel).map(sec => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} (Room: {sec.room}) • Adviser: {sec.adviserName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="font-semibold text-slate-800 mb-2">Parent / Guardian Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Parent/Guardian Name</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Maria Elena Dela Cruz"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Relationship</label>
                    <input
                      type="text"
                      value={parentRelationship}
                      onChange={(e) => setParentRelationship(e.target.value)}
                      placeholder="Mother / Father / Guardian"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+63 918 111 2233"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Parent Email (Portal Login)</label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="maria.delacruz@gmail.com"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Complete Home Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Zone 2, Barangay Harrison, Garchitorena, Camarines Sur"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
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
                  {editingStudent ? 'Update Learner Profile' : 'Complete Enrollment'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Student Detail View Modal */}
      {viewDetailStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img 
                  src={viewDetailStudent.avatarUrl} 
                  alt={viewDetailStudent.fullName} 
                  className="w-12 h-12 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{viewDetailStudent.fullName}</h3>
                  <div className="text-xs text-slate-500 font-mono">LRN: {viewDetailStudent.lrn}</div>
                </div>
              </div>
              <button onClick={() => setViewDetailStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Grade & Section</span>
                  <span className="font-bold text-slate-800">Grade {viewDetailStudent.gradeLevel} - {viewDetailStudent.sectionName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">School Year</span>
                  <span className="font-bold text-slate-800">{viewDetailStudent.schoolYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Gender & Birthday</span>
                  <span className="font-medium text-slate-800">{viewDetailStudent.gender}, {viewDetailStudent.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">General Average</span>
                  <span className="font-bold text-emerald-700">{viewDetailStudent.generalAverage ? `${viewDetailStudent.generalAverage.toFixed(2)}` : 'Pending'}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Guardian Information</div>
                <div className="font-semibold text-slate-900">{viewDetailStudent.parentName} ({viewDetailStudent.parentRelationship})</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewDetailStudent.parentPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewDetailStudent.parentEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{viewDetailStudent.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewDetailStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
