import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminPanel() {
  const [dropboxLink, setDropboxLink] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPremiumVideo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert Dropbox link to direct download link if necessary
      // e.g., changing 'www.dropbox.com' to 'dl.dropboxusercontent.com'
      let directLink = dropboxLink.replace('www.dropbox.com', 'dl.dropboxusercontent.com');

      const { error } = await supabase.from('posts').insert({
        title,
        media_url: directLink,
        type: 'video',
        is_premium: true, // This makes it appear in the Premium section
        description: 'Premium Dropbox Content'
      });

      if (error) throw error;
      alert('Premium video added!');
      setDropboxLink('');
      setTitle('');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Admin Control Panel</h1>
      
      <div className="bg-gray-700 p-6 rounded-lg border border-yellow-500/30">
        <h3 className="text-xl font-bold mb-4">Add Premium Dropbox Video</h3>
        <form onSubmit={handleAddPremiumVideo} className="space-y-4">
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-600"
          />
          <input
            type="text"
            placeholder="Paste Dropbox Link here..."
            value={dropboxLink}
            onChange={(e) => setDropboxLink(e.target.value)}
            className="w-full p-2 rounded bg-gray-900 border border-gray-600"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-yellow-600 text-black font-bold px-6 py-2 rounded hover:bg-yellow-500"
          >
            {loading ? 'Adding...' : 'Add to Premium Section'}
          </button>
        </form>
      </div>
    </div>
  );
}
