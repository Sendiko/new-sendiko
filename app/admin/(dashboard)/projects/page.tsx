'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/ui/FileUpload';

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription?: string | null;
  challenge?: string | null;
  solution?: string | null;
  platform: 'IOS' | 'ANDROID' | 'CROSS_PLATFORM';
  status: string;
  featured: boolean;
  featuredOrder: number;
  coverImageUrl?: string | null;
  architecture?: string | null;
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  downloadsCount: number;
  rating: number;
  testCoverage?: number | null;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    slug: '',
    title: '',
    tagline: '',
    description: '',
    longDescription: '',
    challenge: '',
    solution: '',
    platform: 'CROSS_PLATFORM' as 'IOS' | 'ANDROID' | 'CROSS_PLATFORM',
    status: 'COMPLETED',
    featured: false,
    featuredOrder: 0,
    coverImageUrl: '',
    architecture: '',
    appStoreUrl: '',
    playStoreUrl: '',
    githubUrl: '',
    demoUrl: '',
    downloadsCount: 0,
    rating: 5.0,
    testCoverage: 90.0,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      setProjects(json.data || []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsEditing(true);
  };

  const openEditForm = (proj: ProjectItem) => {
    setFormData({
      slug: proj.slug,
      title: proj.title,
      tagline: proj.tagline,
      description: proj.description,
      longDescription: proj.longDescription || '',
      challenge: proj.challenge || '',
      solution: proj.solution || '',
      platform: proj.platform,
      status: proj.status,
      featured: proj.featured,
      featuredOrder: proj.featuredOrder,
      coverImageUrl: proj.coverImageUrl || '',
      architecture: proj.architecture || '',
      appStoreUrl: proj.appStoreUrl || '',
      playStoreUrl: proj.playStoreUrl || '',
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      downloadsCount: proj.downloadsCount || 0,
      rating: proj.rating || 5.0,
      testCoverage: proj.testCoverage || 90.0,
    });
    setEditingId(proj.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleToggleFeatured = async (proj: ProjectItem) => {
    const updatedFeatured = !proj.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, featured: updatedFeatured } : p))
    );
    try {
      await fetch(`/api/projects/${proj.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: updatedFeatured }),
      });
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
      fetchProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setIsEditing(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-sans text-[#091426]">
            Projects & Case Studies Manager
          </h2>
          <p className="text-xs text-gray-500 font-mono">Create, update, or remove portfolio showcase projects</p>
        </div>

        {!isEditing && (
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-[#006591] hover:bg-[#091426] text-white font-semibold text-xs font-mono rounded-lg transition-colors shadow-xs"
          >
            + Create New Project
          </button>
        )}
      </div>

      {/* Modal / Form view */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#e0e3e5] shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h3 className="font-bold text-lg text-[#091426]">
              {editingId ? 'Edit Project' : 'Create New Project'}
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs font-mono text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Project Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="my-cool-app"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Tagline *</label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Short Description *</label>
            <textarea
              rows={2}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden"
            />
          </div>

          {/* The Challenge & The Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 bg-rose-50/50 p-4 rounded-lg border border-rose-200">
              <label className="block text-xs font-mono font-bold text-rose-800 uppercase">🔴 The Challenge</label>
              <textarea
                rows={3}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                placeholder="Describe the operational or technical bottleneck..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden bg-white"
              />
            </div>

            <div className="space-y-1 bg-emerald-50/50 p-4 rounded-lg border border-emerald-200">
              <label className="block text-xs font-mono font-bold text-emerald-800 uppercase">🟢 The Solution</label>
              <textarea
                rows={3}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                placeholder="Describe the engineering resolution..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm outline-hidden bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as typeof formData.platform })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="IOS">iOS Native</option>
                <option value="ANDROID">Android Native</option>
                <option value="CROSS_PLATFORM">Cross-Platform</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="COMPLETED">Completed</option>
                <option value="IN_DEVELOPMENT">In Development</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-700">Architecture</label>
              <input
                type="text"
                value={formData.architecture}
                onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                placeholder="Clean Architecture + MVVM"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                role="switch"
                aria-checked={formData.featured}
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.featured ? 'bg-[#006591]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    formData.featured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div>
                <label
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className="block text-xs font-mono font-bold text-gray-900 cursor-pointer select-none"
                >
                  Featured Project Showcase
                </label>
                <p className="text-[11px] text-gray-500 font-mono">Highlight this project on the homepage featured section</p>
              </div>
            </div>

            {formData.featured && (
              <div className="flex items-center space-x-2">
                <label className="text-xs font-mono text-gray-700 font-medium">Featured Order:</label>
                <input
                  type="number"
                  min={0}
                  value={formData.featuredOrder}
                  onChange={(e) => setFormData({ ...formData, featuredOrder: parseInt(e.target.value) || 0 })}
                  className="w-20 px-3 py-1 border border-gray-300 rounded text-xs bg-white font-mono font-semibold"
                />
              </div>
            )}
          </div>

          <div className="space-y-1 pt-2 border-t border-gray-200">
            <FileUpload
              label="Cover Image (MinIO Storage)"
              value={formData.coverImageUrl}
              onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
              folder="projects"
              placeholder="Upload to MinIO or paste image URL..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#091426] text-white rounded text-xs font-mono font-bold"
            >
              {editingId ? 'Update Project' : 'Save Project'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-[#e0e3e5] text-gray-700 rounded text-xs font-mono"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Projects Table View */
        <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-xs overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center font-mono text-xs text-gray-500">Loading projects...</div>
          ) : (
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#f7f9fb] border-b border-gray-200 font-mono text-gray-500 uppercase">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Platform</th>
                  <th className="p-4">Downloads</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50/80">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{proj.title}</div>
                      <div className="text-gray-400 font-mono text-[11px]">{proj.slug}</div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-[#006591]">
                      {proj.platform}
                    </td>
                    <td className="p-4 font-mono">
                      {proj.downloadsCount ? `${proj.downloadsCount.toLocaleString()}+` : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={proj.featured}
                          onClick={() => handleToggleFeatured(proj)}
                          title={proj.featured ? 'Click to unfeature' : 'Click to feature'}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            proj.featured ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              proj.featured ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="font-mono text-xs">
                          {proj.featured ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              YES ({proj.featuredOrder})
                            </span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2 font-mono">
                      <button
                        onClick={() => openEditForm(proj)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}
