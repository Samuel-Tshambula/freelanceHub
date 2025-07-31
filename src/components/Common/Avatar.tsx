import { useState } from 'react';
import { User } from 'lucide-react';
import { getProfileImage } from '../../utils/profileUtils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (src && !imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        {isLoading && (
          <div className={`${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center animate-pulse`}>
            <User className={`${iconSizes[size]} text-gray-400`} />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover ${isLoading ? 'hidden' : 'block'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-blue-100 rounded-full flex items-center justify-center ${className}`}>
      <User className={`${iconSizes[size]} text-blue-600`} />
    </div>
  );
};

export default Avatar;