import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function UploadMedia({ user }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('video');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
    setError(null);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${type}s/${user.id}/${Date.now()}_${file.name}`;
      let { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Upload Video or Photo</h2>
      <select value={type} onChange={handleTypeChange} className="mb-2 p-1 rounded">
        <option value="video">Video</option>
        <option value="photo">Photo</option>
      </select>
      <input type="file" accept={type === 'video' ? 'video/*' : 'image/*'} onChange={handleFileChange} className="mb-2" />
      <button onClick={handleUpload} disabled={uploading || !file} className="bg-blue-600 px-4 py-2 rounded text-white">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {success && <div className="text-green-400 mt-2">Upload successful!</div>}
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}
