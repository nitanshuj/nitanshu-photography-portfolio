import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getLikeCount, incrementLike, decrementLike } from '@/lib/turso';

interface LikeButtonProps {
  imageId: string;
  className?: string;
  isAI?: boolean;
}

const LikeButton = ({ imageId, className = '', isAI = false }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load initial like count from Turso
    const loadLikeCount = async () => {
      try {
        const count = await getLikeCount(imageId, isAI);
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
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    const newIsLiked = !isLiked;

    try {
      // Update global like count in Turso
      let newCount;
      if (newIsLiked) {
        newCount = await incrementLike(imageId, isAI);
      } else {
        newCount = await decrementLike(imageId, isAI);
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
      type="button"
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 border-2 relative z-10 ${
        isLiked
          ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
          : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'} ${className}`}
      style={{
        pointerEvents: 'auto',
        position: 'relative',
        zIndex: 10,
        minWidth: '60px',
        minHeight: '36px'
      }}
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