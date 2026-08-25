import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileCheck2, 
  Calendar, 
  Users, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || log.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getCategoryBadge = (cat: AuditLog['category']) => {
    switch (cat) {
      case 'Grades':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Grades</span>;
      case 'Schedule':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Schedule</span>;
      case 'Enrollment':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Enrollment</span>;
      case 'Communication':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Communication</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">System</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            System Audit Trail & Security Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable tracking of grade encodings, timetable modifications, approvals, logins, and communications.
          </p>
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
              placeholder="Search audit logs by action, user, or detail..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-semibold"
            >
              <option value="All">All Audit Categories</option>
              <option value="Grades">Grades & Encodes</option>
              <option value="Schedule">Timetable & Schedule</option>
              <option value="Enrollment">Learners & Faculty</option>
              <option value="Communication">Parent-Teacher Msgs</option>
              <option value="System">System Changes</option>
            </select>
          </div>

        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-44">Timestamp</th>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-4">
                    {getCategoryBadge(log.category)}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
