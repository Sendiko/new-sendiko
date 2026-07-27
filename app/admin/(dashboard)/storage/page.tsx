'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/ui/FileUpload';

interface StorageItem {
  key: string;
  url: string;
  size: number;
  lastModified: string;
}

export default function AdminStoragePage() {
  const [files, setFiles] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [uploadFolder, setUploadFolder] = useState<string>('uploads');
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string>('');
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const prefix = activeFolder === 'all' ? '' : `${activeFolder}/`;
      const res = await fetch(`/api/upload?prefix=${encodeURIComponent(prefix)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch storage items');
      }
      setFiles(json.data || []);
    } catch (err: any) {
      console.error('Error fetching storage list:', err);
      setError(err.message || 'Error connecting to MinIO object storage.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeFolder]);

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete "${key}" from MinIO?`)) return;

    setDeletingKey(key);
    try {
      const res = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete file');
      }
      setFiles((prev) => prev.filter((f) => f.key !== key));
    } catch (err: any) {
      alert(err.message || 'Error deleting file');
    } finally {
      setDeletingKey(null);
    }
  };

  const copyToClipboard = (text: string, keyIdentifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyIdentifier);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Object Storage & Media</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MinIO Active (Port 9002)
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage files stored on your MinIO object storage server. All media is proxied via Next.js API.
          </p>
        </div>

        <button
          onClick={fetchFiles}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Bucket
        </button>
      </div>

      {/* Upload Card Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Asset to MinIO
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-400">Target Folder:</span>
          {['uploads', 'projects', 'avatars', 'skills'].map((f) => (
            <button
              key={f}
              onClick={() => setUploadFolder(f)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors border ${
                uploadFolder === f
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              /{f}
            </button>
          ))}
        </div>

        <FileUpload
          value={lastUploadedUrl}
          onChange={(url) => {
            setLastUploadedUrl(url);
            fetchFiles();
          }}
          folder={uploadFolder}
          placeholder="Upload file to update media storage..."
        />
      </div>

      {/* Filter Tabs & Bucket Files Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex gap-2">
            {['all', 'uploads', 'projects', 'avatars', 'skills'].map((folder) => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeFolder === folder
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {folder.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {files.length} {files.length === 1 ? 'file' : 'files'} stored
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-900/60 rounded-xl border border-slate-800" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-slate-300 font-medium text-base">No files found in MinIO bucket</h3>
            <p className="text-slate-500 text-xs mt-1">Upload a file above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => {
              const isImg = file.key.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);

              return (
                <div
                  key={file.key}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col group transition-all"
                >
                  {/* Thumbnail */}
                  <div className="h-36 bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                    {isImg ? (
                      <img
                        src={file.url}
                        alt={file.key}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center gap-1">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] uppercase font-mono tracking-wider">
                          {file.key.split('.').pop() || 'FILE'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* File Metadata & Actions */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-200 truncate" title={file.key}>
                        {file.key}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>{formatBytes(file.size)}</span>
                        <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => copyToClipboard(file.url, file.key)}
                        className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors text-center"
                      >
                        {copiedKey === file.key ? 'Copied!' : 'Copy URL'}
                      </button>

                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                        title="View File"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      <button
                        onClick={() => handleDelete(file.key)}
                        disabled={deletingKey === file.key}
                        className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded text-xs font-medium transition-colors border border-red-500/20"
                        title="Delete Object"
                      >
                        {deletingKey === file.key ? (
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
