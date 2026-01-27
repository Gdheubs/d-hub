import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Profile({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchUserPosts();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-8 mb-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
          {user.email[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.email}</h1>
          <p className="text-gray-400">Content Creator</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">My Uploads</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {post.type === 'video' ? (
              <video src={post.media_url} className="w-full h-48 object-cover" controls />
            ) : (
              <img src={post.media_url} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold truncate">{post.title}</h3>
              <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500">No uploads yet.</p>
        )}
      </div>
    </div>
  );
}
