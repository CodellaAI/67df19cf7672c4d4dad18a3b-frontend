
"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Sparkles, Book, ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CreateTale() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedTale, setGeneratedTale] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      title: '',
      ageRange: '3-5',
      topic: '',
      mainCharacter: '',
      setting: '',
      mood: 'happy',
      length: 'medium',
      moralLesson: '',
      isPublic: false
    }
  });
  
  const selectedAgeRange = watch('ageRange');
  const selectedLength = watch('length');
  
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  const onSubmit = async (data) => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales/generate`,
        {
          title: data.title,
          ageRange: data.ageRange,
          topic: data.topic,
          mainCharacter: data.mainCharacter,
          setting: data.setting,
          mood: data.mood,
          length: data.length,
          moralLesson: data.moralLesson
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      setGeneratedTale({
        ...response.data,
        title: data.title,
        ageRange: data.ageRange,
        topic: data.topic,
        isPublic: data.isPublic
      });
      
      toast.success('Tale generated successfully!');
    } catch (error) {
      console.error('Error generating tale:', error);
      toast.error('Failed to generate tale. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const saveTale = async () => {
    if (!generatedTale) return;
    
    setIsSaving(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tales`,
        {
          title: generatedTale.title,
          content: generatedTale.content,
          ageRange: generatedTale.ageRange,
          topic: generatedTale.topic,
          isPublic: generatedTale.isPublic
        },
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`
          }
        }
      );
      
      toast.success('Tale saved successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving tale:', error);
      toast.error('Failed to save tale. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const getLengthDescription = (length) => {
    switch (length) {
      case 'short':
        return 'A brief tale (3-5 minutes reading time)';
      case 'medium':
        return 'A standard tale (5-10 minutes reading time)';
      case 'long':
        return 'A detailed tale (10-15 minutes reading time)';
      default:
        return '';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-text-secondary hover:text-primary-600 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create a New Tale</h1>
        <p className="text-text-secondary mt-1">Customize your tale's details and let AI do the magic</p>
      </div>
      
      {!generatedTale ? (
        <div className="card max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
                Tale Title
              </label>
              <input
                id="title"
                type="text"
                className="input-field"
                placeholder="The Magical Forest Adventure"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="ageRange" className="block text-sm font-medium text-text-primary mb-1">
                Age Range
              </label>
              <select
                id="ageRange"
                className="input-field"
                {...register('ageRange', { required: 'Age range is required' })}
              >
                <option value="3-5">3-5 years (Preschool)</option>
                <option value="6-8">6-8 years (Early Elementary)</option>
                <option value="9-12">9-12 years (Late Elementary)</option>
              </select>
              <p className="mt-1 text-sm text-text-secondary">
                {selectedAgeRange === '3-5' && 'Simple language, shorter sentences, clear morals'}
                {selectedAgeRange === '6-8' && 'More complex vocabulary, longer stories, subtle lessons'}
                {selectedAgeRange === '9-12' && 'Advanced themes, character development, nuanced storytelling'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-text-primary mb-1">
                  Topic/Theme
                </label>
                <input
                  id="topic"
                  type="text"
                  className="input-field"
                  placeholder="Friendship, Adventure, Nature..."
                  {...register('topic', { required: 'Topic is required' })}
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="mainCharacter" className="block text-sm font-medium text-text-primary mb-1">
                  Main Character (Optional)
                </label>
                <input
                  id="mainCharacter"
                  type="text"
                  className="input-field"
                  placeholder="A brave lion, a curious girl..."
                  {...register('mainCharacter')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="setting" className="block text-sm font-medium text-text-primary mb-1">
                  Setting (Optional)
                </label>
                <input
                  id="setting"
                  type="text"
                  className="input-field"
                  placeholder="Enchanted forest, underwater kingdom..."
                  {...register('setting')}
                />
              </div>
              
              <div>
                <label htmlFor="mood" className="block text-sm font-medium text-text-primary mb-1">
                  Mood
                </label>
                <select
                  id="mood"
                  className="input-field"
                  {...register('mood')}
                >
                  <option value="happy">Happy & Uplifting</option>
                  <option value="adventurous">Adventurous & Exciting</option>
                  <option value="mysterious">Mysterious & Intriguing</option>
                  <option value="calm">Calm & Soothing</option>
                  <option value="funny">Funny & Silly</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-text-primary mb-1">
                Tale Length
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    value="short"
                    {...register('length')}
                  />
                  <span className="ml-2">Short</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    value="medium"
                    {...register('length')}
                  />
                  <span className="ml-2">Medium</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    value="long"
                    {...register('length')}
                  />
                  <span className="ml-2">Long</span>
                </label>
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                {getLengthDescription(selectedLength)}
              </p>
            </div>
            
            <div>
              <label htmlFor="moralLesson" className="block text-sm font-medium text-text-primary mb-1">
                Moral Lesson (Optional)
              </label>
              <input
                id="moralLesson"
                type="text"
                className="input-field"
                placeholder="Kindness matters, Honesty is important..."
                {...register('moralLesson')}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('isPublic')}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-text-primary">
                Make this tale public (others can see and like it)
              </label>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Tale...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Tale
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{generatedTale.title}</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  Age {generatedTale.ageRange}
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {generatedTale.topic}
                </span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              {generatedTale.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setGeneratedTale(null)}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Edit Parameters
            </button>
            
            <button
              onClick={saveTale}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  Save Tale
                </>
              )}
            </button>
            
            <button
              onClick={() => window.open(`/preview/${encodeURIComponent(JSON.stringify(generatedTale))}`, '_blank')}
              className="btn-secondary flex items-center justify-center gap-2 sm:w-auto"
            >
              <Eye size={20} />
              Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
