import React from 'react';
import { Play, Heart } from 'lucide-react';
// MessageCircle removed

export default function VideoCard({ video, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer group hover:transform hover:scale-105 transition-all duration-200 shadow-lg border border-gray-700 hover:border-blue-500"
    >
      <div className="relative aspect-video bg-black">
        {video.type === 'video' ? (
          <>
            {video.thumbnail_url ? (
               <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
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
        
        {video.is_premium && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
            PREMIUM
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-white truncate text-lg">{video.title}</h3>
        <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
          <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart size={16} /> {video.likes || 0}
          </span>
          <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
            {video.profiles?.name || 'Anonymous'}
          </span>
        </div>
      </div>
    </div>
  );
}