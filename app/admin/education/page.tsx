'use client';

import { useState, useEffect } from 'react';

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string | null;
  description?: string | null;
}

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    location: 'Bandung, Indonesia',
    startDate: '',
    endDate: '',
    isCurrent: false,
    grade: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/education');
      const json = await res.json();
      setEducations(json.data || []);
    } catch (err) {
      console.error('Failed to fetch education:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openCreateForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsEditing(true);
  };

  const openEditForm = (edu: EducationItem) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      location: edu.location || '',
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
      isCurrent: edu.isCurrent,
      grade: edu.grade || '',
      description: edu.description || '',
    });
    setEditingId(edu.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education record?')) return;
    try {
      await fetch(`/api/education/${id}`, { method: 'DELETE' });
      fetchEducation();
    } catch (err) {
      console.error('Failed to delete education:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/education/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setIsEditing(false);
      fetchEducation();
    } catch (err) {
      console.error('Failed to save education:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-sans text-[#091426]">
            Education Background Manager
          </h2>
          <p className="text-xs text-gray-500 font-mono">Manage degrees, academic institutions, and GPA grades</p>
        </div>

        {!isEditing && (
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-[#006591] hover:bg-[#091426] text-white font-semibold text-xs font-mono rounded-lg transition-colors shadow-xs"
          >
            + Add Education
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs space-y-6">
          <h3 className="font-bold text-lg text-[#091426] border-b border-gray-200 pb-3">
            {editingId ? 'Edit Education Background' : 'Add Education Background'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Institution *</label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Telkom University"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Degree *</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Software Engineering Associate"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Field of Study *</label>
              <input
                type="text"
                required
                value={formData.fieldOfStudy}
                onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                placeholder="Applied Software Engineering"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">GPA Grade</label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="GPA 3.71 / 4.00"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#091426] text-white rounded text-xs font-mono font-bold"
            >
              {editingId ? 'Update Education' : 'Save Education'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded text-xs font-mono"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center font-mono text-xs text-gray-500">Loading education data...</div>
          ) : (
            educations.map((edu) => (
              <div key={edu.id} className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#006591] block uppercase">{edu.institution}</span>
                  <h3 className="font-bold text-gray-900 text-base font-sans">{edu.degree} in {edu.fieldOfStudy}</h3>
                  {edu.grade && <p className="text-xs font-mono font-semibold text-[#00a291]">{edu.grade}</p>}
                </div>

                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <button
                    onClick={() => openEditForm(edu)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
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
