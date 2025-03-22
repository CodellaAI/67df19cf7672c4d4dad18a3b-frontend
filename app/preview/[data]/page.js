
"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Preview() {
  const params = useParams();
  const router = useRouter();
  
  let tale;
  try {
    tale = JSON.parse(decodeURIComponent(params.data));
  } catch (error) {
    console.error('Error parsing tale data:', error);
    router.push('/create');
    return null;
  }
  
  if (!tale) {
    router.push('/create');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/create" className="inline-flex items-center text-text-secondary hover:text-primary-600 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Creator
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{tale.title}</h1>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Age {tale.ageRange}
              </span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {tale.topic}
              </span>
            </div>
          </div>
          
          <div className="prose max-w-none">
            {tale.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Link href="/create" className="btn-primary">
            Return to Editor
          </Link>
        </div>
      </div>
    </div>
  );
}
