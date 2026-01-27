import React from 'react';
import VideoCard from './VideoCard';

export default function VideoGrid({ videos, selectedVideoId, onSelectVideo, showTitle, viewedVideos = [] }) {
  // Smart recommendation: prioritize unwatched videos, then show watched ones
  const sortedVideos = [...videos].sort((a, b) => {
    const aWatched = viewedVideos.includes(a.id);
    const bWatched = viewedVideos.includes(b.id);
    
    // If one is watched and other isn't, unwatched comes first
    if (aWatched !== bWatched) {
      return aWatched ? 1 : -1;
    }
    
    // If both watched or both unwatched, sort by view count (higher first)
    const aViews = parseInt(a.views.replace(/[KM]/g, '').replace(/\s/g, ''));
    const bViews = parseInt(b.views.replace(/[KM]/g, '').replace(/\s/g, ''));
    return bViews - aViews;
  });
  
  const filteredVideos = sortedVideos.filter(video => video.id !== selectedVideoId);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-white mb-8">{showTitle}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => onSelectVideo(video)}
          />
        ))}
      </div>
    </section>
  );
}
