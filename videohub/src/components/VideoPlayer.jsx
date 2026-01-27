import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Heart, MessageCircle, Send, ArrowLeft, Trash2 } from 'lucide-react';

export default function VideoPlayer({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideoDetails();
    fetchComments();
    if (user) checkUserLike();
    
    // Subscribe to realtime comments
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${id}` }, 
      (payload) => {
        // Fetch profile for the new comment to display name immediately
        fetchNewCommentProfile(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const fetchVideoDetails = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(name, avatar_url)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching video:', error);
      navigate('/');
    } else {
      setVideo(data);
      setLikes(data.likes || 0);
      
      // Increment View Count
      await supabase.rpc('increment_view', { row_id: id }); // *Requires RPC or simple update below*
      // Simple view update fallback
      await supabase.from('posts').update({ views: (data.views || 0) + 1 }).eq('id', id);
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(name, avatar_url)')
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    setComments(data || []);
  };

  const fetchNewCommentProfile = async (commentRecord) => {
    const { data } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', commentRecord.user_id)
      .single();
    
    const commentWithProfile = { ...commentRecord, profiles: data };
    setComments(prev => [commentWithProfile, ...prev]);
  };

  const checkUserLike = async () => {
    const { data } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle(); // Use maybeSingle to avoid 406 error if not found
    setHasLiked(!!data);
  };

  const handleLike = async () => {
    if (!user) return alert('Please login to like');

    if (hasLiked) {
      // Unlike
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLikes(prev => prev - 1);
      setHasLiked(false);
      await supabase.from('posts').update({ likes: likes - 1 }).eq('id', id);
    } else {
      // Like
      await supabase.from('post_likes').insert({ post_id: id, user_id: user.id });
      setLikes(prev => prev + 1);
      setHasLiked(true);
      await supabase.from('posts').update({ likes: likes + 1 }).eq('id', id);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: id,
        user_id: user.id,
        text: newComment
      });

    if (error) alert(error.message);
    else setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading Player...</div>;
  if (!video) return <div className="text-white text-center mt-10">Video not found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4 flex items-center gap-2">
        <ArrowLeft size={20} /> Back
      </button>

      {/* Media Player */}
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
        {video.type === 'video' ? (
          <video 
            src={video.media_url} 
            className="w-full max-h-[70vh] mx-auto" 
            controls 
            autoPlay 
          />
        ) : (
          <img src={video.media_url} alt={video.title} className="w-full max-h-[70vh] object-contain mx-auto" />
        )}
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
          <p className="text-gray-400 text-sm mb-4">
            Uploaded by <span className="text-blue-400">{video.profiles?.name}</span> • {new Date(video.created_at).toLocaleDateString()}
          </p>
          <div className="bg-gray-800 p-4 rounded-lg text-gray-300">
            {video.description || 'No description provided.'}
          </div>
        </div>

        {/* Actions & Comments */}
        <div className="space-y-6">
          {/* Like Button */}
          <button 
            onClick={handleLike}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
              hasLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <Heart className={hasLiked ? 'fill-white' : ''} />
            {hasLiked ? 'Liked' : 'Like'} ({likes})
          </button>

          {/* Comments Section */}
          <div className="bg-gray-800 rounded-lg p-4 h-[500px] flex flex-col">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageCircle size={20} /> Comments ({comments.length})
            </h3>
            
            {/* Comment List */}
            <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-700/50 p-3 rounded text-sm relative group">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-blue-400 text-xs mb-1 block">
                      {comment.profiles?.name || 'User'}
                    </span>
                    {user && user.id === comment.user_id && (
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-200">{comment.text}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-gray-500 text-center">No comments yet.</p>}
            </div>

            {/* Input */}
            {user ? (
              <form onSubmit={handleComment} className="relative">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-2 px-4 pr-10 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button type="submit" className="absolute right-2 top-2 text-blue-400 hover:text-blue-300">
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <p className="text-center text-sm text-gray-500">Log in to comment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
