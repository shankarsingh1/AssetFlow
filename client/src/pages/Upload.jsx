import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as assetApi from '../api/assetApi.js';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('art');
  const [tags, setTags] = useState('');
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Choose a file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', title);
      fd.append('description', description);
      fd.append('category', category);
      fd.append('tags', tags);
      const { asset } = await assetApi.uploadAsset(fd);
      navigate(`/assets/${asset._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Upload asset</h1>
      <p className="mt-1 text-ink-muted">Files up to 15 MB — images, audio, or PDF</p>

      <form onSubmit={handleSubmit} className="surface-card mt-8 space-y-6 p-8">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) setFile(f);
          }}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition duration-250 ${
            drag ? 'border-primary bg-primary/10' : 'border-line bg-card'
          }`}
        >
          <input
            type="file"
            className="hidden"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file" className="cursor-pointer text-sm text-ink-muted">
            Drag & drop or <span className="font-medium text-primary-darker underline">browse</span>
          </label>
          {file && <p className="mt-2 text-xs text-ink-faint">{file.name}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-ink-muted">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-muted">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-field mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-muted">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field mt-1"
          >
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="collectible">Collectible</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink-muted">Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="input-field mt-1" />
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
          {loading ? 'Uploading…' : 'Publish asset'}
        </button>
      </form>
    </div>
  );
}
