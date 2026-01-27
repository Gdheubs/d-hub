import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SupportPanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*');
    if (error) console.error(error);
    else setPosts(data);
    setLoading(false);
  };

  const deletePost = async (postId) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    if (error) console.error(error);
    else fetchPosts();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support / Moderation Panel</h1>
      <p>Moderate content and handle user reports.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-800 p-4 rounded">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <button onClick={() => deletePost(post.id)} className="bg-red-500 text-white px-2 py-1 mt-2">Remove Inappropriate Content</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportPanel;