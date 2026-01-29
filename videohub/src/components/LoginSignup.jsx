import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function LoginSignup({ onLogin, onGuest }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!email || !password) {
          setError('Please fill in all fields');
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Auth state will be handled by the listener in App.jsx
      } else {
        // Signup
        if (!name || !email || !password) {
          setError('Please fill in all fields');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }

        const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: name,
    },
    // This tells Supabase to redirect back to the current domain (whether localhost or live)
    emailRedirectTo: window.location.origin 
  }
});
        if (error) throw error;
        setError('Check your email for the confirmation link!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 z-50 flex items-center justify-center pt-20">
      <div className="bg-gray-900/95 border-2 border-blue-600 rounded-lg p-8 max-w-md w-full mx-4 animate-slide-up">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-400">
          {isLogin ? 'Welcome Back' : 'Join DesiHub'}
        </h1>
        <p className="text-center text-gray-400 mb-6">
          {isLogin ? 'Log in to your account' : 'Create a new account'}
        </p>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Full Name</label>
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                <UserIcon size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-transparent text-white flex-1 outline-none placeholder-gray-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Email</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <Mail size={20} className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-transparent text-white flex-1 outline-none placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">Password</label>
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <Lock size={20} className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-transparent text-white flex-1 outline-none placeholder-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or</span>
          </div>
        </div>

        <button
          onClick={onGuest}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors duration-200 mb-4"
        >
          Continue as Guest
        </button>

        <p className="text-center text-gray-400 text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
