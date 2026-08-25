import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Filter, 
  Calendar, 
  Users, 
  AlertCircle, 
  X,
  Send,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';

export const AnnouncementManager: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, sections, schoolProfile } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAudience, setFilterAudience] = useState<string>('All');

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<Announcement['targetAudience']>('All');
  const [targetSectionId, setTargetSectionId] = useState('');
  const [priority, setPriority] = useState<Announcement['priority']>('Normal');
  const [category, setCategory] = useState<Announcement['category']>('General');
  const [expiryDate, setExpiryDate] = useState('');

  const filteredAnnouncements = announcements.filter(a => {
    if (filterAudience === 'All') return true;
    return a.targetAudience === filterAudience;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selSection = sections.find(s => s.id === targetSectionId);

    addAnnouncement({
      title,
      content,
      authorName: schoolProfile.principalName,
      authorRole: 'Administration',
      targetAudience,
      targetSectionId: targetAudience === 'SpecificSection' ? targetSectionId : undefined,
      targetSectionName: targetAudience === 'SpecificSection' ? selSection?.name : undefined,
      priority,
      category,
      expiryDate: expiryDate || undefined,
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  const getPriorityBadge = (p: Announcement['priority']) => {
    switch (p) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Urgent Notice</span>;
      case 'Important':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Important</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            School-Wide & Targeted Announcements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast circulars, academic notices, and event guidelines to Teachers, Students, and Parents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Announcement</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl w-fit text-xs">
        {['All', 'Teachers', 'Students', 'Parents'].map(aud => (
          <button
            key={aud}
            onClick={() => setFilterAudience(aud)}
            className={`px-3 py-1 font-semibold rounded-lg transition ${
              filterAudience === aud ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {aud}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.map(ann => (
          <div 
            key={ann.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-indigo-300 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{ann.title}</h3>
                  {getPriorityBadge(ann.priority)}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Author: <strong>{ann.authorName}</strong> ({ann.authorRole})</span>
                  <span>•</span>
                  <span>Target: <strong className="text-indigo-700">[{ann.targetAudience}]</strong></span>
                  <span>•</span>
                  <span>Posted: {ann.publishedDate}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (window.confirm('Delete this announcement?')) {
                    deleteAnnouncement(ann.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              {ann.content}
            </p>
          </div>
        ))}
      </div>

      {/* Compose Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                Compose Official Announcement
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule of 1st Quarter Examinations"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="All">All School (Everyone)</option>
                    <option value="Teachers">Faculty / Teachers Only</option>
                    <option value="Students">Students Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Grade7">Grade 7 Learners</option>
                    <option value="Grade8">Grade 8 Learners</option>
                    <option value="Grade9">Grade 9 Learners</option>
                    <option value="Grade10">Grade 10 Learners</option>
                    <option value="SpecificSection">Specific Section</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Normal">Normal Notice</option>
                    <option value="Important">Important Advisory</option>
                    <option value="Urgent">Urgent / Action Required</option>
                  </select>
                </div>
              </div>

              {targetAudience === 'SpecificSection' && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select Section</label>
                  <select
                    value={targetSectionId}
                    onChange={(e) => setTargetSectionId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>Grade {s.gradeLevel} - {s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Announcement Body Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide complete circular details, dates, venues, and reminders..."
                  className="w-full h-28 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Publish Announcement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
