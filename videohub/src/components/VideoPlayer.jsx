import React, { useState } from 'react';
import { Eye, Share2, ThumbsUp } from 'lucide-react';

export default function VideoPlayer({ video, onClose, user, onLike }) {
  const [shareMessage, setShareMessage] = useState('');

  const convertDropboxUrl = (url) => {
    if (url.includes('dropbox.com')) {
      return url.replace('?dl=0', '?dl=1');
    }
    return url;
  };

  const handleShare = () => {
    const shareUrl = `${window.location.href}?video=${video.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareMessage('Link copied to clipboard!');
    
    // Track share action for registered users
    if (user?.id && !user.isGuest) {
      const shares = localStorage.getItem(`desiHub_${user.id}_shares`) || '0';
      localStorage.setItem(`desiHub_${user.id}_shares`, parseInt(shares) + 1);
    }
    
    setTimeout(() => setShareMessage(''), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gray-800/50 border-2 border-blue-600 rounded-lg overflow-hidden backdrop-blur animate-slide-up">
        {/* Video Player */}
        <div className="relative bg-black video-thumbnail">
          <video
            src={convertDropboxUrl(video.videoUrl)}
            controls
            className="w-full h-full"
            poster={video.thumbnail}
            preload="metadata"
            title={video.title}
          />
        </div>

        {/* Video Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{video.title}</h2>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <button className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-4 py-2 rounded-full transition-colors duration-200">
              <Eye size={20} />
              <span>{video.views}</span>
            </button>
            <button
              onClick={() => onLike && onLike(video.id)}
              className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-4 py-2 rounded-full transition-colors duration-200"
            >
              <ThumbsUp size={20} />
              <span>Like</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-4 py-2 rounded-full transition-colors duration-200"
            >
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>

          {shareMessage && (
            <p className="text-green-400 text-sm mb-4">{shareMessage}</p>
          )}

          {/* Description */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-4">
            <p className="text-gray-300 leading-relaxed">{video.description}</p>
          </div>
          
          {/* User Stats */}
          {user && !user.isGuest && (
            <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                ✓ Video added to your watch history
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
