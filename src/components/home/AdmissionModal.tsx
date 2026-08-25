import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Building2, 
  Send, 
  Phone, 
  Mail, 
  User, 
  BookOpen, 
  FileText, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({ isOpen, onClose }) => {
  const { schoolProfile, logAction } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    incomingGrade: 'Grade 7',
    learnerLrn: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    currentSchool: '',
    isEscGrantee: 'Yes',
    inquiryType: 'Enrollment for S.Y. 2026–2027',
    message: ''
  });
  const [refNumber, setRefNumber] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `SHA-ADM-${Math.floor(100000 + Math.random() * 900000)}`;
    setRefNumber(newRef);
    setSubmitted(true);
    logAction(
      'Online Admission Inquiry', 
      'Enrollment', 
      `Inquiry submitted for ${formData.studentName} (${formData.incomingGrade}) - Ref: ${newRef}`
    );
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      studentName: '',
      incomingGrade: 'Grade 7',
      learnerLrn: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      currentSchool: '',
      isEscGrantee: 'Yes',
      inquiryType: 'Enrollment for S.Y. 2026–2027',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Admissions & Enrollment</h3>
              <p className="text-xs text-slate-300">
                Sacred Heart Academy • S.Y. 2026–2027 Inquiries & Pre-Registration
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Thank you for your interest in joining <strong>Sacred Heart Academy</strong>. Your inquiry reference number is:
              </p>
              <div className="my-4 inline-block bg-slate-100 border border-slate-300 rounded-xl px-5 py-2.5">
                <span className="text-xs text-slate-500 block uppercase tracking-wider font-semibold">Reference ID</span>
                <span className="text-lg font-mono font-bold text-emerald-700">{refNumber}</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Our Admissions Registrar will contact you at <strong>{formData.parentPhone || formData.parentEmail}</strong> within 1–2 business days regarding requirements and ESC Voucher assessment.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ESC Voucher Grantee School:</strong> Grade 7 students and transferees may avail of the DepEd Educational Service Contracting (ESC) tuition subsidy.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Maria Angela Santos"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Incoming Grade Level *
                  </label>
                  <select
                    value={formData.incomingGrade}
                    onChange={(e) => setFormData({ ...formData, incomingGrade: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Grade 7">Grade 7 (Freshman)</option>
                    <option value="Grade 8">Grade 8 (Sophomore)</option>
                    <option value="Grade 9">Grade 9 (Junior)</option>
                    <option value="Grade 10">Grade 10 (Completer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Learner Reference No. (LRN)
                  </label>
                  <input
                    type="text"
                    value={formData.learnerLrn}
                    onChange={(e) => setFormData({ ...formData, learnerLrn: e.target.value })}
                    placeholder="12-digit DepEd LRN (if available)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous School Attended
                  </label>
                  <input
                    type="text"
                    value={formData.currentSchool}
                    onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                    placeholder="e.g. Garchitorena Central School"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Parent / Guardian Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Juanita Santos"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile / Contact No. *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="0917-XXX-XXXX"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="parent@email.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Questions or Special Inquiries (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask about voucher slots, payment schemes, or entrance assessments..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Pre-Registration</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
