import React, { useState } from 'react';
import { Play, Eye, ThumbsUp, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VideoCard({ video, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();


  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className={`bg-gray-800/50 border-2 rounded-lg overflow-hidden backdrop-blur transition-all duration-300 ${
        isHovered ? 'border-blue-400 transform scale-105 shadow-lg' : 'border-blue-600'
      }`}>
        {/* Thumbnail */}
        <div className="relative bg-black video-thumbnail overflow-hidden">
          <img
            src={video.thumbnail_url || video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Play Button Overlay */}
          {isHovered && video.type === 'video' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
              <div className="bg-black/60 rounded-full p-4">
                <Play size={48} className="text-white fill-white" />
              </div>
            </div>
          )}

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <Clock size={12} />
              {video.duration}
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="text-white font-bold line-clamp-2 mb-3 text-sm">
            {video.title}
          </h3>

          {video.profiles && (
            <button
              // ...existing code...
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-2 text-xs"
            >
              <User size={12} />
              {video.profiles.name || 'User'}
            </button>
          )}

          <div className="flex justify-between items-center text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{typeof video.views === 'number' ? video.views.toLocaleString() : video.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp size={14} />
              <span>{typeof video.likes === 'number' ? video.likes.toLocaleString() : video.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
