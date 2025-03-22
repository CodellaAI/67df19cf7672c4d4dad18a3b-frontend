
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Heart, Calendar, User, BookOpen } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TaleView() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [tale, setTale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (params.id) {
      fetchTale(params.id);
    }
  }, [params.id]);
  
  const fetchTale = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${id}`,
        {
          headers: session?.user?.token ? {
            Authorization: `Bearer ${session.user.token}`
          } : {}
        }
      );
      setTale(response.data);
    } catch (error) {
      console.error('Error fetching tale:', error);
      toast.error('Failed to load tale');
      router.push('/explore');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLike = async () => {
    if (!session) {
      toast.error('You need to be logged in to like tales');
      return;
    }
    
    try {
      if (tale.isLiked) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${tale._id}/like`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`
            }
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${tale._id}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`
            }
          }
        );
      }
      
      // Update local state
      setTale({
        ...tale,
        likes: tale.isLiked ? tale.likes - 1 : tale.likes + 1,
        isLiked: !tale.isLiked
      });
    } catch (error) {
      console.error('Error liking tale:', error);
      toast.error('Failed to process your like');
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!tale) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tale not found</h1>
        <p className="text-text-secondary mb-6">The tale you're looking for doesn't exist or may have been removed.</p>
        <Link href="/explore" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={20} />
          Back to Explore
        </Link>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/explore" className="inline-flex items-center text-text-secondary hover:text-primary-600 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Explore
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="card mb-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Age {tale.ageRange}
              </span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {tale.topic}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{tale.title}</h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary text-sm mb-6">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>By {tale.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(tale.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{tale.content.split(' ').length} words</span>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none mb-6">
            {tale.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="border-t border-gray-100 pt-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                tale.isLiked
                  ? 'text-rose-600 bg-rose-50 hover:bg-rose-100'
                  : 'text-text-secondary hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Heart size={20} className={tale.isLiked ? 'fill-rose-600' : ''} />
              <span>{tale.likes} {tale.likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
