import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Lock, 
  UserCheck, 
  FileText, 
  Heart, 
  Compass, 
  Layers, 
  Laptop, 
  Microscope, 
  Music, 
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { LoginModal } from '../auth/LoginModal';
import { AdmissionModal } from './AdmissionModal';

interface SchoolHomepageProps {
  onEnterPortal: (role?: UserRole) => void;
}

export const SchoolHomepage: React.FC<SchoolHomepageProps> = ({ onEnterPortal }) => {
  const { 
    schoolProfile, 
    announcements, 
    teachers, 
    sections, 
    subjects 
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [selectedLoginRole, setSelectedLoginRole] = useState<UserRole>('admin');
  const [selectedGradeTab, setSelectedGradeTab] = useState<number>(7);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenLogin = (role: UserRole = 'admin') => {
    setSelectedLoginRole(role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (role: UserRole) => {
    onEnterPortal(role);
  };

  // Grade specifics
  const gradeDetails: Record<number, { title: string; subtitle: string; description: string; focal: string[] }> = {
    7: {
      title: 'Grade 7 — Foundation & Character Exploration',
      subtitle: '4 Active Sections: St. Paul, St. Peter, St. John, St. Matthew',
      description: 'Bridging elementary education into high school through disciplined inquiry, moral discernment, basic science laboratory techniques, and fundamental mathematical problem-solving.',
      focal: ['Foundational Algebra & Geometry', 'General Science & Lab Safety', 'Philippine Literature & Composition', 'Edukasyon sa Pagpapakatao (ESP)', 'Basic Computer Productivity & ICT'],
    },
    8: {
      title: 'Grade 8 — Analytical Thinking & Scientific Inquiry',
      subtitle: '4 Active Sections: St. Luke, St. Mark, St. Thomas, St. James',
      description: 'Strengthening scientific experimentation, Afro-Asian literature appreciation, algebraic reasoning, and understanding regional socio-economic dynamics in Camarines Sur and the Philippines.',
      focal: ['Integrated Earth & Life Science', 'Intermediate Algebra & Statistics', 'Afro-Asian Literature', 'Kasaysayan ng Daigdig (World History)', 'Information Technology & Web Basics'],
    },
    9: {
      title: 'Grade 9 — Advanced Inquiry & Collaborative Leadership',
      subtitle: '4 Active Sections: St. Francis, St. Dominic, St. Ignatius, St. Jude',
      description: 'Fostering research methodologies, physics and chemistry basics, Anglo-American literary analysis, youth leadership, and community development projects in Garchitorena.',
      focal: ['Physics & Chemistry Concepts', 'Trigonometry & Quadratic Equations', 'Anglo-American Literature & Research', 'Ekonomiks (Economics & Financial Literacy)', 'Creative Media & Robotics Basics'],
    },
    10: {
      title: 'Grade 10 — Career Pathway & Senior High Readiness',
      subtitle: '3 Active Sections: St. Augustine, St. Benedict, St. Therese',
      description: 'Preparing completers for Senior High School (STEM, ABM, HUMSS, TVL) through investigatory projects, advanced contemporary issues, public speaking, and capstone research papers.',
      focal: ['Investigatory Science Research Capstone', 'Advanced Geometry & Pre-Calculus', 'World Literature & Technical Writing', 'Mga Kontemporaryong Isyu', 'Career Guidance & Academic Track Planning'],
    },
  };

  const gradeSections = sections.filter(s => s.gradeLevel === selectedGradeTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* 1. TOP ANNOUNCEMENT TICKER & QUICK ACCESS BAR */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
              S.Y. 2026–2027
            </span>
            <span className="text-slate-300 font-medium">
              Admissions & ESC Voucher Applications Now Open for Grades 7 to 10
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Garchitorena, Camarines Sur
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              {schoolProfile.contactEmail || 'sacredheartacademy2@gmail.com'}
            </span>
            <button
              onClick={() => handleOpenLogin('admin')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 hover:underline ml-2"
            >
              <Lock className="w-3 h-3" />
              Staff Login
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* School Branding */}
            <a href="#hero" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-0.5 shadow-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition transform">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-800 transition">
                    {schoolProfile.name}
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-700 tracking-wide uppercase mt-0.5">
                  Junior High School • DepEd School ID: {schoolProfile.schoolId}
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-600">
              <a href="#about" className="hover:text-emerald-700 transition">About SHA</a>
              <a href="#academics" className="hover:text-emerald-700 transition">Academics (Grades 7–10)</a>
              <a href="#facilities" className="hover:text-emerald-700 transition">Facilities</a>
              <a href="#admissions" className="hover:text-emerald-700 transition">Admissions & ESC</a>
              <a href="#announcements" className="hover:text-emerald-700 transition">News & Notices</a>
              <a href="#contact" className="hover:text-emerald-700 transition">Contact</a>
            </nav>

            {/* CTA Buttons: Admission & Portal Login */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setIsAdmissionModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Enroll / Inquire</span>
              </button>

              <button
                onClick={() => handleOpenLogin('admin')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-emerald-900 border border-slate-800 rounded-xl transition shadow-md flex items-center gap-2 group"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition transform" />
                <span>Portal Sign In</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => handleOpenLogin('admin')}
                className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-xl flex items-center gap-1.5"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Login</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-emerald-700 py-1"
            >
              About Sacred Heart Academy
            </a>
            <a 
              href="#academics" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-emerald-700 py-1"
            >
              Academics (Grades 7–10)
            </a>
            <a 
              href="#facilities" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-emerald-700 py-1"
            >
              Campus & Facilities
            </a>
            <a 
              href="#admissions" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-emerald-700 py-1"
            >
              Admissions & ESC Voucher
            </a>
            <a 
              href="#announcements" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-emerald-700 py-1"
            >
              News & Circulars
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-emerald-700 py-1"
            >
              Contact Us
            </a>
            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdmissionModalOpen(true);
                }}
                className="w-full py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200"
              >
                Inquire & Pre-Register for S.Y. 2026–2027
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenLogin('admin');
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enter School Management Portal</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="hero" className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nurturing Minds • Transforming Hearts • Serving God & Country</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Faith, Character</span>, and Wisdom.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Welcome to <strong>Sacred Heart Academy</strong>, Garchitorena’s premier Catholic Junior High School institution. We empower students in Camarines Sur with DepEd-standard academic rigor, science and robotics inquiry, Christian values formation, and modern digital learning.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => handleOpenLogin('admin')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4 text-emerald-200" />
                  <span>Access School Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition hover:border-emerald-500/50"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Apply for S.Y. 2026–2027</span>
                </button>
              </div>

              {/* Fast Feature Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xl font-extrabold text-white">48+ Yrs</div>
                  <div className="text-xs text-slate-400">Academic Heritage</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xl font-extrabold text-emerald-400">15 Sections</div>
                  <div className="text-xs text-slate-400">Grades 7 to 10 JHS</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xl font-extrabold text-teal-300">17 Faculty</div>
                  <div className="text-xs text-slate-400">Licensed Specialists</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div className="text-xl font-extrabold text-amber-400">100% ESC</div>
                  <div className="text-xs text-slate-400">DepEd Voucher Grants</div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Image & Floating Badges */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                    alt="Sacred Heart Academy Students Learning"
                    className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600/90 text-[11px] font-bold tracking-wider uppercase mb-2">
                      Camarines Sur, Region V
                    </div>
                    <h3 className="text-lg font-bold">Poblacion, Garchitorena</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      A vibrant educational community fostering academic excellence, moral discipline, and community stewardship.
                    </p>
                  </div>
                </div>

                {/* Floating Quick Portal Card */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white text-slate-900 rounded-xl p-4 shadow-2xl border border-slate-200 hidden sm:flex items-center gap-3 max-w-xs animate-in fade-in">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Live DepEd ECR Portal</div>
                    <div className="text-[11px] text-slate-500">Automated SF9 & Timetables</div>
                  </div>
                </div>

                {/* Floating ESC Card */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-slate-900 text-white rounded-xl p-3.5 shadow-2xl border border-emerald-500/40 hidden sm:flex items-center gap-2.5 max-w-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">ESC Subsidized</div>
                    <div className="text-[10px] text-slate-400">Guaranteed Tuition Grants</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DIRECT ROLE LOGIN SELECTOR BANNER */}
      <section className="bg-slate-800 border-y border-slate-700 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Authorized Stakeholder Access
              </div>
              <h3 className="text-lg font-bold text-white">
                Choose your portal role to sign in:
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
              <button
                onClick={() => handleOpenLogin('admin')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-950 border border-slate-700 hover:border-emerald-500/50 text-left transition flex items-center gap-2.5 group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Administrator</div>
                  <div className="text-[10px] text-slate-400">Principal & Hub</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenLogin('teacher')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500/50 text-left transition flex items-center gap-2.5 group"
              >
                <UserCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Faculty & Teacher</div>
                  <div className="text-[10px] text-slate-400">Grades & Timetable</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenLogin('student')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-950 border border-slate-700 hover:border-amber-500/50 text-left transition flex items-center gap-2.5 group"
              >
                <GraduationCap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Student Learner</div>
                  <div className="text-[10px] text-slate-400">SF9 & Schedules</div>
                </div>
              </button>

              <button
                onClick={() => handleOpenLogin('parent')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-500/50 text-left transition flex items-center gap-2.5 group"
              >
                <Users className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Parent / Guardian</div>
                  <div className="text-[10px] text-slate-400">Progress & Teachers</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT US, MISSION & VISION */}
      <section id="about" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Institutional Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Forming Competent, Compassionate, and Committed Christian Learners
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              Founded to serve the youth of Garchitorena and the coastal districts of Camarines Sur, Sacred Heart Academy provides holistic secondary education anchored in Christ-centered values, academic rigor, and community responsibility.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Christ-Centered Formation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Daily Christian Living & Values Education (ESP), campus ministry retreats, first Friday masses, and ethical character development.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">DepEd K-12 Academic Rigor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comprehensive curriculum spanning Advanced Mathematics, Investigatory Science Research, English Journalism, and Filipino Panitikan.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Science & Digital ICT Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hands-on laboratory experiments, computer literacy, productivity software, coding basics, and modern multimedia learning resources.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-rose-300 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Community & Leadership</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active Supreme Secondary Learner Government (SSLG), Boy Scouts & Girl Scouts, coastal environmental cleanups, and athletic intramurals.
              </p>
            </div>

          </div>

          {/* Mission & Vision Callout Box */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-b md:border-b-0 md:border-r border-slate-700 pb-6 md:pb-0 md:pr-8">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Our Vision</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">A Beacon of Catholic Academic Excellence</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Sacred Heart Academy envisions a premier educational community that nurtures morally upright, academically proficient, globally competitive, and socially responsive Christian leaders dedicated to the service of God, the nation, and the community of Garchitorena."
                </p>
              </div>

              <div className="md:pl-2">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Our Mission</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Holistic Junior High School Education</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "To provide quality Catholic secondary education through comprehensive curricula, dedicated Christian faculty mentorship, state-of-the-art learning environments, and an enduring culture of integrity, compassion, and academic discipline."
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. ACADEMIC PROGRAMS & GRADE 7-10 CURRICULUM */}
      <section id="academics" className="py-16 sm:py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Curriculum Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Junior High School Academic Program (Grades 7 to 10)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our DepEd K-12 Enhanced Basic Education curriculum prepares learners seamlessly for all Senior High School tracks.
            </p>
          </div>

          {/* Grade Level Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {[7, 8, 9, 10].map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGradeTab(grade)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 ${
                  selectedGradeTab === grade
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Grade {grade}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedGradeTab === grade ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-500'}`}>
                  {grade === 7 ? 'Freshmen' : grade === 8 ? 'Sophomores' : grade === 9 ? 'Juniors' : 'Completers'}
                </span>
              </button>
            ))}
          </div>

          {/* Active Grade Content Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-block px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {gradeDetails[selectedGradeTab].subtitle}
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {gradeDetails[selectedGradeTab].title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {gradeDetails[selectedGradeTab].description}
                </p>

                <div className="pt-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Core Learning Competencies & Subject Highlights:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {gradeDetails[selectedGradeTab].focal.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sections & Homerooms in this Grade */}
              <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Assigned Grade {selectedGradeTab} Sections
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {gradeSections.length} Homeroom Classes
                  </span>
                </div>

                <div className="space-y-2.5">
                  {gradeSections.map(sec => (
                    <div key={sec.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Section {sec.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Adviser: <strong>{sec.adviserName}</strong>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {sec.room}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Cap: {sec.capacity} students
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Weekly timetable scheduled</span>
                  <button
                    onClick={() => handleOpenLogin('student')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    View Timetable in Portal →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. CAMPUS FACILITIES & ENVIRONMENT */}
      <section id="facilities" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Campus Environment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Modern Facilities for Comprehensive Learning
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our campus in Poblacion, Garchitorena provides safe, conducive, and well-equipped spaces for academic discovery, sports, and spiritual formation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 group hover:shadow-lg transition">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80"
                  alt="Science and Biology Laboratory"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  General Science Lab
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <Microscope className="w-4 h-4 text-emerald-600" />
                  Science & Biology Laboratory
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Equipped with high-precision compound microscopes, glassware, chemical apparatus, and safety fixtures for hands-on investigatory experimentation.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 group hover:shadow-lg transition">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
                  alt="Computer and ICT Laboratory"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  ICT & Media Lab
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  Computer & ICT Center
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated desktop workstations, digital productivity tools, coding fundamentals, and fast network connectivity for tech-driven research.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 group hover:shadow-lg transition">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80"
                  alt="Library and Learning Commons"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  Learning Commons
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-base text-slate-900 mb-1.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  St. Joseph Library & Resource
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thousands of DepEd reference volumes, academic journals, quiet study carrels, and collaborative research nooks for all junior high learners.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. DIGITAL PORTAL SHOWCASE */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Integrated Academic Information System</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Experience the Sacred Heart Academy Digital School Portal
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our school portal connects school administrators, 17 faculty teachers, students, and parents under a unified, real-time academic platform compliant with DepEd standards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-bold text-xs text-emerald-400 flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>DepEd Form 138 (SF9)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Instant calculation of General Averages, core competencies, and academic honors (With Honors, High Honors).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-bold text-xs text-teal-300 flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Live Master Timetable</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Conflict-checked weekly schedules by Section, Teacher, and Classroom across all 15 class sections.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-bold text-xs text-indigo-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Electronic Class Record (ECR)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Multi-stage teacher grade submission, administrative verification, and publishing workflow.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="font-bold text-xs text-rose-400 flex items-center gap-1.5 mb-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Parent-Teacher Direct Hub</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Dedicated conversation threads, PTC consultation appointments, and attendance tracking.
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleOpenLogin('admin')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Launch School Portal Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">portal.sha.edu.ph</span>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                  Active S.Y. 2026–2027
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Administrator Hub</div>
                      <div className="text-[10px] text-slate-400">Dr. Maria Consuelo Hernandez</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenLogin('admin')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Enter →
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Faculty Grading Portal</div>
                      <div className="text-[10px] text-slate-400">17 Active Teachers Loaded</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenLogin('teacher')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    Enter →
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Learner Form 138 (SF9)</div>
                      <div className="text-[10px] text-slate-400">Student Progress & Honors</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenLogin('student')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    Enter →
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-rose-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Parent Communication Hub</div>
                      <div className="text-[10px] text-slate-400">Direct Subject Teacher Chat</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenLogin('parent')}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300"
                  >
                    Enter →
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 9. ADMISSIONS & ENROLLMENT S.Y. 2026-2027 */}
      <section id="admissions" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Admissions & Scholarships
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Enroll at Sacred Heart Academy for S.Y. 2026–2027
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Invest in your child’s future with affordable, top-quality Catholic junior high education assisted by government tuition vouchers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Step by step */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>4-Step Easy Enrollment Process</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mb-2">
                    01
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Pre-Registration</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Fill out our online admission form or visit the Registrar’s Office at Poblacion, Garchitorena.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mb-2">
                    02
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Document Submission</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Submit PSA Birth Certificate, DepEd SF9 (Form 138 report card), and Certificate of Good Moral Character.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mb-2">
                    03
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">ESC Voucher Assessment</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Avail of government tuition subsidies under the Educational Service Contracting (ESC) Program.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center mb-2">
                    04
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Sectioning & Orientation</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Receive your official section assignment, schedule timetable, and parent orientation kit.
                  </p>
                </div>
              </div>

              {/* Requirements List */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 mt-4">
                <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Enrollment Requirements Checklist</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Original DepEd Form 138 (SF9 Report Card)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    PSA Authenticated Birth Certificate (2 copies)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Certificate of Good Moral Character
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Four (4) recent 2x2 ID pictures (white background)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    DepEd 12-Digit Learner Reference Number (LRN)
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    ESC Subsidy Application / Certification
                  </li>
                </ul>
              </div>

            </div>

            {/* Inquire Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-wider uppercase">
                  Admissions Helpline
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Ready to Join the Sacred Heart Family?</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Reserve your slot for Grade 7 to 10. Our admissions counselors are ready to answer your questions regarding ESC vouchers and flexible payment schemes.
                </p>

                <div className="mt-6 space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{schoolProfile.contactPhone || '(054) 881-2490 / +63 917 842 1904'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{schoolProfile.contactEmail || 'sacredheartacademy2@gmail.com'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Mon – Fri: 7:30 AM – 5:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Submit Online Pre-Registration</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 10. LATEST NEWS & ANNOUNCEMENTS */}
      <section id="announcements" className="py-16 sm:py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                School Bulletins
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Latest Announcements & Circulars
              </h2>
            </div>
            <button
              onClick={() => handleOpenLogin('admin')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>View all circulars in Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {ann.publishedDate}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 line-clamp-2">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium">{ann.authorName}</span>
                  <span className="font-semibold text-slate-700">Audience: [{ann.targetAudience}]</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. LOCATION, CONTACT & LEADERSHIP */}
      <section id="contact" className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Location & Contact
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                  Visit Sacred Heart Academy
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  Located in the heart of Poblacion, Garchitorena, Camarines Sur, accessible to all surrounding barangays and coastal municipalities.
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <MapPin className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Campus Address</strong>
                    <span>{schoolProfile.address}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Division of Camarines Sur • Region V (Bicol) • School ID: {schoolProfile.schoolId}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Mail className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Official Inquiries & Transcript Verification</strong>
                    <span>{schoolProfile.contactEmail || 'sacredheartacademy2@gmail.com'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <Phone className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Registrar & Principal Office Telephone</strong>
                    <span>{schoolProfile.contactPhone || '(054) 881-2490 / +63 917 842 1904'}</span>
                  </div>
                </div>
              </div>

              {/* Principal Endorsement */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  MH
                </div>
                <div>
                  <div className="font-bold text-xs text-white">{schoolProfile.principalName}</div>
                  <div className="text-[11px] text-emerald-400">School Principal & Academic Director</div>
                </div>
              </div>

            </div>

            {/* Interactive Inquiry Card & Quick Message */}
            <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Send a Message to the School</h3>
              <p className="text-xs text-slate-600 mb-4">
                Have a question regarding grades, enrollment, credentials, or school activities? Leave us a note and we will reply promptly.
              </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your message has been sent to the Sacred Heart Academy Administration.');
              }} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roberto Santos"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email or Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="roberto@gmail.com / 0917-..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Request for Form 137 / Enrollment Inquiry"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write your inquiry or question here..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Send Inquiry to Administration
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg leading-tight">{schoolProfile.name}</div>
                  <div className="text-xs text-emerald-400 font-semibold">Garchitorena, Camarines Sur</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                A private Catholic Junior High School institution recognized by the Department of Education (DepEd Region V), dedicated to fostering academic competence, moral integrity, and social responsibility.
              </p>
              <div className="text-xs text-slate-500">
                DepEd School ID: <strong>{schoolProfile.schoolId}</strong> • S.Y. 2026–2027
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#about" className="hover:text-emerald-400 transition">About Sacred Heart Academy</a></li>
                <li><a href="#academics" className="hover:text-emerald-400 transition">Junior High Curriculum (Grades 7–10)</a></li>
                <li><a href="#facilities" className="hover:text-emerald-400 transition">Campus Science & ICT Labs</a></li>
                <li><a href="#admissions" className="hover:text-emerald-400 transition">ESC Tuition Subsidy / Admissions</a></li>
                <li><a href="#announcements" className="hover:text-emerald-400 transition">Latest Bulletins & Circulars</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
                Stakeholder Portals
              </h4>
              <div className="space-y-2 text-xs">
                <button 
                  onClick={() => handleOpenLogin('admin')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 flex items-center justify-between border border-slate-800"
                >
                  <span>Administrator Portal</span>
                  <Lock className="w-3 h-3 text-slate-500" />
                </button>
                <button 
                  onClick={() => handleOpenLogin('teacher')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-400 flex items-center justify-between border border-slate-800"
                >
                  <span>Faculty ECR Portal</span>
                  <UserCheck className="w-3 h-3 text-slate-500" />
                </button>
                <button 
                  onClick={() => handleOpenLogin('student')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 flex items-center justify-between border border-slate-800"
                >
                  <span>Student Form 138 (SF9)</span>
                  <GraduationCap className="w-3 h-3 text-slate-500" />
                </button>
                <button 
                  onClick={() => handleOpenLogin('parent')}
                  className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 flex items-center justify-between border border-slate-800"
                >
                  <span>Parent Monitoring Hub</span>
                  <Users className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              © 2026–2027 Sacred Heart Academy • All rights reserved. DepEd Region V - Bicol.
            </div>
            <div className="flex items-center gap-4">
              <span>Contact: sacredheartacademy2@gmail.com</span>
              <span>•</span>
              <button
                onClick={() => handleOpenLogin('admin')}
                className="font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Sign In to Portal
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* MODALS */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={selectedLoginRole}
      />

      <AdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
      />

    </div>
  );
};
