import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { User, Settings, Grid, Heart, Clock } from 'lucide-react';
import VideoGrid from './VideoGrid';

export default function Profile({ user, userProfile }) {
  const [activeTab, setActiveTab] = useState('videos'); // 'videos', 'liked', 'history'
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserContent = useCallback(async () => {
    setLoading(true);
    try {
      let data, error;

      if (activeTab === 'videos') {
        // Fetch videos uploaded by this user
        const result = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        data = result.data;
        error = result.error;
      } 
      // You can expand this for 'liked' and 'history' later
      
      if (error) throw error;
      
      // Attach profile info to videos (required for VideoGrid)
      const videosWithProfile = data?.map(post => ({
        ...post,
        profiles: userProfile
      })) || [];

      setUserVideos(videosWithProfile);
    } catch (err) {
      console.error('Error fetching profile content:', err);
      setUserVideos([]); // Set empty array on error to prevent crashes
    } finally {
      setLoading(false);
    }
  }, [activeTab, user?.id, userProfile]);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user, fetchUserContent]);

  if (!user) return <div className="text-center mt-20 text-white">Please log in to view profile.</div>;

  // Add debugging
  console.log('Profile loaded - User:', user?.id, 'Profile:', userProfile, 'Videos:', userVideos.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-8 mb-8 border border-gray-700 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-gray-900 shadow-xl">
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.name?.charAt(0).toUpperCase() || <User size={48} />
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">{user?.name || 'User'}</h1>
          <p className="text-gray-400 mb-4">{user?.email || 'No email'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
              <span className="block text-xl font-bold text-blue-400">{userVideos.length}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Uploads</span>
            </div>
            <div className="bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
              <span className="block text-xl font-bold text-blue-400">0</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Followers</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
          <Settings size={20} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'videos' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >
          <Grid size={20} /> My Uploads
        </button>
        <button 
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'liked' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >
          <Heart size={20} /> Liked
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white'}`}
        >
          <Clock size={20} /> History
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading content...</div>
      ) : userVideos.length > 0 ? (
        <VideoGrid 
          videos={userVideos} 
          onSelectVideo={(video) => console.log('Selected:', video)} 
          showTitle="" 
        />
      ) : (
        <div className="text-center py-20 bg-gray-800/30 rounded-lg border border-gray-800">
          <div className="text-gray-500 mb-2">No videos found</div>
          <p className="text-sm text-gray-600">Upload your first video to see it here!</p>
        </div>
      )}
    </div>
  );
}
