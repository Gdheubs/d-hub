import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, User, Video, Image, Upload, Edit, Trash2, Coins } from 'lucide-react';

export default function Profile({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPosts();
      fetchTokens();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setProfile(data);
  };

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  const fetchTokens = async () => {
    const { data } = await supabase
      .from('user_tokens')
      .select('balance')
      .eq('user_id', user.id)
      .single();
    setTokens(data?.balance || 0);
  };

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeletePost = async (postId) => {
    setDeleteConfirm(postId);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await supabase.from('posts').delete().eq('id', deleteConfirm);
      fetchPosts();
      setDeleteConfirm(null);
    }
  };

  const filteredPosts = posts.filter(post => post.type === activeTab.slice(0, -1)); // videos -> video, photos -> photo

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-blue-600/50 mb-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-400">{user.name || 'User'}</h1>
            <p className="text-gray-300 mt-2">{profile?.bio || 'No bio.'}</p>
            <p className="text-sm text-gray-400 mt-1">Role: {profile?.role || 'user'}</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{posts.length}</p>
                <p className="text-sm text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{tokens}</p>
                <p className="text-sm text-gray-400">Tokens</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'videos' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Video size={16} />
              Videos
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'photos' ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <Image size={16} />
              Photos
            </button>
            <button
              onClick={() => alert('Upload feature coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              <Upload size={16} />
              Upload
            </button>
            <button
              onClick={() => alert('Buy tokens feature coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
            >
              <Coins size={16} />
              Buy Tokens
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-gray-700/50 rounded-lg p-4">
                <img src={post.thumbnail_url || post.media_url} alt={post.title} className="w-full h-32 object-cover rounded mb-2" />
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-sm text-gray-400">{post.description}</p>
                <div className="flex justify-between mt-2">
                  <button className="text-blue-400 hover:text-blue-300">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeletePost(post.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg">
                <p>Are you sure you want to delete this post?</p>
                <div className="flex gap-4 mt-4">
                  <button onClick={confirmDelete} className="bg-red-600 px-4 py-2 rounded">Delete</button>
                  <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}