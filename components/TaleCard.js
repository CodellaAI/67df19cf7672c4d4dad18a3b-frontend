
import Link from 'next/link';
import { Heart, Clock } from 'lucide-react';

export default function TaleCard({ tale, actions, onLike, showAuthor = false }) {
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <div className="card card-hover flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
            Age {tale.ageRange}
          </span>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
            {tale.topic}
          </span>
          {tale.isPublic === false && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Private
            </span>
          )}
        </div>
        
        <Link href={`/tale/${tale._id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary-600 transition-colors">
            {tale.title}
          </h3>
        </Link>
        
        {showAuthor && tale.author && (
          <p className="text-sm text-text-secondary mb-2">
            By {tale.author.name}
          </p>
        )}
        
        <p className="text-text-secondary mb-4">
          {truncateText(tale.content)}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-text-secondary">
          <Clock size={16} className="mr-1" />
          <span>{formatDate(tale.createdAt)}</span>
        </div>
        
        <div className="flex items-center">
          {onLike ? (
            <button 
              onClick={onLike}
              className={`flex items-center gap-1 p-2 rounded-md transition-colors ${
                tale.isLiked
                  ? 'text-rose-600'
                  : 'text-text-secondary hover:text-rose-600'
              }`}
            >
              <Heart size={18} className={tale.isLiked ? 'fill-rose-600' : ''} />
              <span>{tale.likes}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-text-secondary">
              <Heart size={18} />
              <span>{tale.likes}</span>
            </div>
          )}
          
          {actions && (
            <div className="flex items-center ml-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
