import React from 'react';
import { Play, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VideoCard({ video }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/watch/${video.id}`)}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:transform hover:scale-105 transition-all duration-200"
    >
      <div className="relative aspect-video bg-black">
        {video.type === 'video' ? (
          <>
             {/* Use thumbnail if available, otherwise fallback to video element (poster) or a generic icon */}
            {video.thumbnail_url ? (
               <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                <Play size={48} />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
              <Play size={48} className="text-white fill-white" />
            </div>
          </>
        ) : (
          <img src={video.media_url} alt={video.title} className="w-full h-full object-cover" />
        )}
        
        {/* Premium Badge */}
        {video.is_premium && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            PREMIUM
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white truncate">{video.title}</h3>
        <div className="flex justify-between items-center mt-2 text-gray-400 text-sm">
          <span className="flex items-center gap-1">
            <Heart size={14} /> {video.likes || 0}
          </span>
          <span className="text-xs">
            {video.profiles?.name || 'Anonymous'}
          </span>
        </div>
      </div>
    </div>
  );
}
