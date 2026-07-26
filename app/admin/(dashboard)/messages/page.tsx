'use client';

import { useState, useEffect } from 'react';

interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const json = await res.json();
      setMessages(json.data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'UNREAD' ? 'READ' : 'UNREAD';
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMessages();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div>
        <h2 className="text-2xl font-bold font-sans text-[#091426]">
          Contact Form Submissions & Inbox
        </h2>
        <p className="text-xs text-gray-500 font-mono">View messages sent from your portfolio website contact form</p>
      </div>

      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-gray-500">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] text-center font-mono text-xs text-gray-500">
          No contact messages received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-xl border transition-all space-y-3 ${
                msg.status === 'UNREAD'
                  ? 'bg-white border-[#006591] shadow-xs'
                  : 'bg-[#f7f9fb] border-[#e0e3e5]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 font-sans text-base">{msg.senderName}</span>
                  <a href={`mailto:${msg.senderEmail}`} className="text-xs font-mono text-[#006591] hover:underline">
                    {msg.senderEmail}
                  </a>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[11px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleStatus(msg.id, msg.status)}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      msg.status === 'UNREAD'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {msg.status}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 font-sans text-sm">{msg.subject}</h4>
                <p className="text-sm text-gray-700 font-sans pt-1 leading-relaxed whitespace-pre-line">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
