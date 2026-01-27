import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowLeft, User } from 'lucide-react';
import VideoGrid from './VideoGrid';

export default function CreatorProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
      } catch (err) {
        console.error('Error fetching creator data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white pt-20 flex items-center justify-center">
        <p>Loading creator profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white pt-20 flex items-center justify-center">
        <p>Error loading profile: {error || 'Profile not found'}</p>
      </div>
    );
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
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-blue-400">{profile.name || 'Creator'}</h1>
            <p className="text-gray-300 mt-2">{profile.bio || 'No bio available.'}</p>
          </div>
        </div>

        <VideoGrid
          videos={posts}
          selectedVideoId={null}
          onSelectVideo={() => {}}
          showTitle="Creator's Posts"
          viewedVideos={[]}
        />
      </div>
    </div>
  );
}