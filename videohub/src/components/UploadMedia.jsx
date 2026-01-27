import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function UploadMedia({ user }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('video');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !user || !title) return;

    setUploading(true);
    try {
      // 1. Upload File to Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${type}s/${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('media') // Ensure you created a bucket named 'media' in Supabase Dashboard
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // 3. Create Post Entry in Database
      const { error: dbError } = await supabase.from('posts').insert({
        user_id: user.id,
        title,
        description,
        type,
        media_url: urlData.publicUrl,
        is_premium: false // Regular uploads are never premium
      });

      if (dbError) throw dbError;

      navigate('/profile'); // Redirect to profile on success
    } catch (error) {
      alert('Error uploading: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Upload to Community</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="text" 
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={description} 
          onChange={e => setDescription(e.target.value)} 
        />
        <select 
          value={type} 
          onChange={e => setType(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="video">Video</option>
          <option value="photo">Photo</option>
        </select>
        <input 
          type="file" 
          accept={type === 'video' ? 'video/*' : 'image/*'} 
          onChange={e => setFile(e.target.files[0])}
          className="w-full text-gray-300" 
          required
        />
        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
