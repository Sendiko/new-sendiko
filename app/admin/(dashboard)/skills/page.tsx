'use client';

import { useState, useEffect } from 'react';

interface SkillItem {
  id: string;
  name: string;
  yearsOfExp?: number | null;
  featured: boolean;
  order: number;
}

interface CategoryItem {
  id: string;
  name: string;
  skills: SkillItem[];
}

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [newSkill, setNewSkill] = useState({
    categoryId: '',
    name: '',
    yearsOfExp: 3.0,
    featured: false,
  });

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skills');
      const json = await res.json();
      setCategories(json.data || []);
      if (json.data && json.data.length > 0 && !newSkill.categoryId) {
        setNewSkill((prev) => ({ ...prev, categoryId: json.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.categoryId || !newSkill.name) return;

    try {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      });

      setNewSkill({ ...newSkill, name: '' });
      fetchSkills();
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      fetchSkills();
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div>
        <h2 className="text-2xl font-bold font-sans text-[#091426]">
          Skills & Tech Stack Manager
        </h2>
        <p className="text-xs text-gray-500 font-mono">Manage categories, skills, and experience metrics</p>
      </div>

      {/* Add Skill Form */}
      <form onSubmit={handleAddSkill} className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
        <h3 className="font-bold text-sm font-sans text-[#091426] uppercase font-mono">
          + Add New Technology Skill
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Category *</label>
            <select
              value={newSkill.categoryId}
              onChange={(e) => setNewSkill({ ...newSkill, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Skill Name *</label>
            <input
              type="text"
              required
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="e.g. Swift, Jetpack Compose"
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-mono text-gray-700">Years of Exp</label>
            <input
              type="number"
              step="0.5"
              value={newSkill.yearsOfExp || 0}
              onChange={(e) => setNewSkill({ ...newSkill, yearsOfExp: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-hidden"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-[#091426] text-white font-mono font-bold text-xs rounded hover:bg-[#006591]"
            >
              Add Skill
            </button>
          </div>
        </div>
      </form>

      {/* Categories & Skills Display */}
      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-gray-500">Loading skills...</div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-xs space-y-4">
              <h3 className="font-bold text-base font-sans text-[#091426] border-b border-gray-100 pb-2">
                {cat.name} ({cat.skills.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg bg-[#f7f9fb] border border-gray-200 flex items-center justify-between font-mono text-xs"
                  >
                    <div>
                      <span className="font-bold text-gray-900">{s.name}</span>
                      {s.yearsOfExp && (
                        <span className="text-gray-400 font-normal ml-2 text-[11px]">
                          ({s.yearsOfExp} yrs)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-0.5"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
