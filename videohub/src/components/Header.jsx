import React, { useState } from 'react';
import { LogOut, User, Settings, HelpCircle, MessageSquare, Shield, FileText, Headphones, Wrench, PlusSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ user, userProfile, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownOpen(false);
  };
  
  // New handler for Upload page
  const handleUploadClick = () => {
    navigate('/upload');
  };

  const handleHelpCenter = () => {
    setDropdownOpen(false);
    alert('Help Center - Coming Soon!');
  };

  const handleFAQ = () => {
    setDropdownOpen(false);
    alert('FAQ - Coming Soon!');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
    setDropdownOpen(false);
  };

  const handleContentPanel = () => {
    navigate('/content');
    setDropdownOpen(false);
  };

  const handleSupportPanel = () => {
    navigate('/support');
    setDropdownOpen(false);
  };

  const handleTechnicalPanel = () => {
    navigate('/technical');
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur border-b-2 border-blue-600 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-blue-600/50 hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm">{user.name} {user.isGuest && '(Guest)'}</span>
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-blue-600/50 rounded-lg shadow-lg z-50 animate-slide-in-left">
                  <div className="py-1">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    {userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? (
                      <button
                        onClick={handleAdminPanel}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                      >
                        <Shield size={16} />
                        Admin Panel
                      </button>
                    ) : null}
                    {userProfile?.role === 'content_manager' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? (
                      <button
                        onClick={handleContentPanel}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                      >
                        <FileText size={16} />
                        Content Panel
                      </button>
                    ) : null}
                    {userProfile?.role === 'support' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? (
                      <button
                        onClick={handleSupportPanel}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                      >
                        <Headphones size={16} />
                        Support Panel
                      </button>
                    ) : null}
                    {userProfile?.role === 'technical' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? (
                      <button
                        onClick={handleTechnicalPanel}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                      >
                        <Wrench size={16} />
                        Technical Panel
                      </button>
                    ) : null}
                    <button
                      onClick={handleHelpCenter}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                    >
                      <HelpCircle size={16} />
                      Help Center
                    </button>
                    <button
                      onClick={handleFAQ}
                      className="flex items-center gap-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors"
                    >
                      <MessageSquare size={16} />
                      FAQ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex justify-center">
          <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-blue-400">Desi</span>
            <span className="text-white">Hub</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
           {/* New Upload Button */}
           {user && !user.isGuest && (
            <button
              onClick={handleUploadClick}
              className="hidden md:flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 transition-colors"
              title="Create Post"
            >
              <PlusSquare size={20} className="text-blue-400" />
              <span>Create</span>
            </button>
          )}

          {/* Mobile Upload Icon */}
          {user && !user.isGuest && (
             <button
             onClick={handleUploadClick}
             className="md:hidden p-2 text-white hover:text-blue-400"
           >
             <PlusSquare size={24} />
           </button>
          )}

          <a
            href="https://desihub.store"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 hidden sm:block"
          >
            Store
          </a>
          
          {user && (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
