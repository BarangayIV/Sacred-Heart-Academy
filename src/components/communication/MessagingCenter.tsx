import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus, 
  User, 
  Paperclip, 
  CheckCheck, 
  Clock, 
  AlertCircle,
  X,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MessageThread } from '../../types';

export const MessagingCenter: React.FC = () => {
  const { 
    currentRole, 
    currentUser, 
    currentTeacher, 
    currentStudent, 
    messageThreads, 
    sendMessage, 
    createMessageThread,
    teachers, 
    students,
    schoolProfile 
  } = useApp();

  const [activeThreadId, setActiveThreadId] = useState<string>(messageThreads[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  // New Thread Modal state
  const [composeRecipientType, setComposeRecipientType] = useState<'Teacher' | 'Admin' | 'Parent'>('Teacher');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeInitialMessage, setComposeInitialMessage] = useState('');

  const activeThread = messageThreads.find(t => t.id === activeThreadId) || messageThreads[0];

  const filteredThreads = messageThreads.filter(t => {
    return (
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.participantNames.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeThread) return;

    let senderName = currentUser.name;
    let senderRole = currentRole as 'Admin' | 'Teacher' | 'Parent' | 'Student';

    if (currentRole === 'Teacher' && currentTeacher) {
      senderName = currentTeacher.name;
    } else if (currentRole === 'Parent' && currentStudent) {
      senderName = currentStudent.parentName;
    } else if (currentRole === 'Student' && currentStudent) {
      senderName = currentStudent.fullName;
    }

    sendMessage(activeThread.id, newMessageText, senderName, senderRole);
    setNewMessageText('');
  };

  const handleStartNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeInitialMessage.trim()) return;

    let senderName = currentUser.name;
    let senderRole = currentRole as 'Admin' | 'Teacher' | 'Parent' | 'Student';
    let recipientName = 'School Administration';
    let studentId = currentStudent?.id || students[0]?.id || 'st-1';
    let studentName = currentStudent?.fullName || students[0]?.fullName || 'Learner';

    if (composeRecipientType === 'Teacher') {
      const teacher = teachers.find(t => t.id === selectedRecipientId) || teachers[0];
      recipientName = teacher.name;
    } else if (composeRecipientType === 'Parent') {
      const student = students.find(s => s.id === selectedRecipientId) || students[0];
      recipientName = `${student.parentName} (${student.fullName}'s Parent)`;
      studentId = student.id;
      studentName = student.fullName;
    }

    createMessageThread({
      subject: composeSubject,
      studentId,
      studentName,
      participantIds: [currentUser.id, selectedRecipientId || 'rec-1'],
      participantNames: [senderName, recipientName],
      initialMessage: composeInitialMessage,
      senderName,
      senderRole,
    });

    setIsComposeModalOpen(false);
    setComposeSubject('');
    setComposeInitialMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Teacher-Parent Communications & Consultation Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct, documented messaging for academic inquiries, progress updates, attendance excuses, and guidance.
          </p>
        </div>

        <button
          onClick={() => setIsComposeModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Main Split Chat Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Sidebar: Threads List */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/40">
          
          {/* Search Box */}
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations, learners, teachers..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active conversations found.
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isActive = thread.id === activeThread?.id;
                const lastMsg = thread.messages[thread.messages.length - 1];

                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-3.5 transition flex flex-col gap-1.5 ${
                      isActive ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {thread.subject}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                        {thread.lastUpdated}
                      </span>
                    </div>

                    <div className="text-[11px] text-indigo-700 font-medium truncate">
                      Learner: {thread.studentName}
                    </div>

                    <div className="text-xs text-slate-500 line-clamp-1">
                      <span className="font-semibold text-slate-700">{lastMsg?.senderName}: </span>
                      {lastMsg?.text}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Message Stream */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {activeThread ? (
            <>
              {/* Active Conversation Top Banner */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{activeThread.subject}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-indigo-700">Learner: {activeThread.studentName}</span>
                    <span>•</span>
                    <span>Participants: {activeThread.participantNames.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px]">
                {activeThread.messages.map(msg => {
                  const isMe = 
                    (currentRole === 'Admin' && msg.senderRole === 'Admin') ||
                    (currentRole === 'Teacher' && msg.senderRole === 'Teacher') ||
                    (currentRole === 'Parent' && msg.senderRole === 'Parent');

                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 px-1">
                        <span className="font-semibold text-slate-800">{msg.senderName}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-mono text-slate-600">
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">• {msg.timestamp}</span>
                      </div>

                      <div className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-lg leading-relaxed shadow-2xs ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-xs' 
                          : 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200/60'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Send Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 flex items-center gap-2 bg-slate-50/50">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type official message or parent reply here..."
                  className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">Select a conversation thread to view messages.</p>
            </div>
          )}
        </div>

      </div>

      {/* New Conversation Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Start Parent-Teacher Conversation
              </h3>
              <button onClick={() => setIsComposeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartNewThread} className="space-y-4 pt-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Recipient Type</label>
                  <select
                    value={composeRecipientType}
                    onChange={(e) => setComposeRecipientType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Teacher">Subject Teacher / Adviser</option>
                    <option value="Parent">Student Parent / Guardian</option>
                    <option value="Admin">Principal / Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select Recipient</label>
                  {composeRecipientType === 'Teacher' ? (
                    <select
                      value={selectedRecipientId}
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.subjects[0]})</option>
                      ))}
                    </select>
                  ) : composeRecipientType === 'Parent' ? (
                    <select
                      value={selectedRecipientId}
                      onChange={(e) => setSelectedRecipientId(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.parentName} ({s.fullName}'s Parent)</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={schoolProfile.principalName}
                      className="w-full p-2 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-700"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Conversation Topic / Subject</label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="e.g. 1st Quarter Mathematics Progress & Consultation Request"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Initial Message</label>
                <textarea
                  value={composeInitialMessage}
                  onChange={(e) => setComposeInitialMessage(e.target.value)}
                  placeholder="Good day! I would like to inquire about..."
                  className="w-full h-28 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Send Conversation Request
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
