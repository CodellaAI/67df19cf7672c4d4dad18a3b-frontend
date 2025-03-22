
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, Book } from 'lucide-react';
import TaleCard from '@/components/TaleCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Explore() {
  const { data: session } = useSession();
  
  const [tales, setTales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('newest'); // newest, oldest, mostLiked
  const [ageFilter, setAgeFilter] = useState('all'); // all, 3-5, 6-8, 9-12
  
  useEffect(() => {
    fetchTales();
  }, [filter, ageFilter]);
  
  const fetchTales = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/public`,
        {
          params: { 
            sort: filter,
            ageRange: ageFilter !== 'all' ? ageFilter : undefined
          },
          headers: session?.user?.token ? {
            Authorization: `Bearer ${session.user.token}`
          } : {}
        }
      );
      setTales(response.data);
    } catch (error) {
      console.error('Error fetching tales:', error);
      toast.error('Failed to load tales');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLike = async (taleId, isLiked) => {
    if (!session) {
      toast.error('You need to be logged in to like tales');
      return;
    }
    
    try {
      if (isLiked) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${taleId}/like`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`
            }
          }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${taleId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`
            }
          }
        );
      }
      
      // Update local state
      setTales(tales.map(tale => {
        if (tale._id === taleId) {
          const likeCount = isLiked ? tale.likes - 1 : tale.likes + 1;
          return { 
            ...tale, 
            likes: likeCount,
            isLiked: !isLiked
          };
        }
        return tale;
      }));
    } catch (error) {
      console.error('Error liking tale:', error);
      toast.error('Failed to process your like');
    }
  };
  
  const filteredTales = tales.filter(tale => 
    tale.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tale.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Explore Tales</h1>
        <p className="text-text-secondary mt-1">Discover tales created by our community</p>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tales by title or topic..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={20} className="text-gray-400" />
              </div>
              <select
                className="input-field pl-10 appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              className="input-field appearance-none"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            >
              <option value="all">All Ages</option>
              <option value="3-5">Ages 3-5</option>
              <option value="6-8">Ages 6-8</option>
              <option value="9-12">Ages 9-12</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredTales.length === 0 ? (
        <EmptyState 
          icon={<Book size={48} />}
          title="No tales found"
          description={
            tales.length === 0
              ? "There are no public tales available yet. Be the first to share a tale!"
              : "No tales match your search criteria. Try adjusting your search or filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTales.map(tale => (
            <TaleCard
              key={tale._id}
              tale={tale}
              onLike={() => handleLike(tale._id, tale.isLiked)}
              showAuthor
            />
          ))}
        </div>
      )}
    </div>
  );
}
