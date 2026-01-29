import React, { useState, useEffect, createContext, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Added Navigate
import { supabase } from './supabaseClient';
import Header from './components/Header';
import AgeVerificationModal from './components/AgeVerificationModal';
import VideoPlayer from './components/VideoPlayer';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';
import TermsModal from './components/TermsModal';
import AboutModal from './components/AboutModal';
import LoginSignup from './components/LoginSignup';
import UploadMedia from './components/UploadMedia';
import Profile from './components/Profile'; // ✅ IMPORT ADDED

export const AuthContext = createContext();

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem('ageVerified') === 'true';
  });
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [viewedVideos, setViewedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Load User Data Logic
  const loadUserData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: viewed } = await supabase.from('user_watch_history').select('video_id').eq('user_id', user.id);
      setViewedVideos(viewed?.map(v => v.video_id) || []);

      const { data: liked } = await supabase.from('user_likes').select('video_id').eq('user_id', user.id);
      setLikedVideos(liked?.map(l => l.video_id) || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [user]);

  // Fetch Posts Logic
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (postsError) throw postsError;

        if (postsData && postsData.length > 0) {
          const userIds = [...new Set(postsData.map(post => post.user_id))];
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, is_private')
            .in('id', userIds);

          const postsWithProfiles = postsData.map(post => ({
            ...post,
            profiles: profilesData?.find(profile => profile.id === post.user_id) || null
          }));
          setVideos(postsWithProfiles);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Auth Logic
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUserProfile(profile);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Real-time
  useEffect(() => {
    const likesSubscription = supabase
      .channel('public:user_likes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_likes' }, () => {
        if (user) loadUserData(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(likesSubscription);
    };
  }, [user, loadUserData]);

  useEffect(() => {
    if (user) loadUserData();
  }, [user, loadUserData]);

  const handleSelectVideo = async (video) => {
    setSelectedVideo(video);
    if (!viewedVideos.includes(video.id) && user) {
      setViewedVideos([...viewedVideos, video.id]);
      await supabase.from('user_watch_history').insert({ user_id: user.id, video_id: video.id });
    }
  };

  const handleLike = async (videoId) => {
    if (!likedVideos.includes(videoId) && user) {
      setLikedVideos([...likedVideos, videoId]);
      await supabase.from('user_likes').insert({ user_id: user.id, video_id: videoId });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setViewedVideos([]);
    setLikedVideos([]);
  };

  const handleLogin = (loginUser) => {
    setUser(loginUser);
  };
  
  const handleGuestVisit = () => {
    setUser({ id: 'guest', name: 'Guest User', isGuest: true });
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleLogin, logout: handleLogout }}>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
          {!ageVerified && <AgeVerificationModal onVerify={() => setAgeVerified(true)} />}
          {ageVerified && !user && !authLoading && <LoginSignup onLogin={handleLogin} onGuest={handleGuestVisit} />}
          {ageVerified && user && (
            <>
              <Header user={user} userProfile={userProfile} onLogout={handleLogout} />
              <Routes>
                {/* 1. New dedicated Upload Route */}
                <Route path="/upload" element={
                  <div className="pt-24 px-4 min-h-screen">
                     {user && !user.isGuest ? (
                       <UploadMedia user={user} />
                     ) : (
                       <div className="text-center mt-10">Guests cannot upload content.</div>
                     )}
                  </div>
                } />

                {/* 2. ✅ FIXED: Profile Route Added */}
                <Route path="/profile" element={
                  <div className="pt-24 px-4">
                    <Profile user={user} userProfile={userProfile} />
                  </div>
                } />

                {/* 3. Home Route (Upload removed) */}
                <Route path="/" element={
                  <main className="pt-20">
                    {/* UploadMedia REMOVED from here */}
                    
                    {selectedVideo ? (
                      <VideoPlayer 
                        video={selectedVideo} 
                        onClose={() => setSelectedVideo(null)}
                        user={user}
                        onLike={handleLike}
                      />
                    ) : (
                      <VideoGrid 
                        videos={videos}
                        selectedVideoId={null}
                        onSelectVideo={handleSelectVideo}
                        showTitle="Featured Videos"
                        viewedVideos={viewedVideos}
                      />
                    )}

                    {loading && <div className="text-center p-4">Loading content...</div>}
                    {error && <div className="text-center text-red-500 p-4">{error}</div>}
                  </main>
                } />
                
                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer onTermsClick={() => setShowTerms(true)} onAboutClick={() => setShowAbout(true)} />
              {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
              {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
            </>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
