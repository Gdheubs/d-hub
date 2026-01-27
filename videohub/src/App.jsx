import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import AgeVerificationModal from './components/AgeVerificationModal';
import VideoPlayer from './components/VideoPlayer';
import VideoGrid from './components/VideoGrid';
import Footer from './components/Footer';
import TermsModal from './components/TermsModal';
import AboutModal from './components/AboutModal';
import LoginSignup from './components/LoginSignup';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import ContentManagerPanel from './components/ContentManagerPanel';
import SupportPanel from './components/SupportPanel';
import TechnicalPanel from './components/TechnicalPanel';

export const AuthContext = createContext();

const SAMPLE_VIDEOS = [
  {
    id: 1,
    title: "The Future of Technology",
    description: "Explore the groundbreaking innovations shaping our world. From artificial intelligence to quantum computing, discover how technology is revolutionizing every aspect of our lives. This comprehensive documentary showcases the latest advancements and their real-world applications.",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop",
    videoUrl: "https://www.dropbox.com/s/YOUR-VIDEO-ID/video.mp4?dl=1",
    views: "2.4M",
    duration: "24:15",
    likes: "156K",
    dislikes: "3K"
  },
  {
    id: 2,
    title: "Journey Through the Mountains",
    description: "Experience breathtaking views of majestic mountain ranges across the globe. From the snow-capped peaks of the Himalayas to the rugged beauty of the Rocky Mountains, this visual masterpiece captures the raw power and serenity of nature at its finest.",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    videoUrl: "https://www.dropbox.com/s/YOUR-VIDEO-ID/mountains.mp4?dl=1",
    views: "1.8M",
    duration: "18:42",
    likes: "128K",
    dislikes: "2K"
  },
  {
    id: 3,
    title: "Ocean Wonders Revealed",
    description: "Dive deep into the mysteries of our oceans. Discover incredible marine life, from the smallest coral polyps to the largest whales. Learn about underwater ecosystems and the urgent conservation efforts needed to preserve our planet's most vital resource.",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=225&fit=crop",
    videoUrl: "https://www.dropbox.com/s/YOUR-VIDEO-ID/ocean.mp4?dl=1",
    views: "3.1M",
    duration: "22:58",
    likes: "189K",
    dislikes: "4K"
  },
  {
    id: 4,
    title: "Urban Life Chronicles",
    description: "Experience the pulse of modern cities around the world. From bustling streets of Tokyo to the historic avenues of Paris, witness how millions navigate, work, and thrive in urban landscapes. A celebration of human connection in the digital age.",
    thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=225&fit=crop",
    videoUrl: "https://www.dropbox.com/s/YOUR-VIDEO-ID/urban.mp4?dl=1",
    views: "2.9M",
    duration: "20:34",
    likes: "167K",
    "dislikes": "3.5K"
  }
];

export default function App() {
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
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
  const [watchHistory, setWatchHistory] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (postsError) throw postsError;

        if (postsData && postsData.length > 0) {
          // Fetch profiles for the post creators
          const userIds = [...new Set(postsData.map(post => post.user_id))];
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, is_private')
            .in('id', userIds);

          if (profilesError) {
            console.warn('Error fetching profiles:', profilesError);
          }

          // Combine posts with profile data
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
        // Fallback to sample videos
        setVideos(SAMPLE_VIDEOS);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedVideo]);

  useEffect(() => {
    localStorage.setItem('ageVerified', ageVerified);
  }, [ageVerified]);

  useEffect(() => {
    // Get initial session
      // Real-time comments and likes
      useEffect(() => {
        // Real-time comments subscription
        const commentsSubscription = supabase
          .channel('public:comments')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
            setComments((prev) => {
              if (payload.eventType === 'INSERT') {
                return [...prev, payload.new];
              } else if (payload.eventType === 'UPDATE') {
                return prev.map(c => c.id === payload.new.id ? payload.new : c);
              } else if (payload.eventType === 'DELETE') {
                return prev.filter(c => c.id !== payload.old.id);
              }
              return prev;
            });
          })
          .subscribe();

        // Real-time likes subscription
        const likesSubscription = supabase
          .channel('public:user_likes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'user_likes' }, (payload) => {
            // Refetch likes or update state as needed
            fetchLikedVideos();
          })
          .subscribe();

        return () => {
          supabase.removeChannel(commentsSubscription);
          supabase.removeChannel(likesSubscription);
        };
      }, []);
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setAuthLoading(false);
      }
    );
          

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Load user data from Supabase
      loadUserData();
    } else {
      setViewedVideos([]);
      setLikedVideos([]);
      setWatchHistory([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load viewed videos
      const { data: viewed } = await supabase
        .from('user_watch_history')
        .select('video_id')
        .eq('user_id', user.id);
      setViewedVideos(viewed?.map(v => v.video_id) || []);

      // Load liked videos
      const { data: liked } = await supabase
        .from('user_likes')
        .select('video_id')
        .eq('user_id', user.id);
      setLikedVideos(liked?.map(l => l.video_id) || []);

      // Load watch history
      const { data: history } = await supabase
        .from('user_watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(50);
      setWatchHistory(history || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSelectVideo = async (video) => {
    setSelectedVideo(video);
    if (!viewedVideos.includes(video.id) && user) {
      setViewedVideos([...viewedVideos, video.id]);
      // Save to Supabase
      await supabase
        .from('user_watch_history')
        .insert({
          user_id: user.id,
          video_id: video.id,
          watched_at: new Date().toISOString()
        });
    }
    if (user) {
      const historyEntry = {
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        watched_at: new Date().toISOString()
      };
      setWatchHistory(prev => [historyEntry, ...prev.filter(h => h.id !== video.id)].slice(0, 50));
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleLogin = (loginUser) => {
    setUser(loginUser);
    localStorage.setItem('desiHubUser', JSON.stringify(loginUser));
    const userData = localStorage.getItem(`desiHub_${loginUser.id}_viewed`);
    setViewedVideos(userData ? JSON.parse(userData) : []);
  };

  const handleLike = async (videoId) => {
    if (!likedVideos.includes(videoId) && user) {
      setLikedVideos([...likedVideos, videoId]);
      // Save to Supabase
      await supabase
        .from('user_likes')
        .insert({
          user_id: user.id,
          video_id: videoId
        });
      // Real-time update will be handled by subscription
    }
  };

  // Add comment
  const handleAddComment = async (videoId, text) => {
    if (user && text) {
      await supabase
        .from('comments')
        .insert({ user_id: user.id, video_id: videoId, text });
      // Real-time update will be handled by subscription
    }
  };

  const handleGuestVisit = () => {
    setUser({ id: 'guest', name: 'Guest User', isGuest: true });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setViewedVideos([]);
    setLikedVideos([]);
    setWatchHistory([]);
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
                <Route path="/" element={
                  <main className="pt-20">
                    {user && !user.isGuest && <UploadMedia user={user} />}
                    {selectedVideo && (
                      <VideoPlayer 
                        video={selectedVideo} 
                        onClose={handleCloseVideo}
                        user={user}
                        onLike={handleLike}
                      />
                    )}
                    {loading ? (
                      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                        <p className="text-white text-xl">Loading videos...</p>
                      </div>
                    ) : error ? (
                      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                        <p className="text-red-400 text-xl">Error loading videos: {error}</p>
                      </div>
                    ) : (
                      <VideoGrid 
                        videos={videos}
                        selectedVideoId={selectedVideo?.id}
                        onSelectVideo={handleSelectVideo}
                        showTitle={!selectedVideo ? "Featured Videos" : "More to Watch"}
                        viewedVideos={viewedVideos}
                      />
                    )}
                  </main>
                } />
              </Routes>
              <Footer 
                onTermsClick={() => setShowTerms(true)}
                onAboutClick={() => setShowAbout(true)}
              />
              {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
              {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
            </>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
