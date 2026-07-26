'use client';

import { useState, useEffect } from 'react';

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    avatarUrl: '',
    location: '',
    yearsExperience: 5,
    appsPublished: 12,
    totalDownloads: 250000,
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    email: '',
    availableForHire: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (json.data) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      setMessage('Profile updated successfully!');
    } catch (err: unknown) {
      console.error(err);
      setMessage(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-mono text-sm text-gray-500">Loading profile data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-sans text-[#091426]">
          Developer Profile & Information
        </h2>
        {message && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono text-xs rounded font-semibold">
            {message}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Primary Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
            Headline / Role Title *
          </label>
          <input
            type="text"
            required
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
            Short Bio *
          </label>
          <textarea
            rows={4}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={formData.avatarUrl || ''}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Years of Exp
            </label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Apps Shipped
            </label>
            <input
              type="number"
              value={formData.appsPublished}
              onChange={(e) => setFormData({ ...formData, appsPublished: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Total Downloads
            </label>
            <input
              type="number"
              value={formData.totalDownloads}
              onChange={(e) => setFormData({ ...formData, totalDownloads: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              GitHub URL
            </label>
            <input
              type="text"
              value={formData.githubUrl || ''}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={formData.linkedinUrl || ''}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-gray-700 uppercase">
              Twitter / X URL
            </label>
            <input
              type="text"
              value={formData.twitterUrl || ''}
              onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#006591] outline-hidden"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="hireStatus"
            type="checkbox"
            checked={formData.availableForHire}
            onChange={(e) => setFormData({ ...formData, availableForHire: e.target.checked })}
            className="w-4 h-4 text-[#006591] rounded border-gray-300"
          />
          <label htmlFor="hireStatus" className="text-sm font-semibold text-[#091426]">
            Available for Hire / Consulting Roles
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#091426] hover:bg-[#006591] text-white font-semibold text-sm rounded-lg transition-colors shadow-xs"
        >
          {saving ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>

      </form>
    </div>
  );
}
