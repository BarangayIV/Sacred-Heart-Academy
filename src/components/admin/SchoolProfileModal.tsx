import React, { useState } from 'react';
import { Building2, X, Save, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({ isOpen, onClose }) => {
  const { schoolProfile, updateSchoolProfile } = useApp();

  const [name, setName] = useState(schoolProfile.name);
  const [schoolId, setSchoolId] = useState(schoolProfile.schoolId);
  const [division, setDivision] = useState(schoolProfile.division);
  const [region, setRegion] = useState(schoolProfile.region);
  const [address, setAddress] = useState(schoolProfile.address);
  const [email, setEmail] = useState(schoolProfile.email);
  const [principalName, setPrincipalName] = useState(schoolProfile.principalName);
  const [schoolYear, setSchoolYear] = useState(schoolProfile.schoolYear);
  const [activeQuarter, setActiveQuarter] = useState(schoolProfile.activeQuarter);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile({
      name,
      schoolId,
      division,
      region,
      address,
      email,
      principalName,
      schoolYear,
      activeQuarter,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Institutional Configuration & School Year
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-4 text-xs">
          
          <div>
            <label className="block text-slate-600 font-semibold mb-1">School Full Official Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">DepEd School ID</label>
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Principal / School Head</label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Schools Division</label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">DepEd Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Current School Year</label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="2026-2027"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Active Quarter</label>
              <select
                value={activeQuarter}
                onChange={(e) => setActiveQuarter(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="1st Quarter">1st Quarter</option>
                <option value="2nd Quarter">2nd Quarter</option>
                <option value="3rd Quarter">3rd Quarter</option>
                <option value="4th Quarter">4th Quarter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Campus Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-xs"
            >
              Save Configuration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
