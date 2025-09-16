import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getLikeCount, incrementLike, decrementLike } from '@/lib/turso';

interface LikeButtonProps {
  imageId: string;
  className?: string;
}

const LikeButton = ({ imageId, className = '' }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load initial like count from Turso
    const loadLikeCount = async () => {
      try {
        const count = await getLikeCount(imageId);
        setLikeCount(count);

        // Check localStorage for user's like status
        const savedLikes = localStorage.getItem('user-likes');
        if (savedLikes) {
          const userLikes = JSON.parse(savedLikes);
          setIsLiked(userLikes[imageId] || false);
        }
      } catch (error) {
        console.error('Error loading like count:', error);
      }
    };

    loadLikeCount();
  }, [imageId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening lightbox when clicking like button

    if (isLoading) return; // Prevent double-clicks

    setIsLoading(true);
    const newIsLiked = !isLiked;

    try {
      // Update global like count in Turso
      let newCount;
      if (newIsLiked) {
        newCount = await incrementLike(imageId);
      } else {
        newCount = await decrementLike(imageId);
      }

      // Update user's local like status
      const savedLikes = localStorage.getItem('user-likes');
      const userLikes = savedLikes ? JSON.parse(savedLikes) : {};
      userLikes[imageId] = newIsLiked;
      localStorage.setItem('user-likes', JSON.stringify(userLikes));

      // Update UI
      setIsLiked(newIsLiked);
      setLikeCount(newCount);
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setIsLiked(isLiked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
        isLiked
          ? 'bg-red-500/90 text-white hover:bg-red-600/90'
          : 'bg-black/50 text-white hover:bg-black/70'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <Heart
        size={16}
        className={`transition-transform duration-200 ${
          isLiked ? 'fill-current scale-110' : 'hover:scale-110'
        } ${isLoading ? 'animate-pulse' : ''}`}
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
};

export default LikeButton;