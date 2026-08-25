'use client';

import { useState, useEffect } from 'react';

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  employmentType: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  order: number;
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    company: '',
    role: '',
    employmentType: 'FULL_TIME',
    location: 'Bandung, Indonesia',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievementsText: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiences');
      const json = await res.json();
      setExperiences(json.data || []);
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setFormError(null);
    setSubmitting(false);
    setIsEditing(true);
  };

  const openEditForm = (exp: ExperienceItem) => {
    setFormData({
      company: exp.company,
      role: exp.role,
      employmentType: exp.employmentType,
      location: exp.location || '',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      isCurrent: exp.isCurrent,
      description: exp.description,
      achievementsText: Array.isArray(exp.achievements) ? exp.achievements.join('\n') : '',
    });
    setEditingId(exp.id);
    setFormError(null);
    setSubmitting(false);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    try {
      await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      fetchExperiences();
    } catch (err) {
      console.error('Failed to delete experience:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const achievements = formData.achievementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      achievements,
    };

    try {
      const res = editingId
        ? await fetch(`/api/experiences/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/experiences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || json.message || 'Failed to save experience record.');
      }

      setIsEditing(false);
      fetchExperiences();
    } catch (err) {
      console.error('Failed to save experience:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save experience record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-sans text-[#091426]">
            Work Experience Manager
          </h2>
          <p className="text-xs text-gray-500 font-mono">Manage career history timeline and key achievements</p>
        </div>

        {!isEditing && (
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-[#006591] hover:bg-[#091426] text-white font-semibold text-xs font-mono rounded-lg transition-colors shadow-xs"
          >
            + Add Experience
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-[#091426] border-b border-gray-200 pb-3">
            {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
          </h3>

          {formError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-mono font-bold flex items-center justify-between">
              <span>⚠️ {formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-600 hover:text-rose-900 font-bold ml-2 text-sm"
              >
                ×
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Role Title *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">End Date</label>
              <input
                type="date"
                disabled={formData.isCurrent}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="currentJob"
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-4 h-4 text-[#006591]"
              />
              <label htmlFor="currentJob" className="text-xs font-mono text-gray-800 font-semibold">
                Current Role
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Description *</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Achievements (one bullet per line)</label>
            <textarea
              rows={4}
              value={formData.achievementsText}
              onChange={(e) => setFormData({ ...formData, achievementsText: e.target.value })}
              placeholder="Reduced app launch latency by 45%&#10;Architected declarative design system..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#091426] hover:bg-[#006591] text-white rounded text-xs font-mono font-bold disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving Experience...' : editingId ? 'Update Experience' : 'Save Experience'}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded text-xs font-mono disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center font-mono text-xs text-gray-500">Loading experiences...</div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-gray-900 font-sans">{exp.role}</span>
                    <span className="text-xs font-mono text-[#006591] font-semibold">@ {exp.company}</span>
                    <span className="text-[11px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 ml-auto sm:ml-0">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {' '}
                      {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-sans">{exp.description}</p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <button
                    onClick={() => openEditForm(exp)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
