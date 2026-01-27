import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginSignup from './components/LoginSignup';
import VideoGrid from './components/VideoGrid';
import UploadMedia from './components/UploadMedia';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import VideoPlayer from './components/VideoPlayer';

export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, profile }}>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header user={user} profile={profile} onLogout={handleLogout} />
          
          <main className="flex-grow pt-20 px-4 max-w-7xl mx-auto w-full">
            <Routes>
              {/* Home: Standard Feed */}
              <Route path="/" element={<HomeFeed isPremium={false} />} />
              
              {/* Premium: Admin/Dropbox Content */}
              <Route path="/premium" element={
                 user ? <HomeFeed isPremium={true} /> : <Navigate to="/" />
              } />

              {/* Upload Page */}
              <Route path="/upload" element={
                user ? <UploadMedia user={user} /> : <Navigate to="/" />
              } />

              {/* Profile Page */}
              <Route path="/profile" element={
                user ? <Profile user={user} isOwnProfile={true} /> : <Navigate to="/" />
              } />

              {/* Video Player Route */}
              <Route path="/watch/:id" element={<VideoPlayer user={user} />} />
              
              {/* Admin Panel */}
              <Route path="/admin" element={
                profile?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />
              } />
            </Routes>
          </main>
          
          <Footer />
          {!user && <LoginSignup />}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

// Helper Component for Feeds
function HomeFeed({ isPremium }) {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(name, avatar_url)')
        .eq('is_premium', isPremium)
        .order('created_at', { ascending: false });
      setVideos(data || []);
    };
    fetchVideos();
  }, [isPremium]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-blue-400">
        {isPremium ? "Premium Content (Dropbox)" : "Community Feed"}
      </h2>
      <VideoGrid videos={videos} />
    </div>
  );
}
  // You would need to implement fetching the specific video by ID here
  // passing it to your VideoPlayer component
  return <div>Video Player Loading...</div>; 
}
