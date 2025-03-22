
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Book, Plus, Search, Filter, Eye, EyeOff, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import TaleCard from '@/components/TaleCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [tales, setTales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, public, private
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTales();
    }
  }, [status, router, filter]);
  
  const fetchTales = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/user`, 
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          },
          params: { visibility: filter !== 'all' ? filter : undefined }
        }
      );
      setTales(response.data);
    } catch (error) {
      console.error('Error fetching tales:', error);
      toast.error('Failed to load your tales');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleVisibility = async (taleId, currentVisibility) => {
    try {
      const newVisibility = currentVisibility === 'public' ? 'private' : 'public';
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${taleId}`,
        { isPublic: newVisibility === 'public' },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      // Update local state
      setTales(tales.map(tale => 
        tale._id === taleId 
          ? { ...tale, isPublic: newVisibility === 'public' } 
          : tale
      ));
      
      toast.success(`Tale is now ${newVisibility}`);
    } catch (error) {
      console.error('Error updating tale:', error);
      toast.error('Failed to update tale visibility');
    }
  };
  
  const deleteTale = async (taleId) => {
    if (!confirm('Are you sure you want to delete this tale? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/${taleId}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      // Update local state
      setTales(tales.filter(tale => tale._id !== taleId));
      toast.success('Tale deleted successfully');
    } catch (error) {
      console.error('Error deleting tale:', error);
      toast.error('Failed to delete tale');
    }
  };
  
  const filteredTales = tales.filter(tale => 
    tale.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tale.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Tales</h1>
          <p className="text-text-secondary mt-1">Manage and view all your created tales</p>
        </div>
        <Link href="/create" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
          <Plus size={20} />
          Create New Tale
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your tales..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="md:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={20} className="text-gray-400" />
            </div>
            <select
              className="input-field pl-10 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tales</option>
              <option value="public">Public Tales</option>
              <option value="private">Private Tales</option>
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
              ? "You haven't created any tales yet. Create your first tale to get started!"
              : "No tales match your search criteria. Try adjusting your search or filter."
          }
          actionLabel="Create Tale"
          actionHref="/create"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTales.map(tale => (
            <TaleCard
              key={tale._id}
              tale={tale}
              actions={
                <>
                  <button 
                    onClick={() => toggleVisibility(tale._id, tale.isPublic ? 'public' : 'private')}
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    title={tale.isPublic ? "Make Private" : "Make Public"}
                  >
                    {tale.isPublic ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <Link
                    href={`/edit/${tale._id}`}
                    className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    title="Edit Tale"
                  >
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => deleteTale(tale._id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Delete Tale"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
