
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Book, Sparkles, User, LogOut, BookOpen, Grid } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };
  
  const isActive = (path) => {
    return pathname === path;
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Book className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold">Tale Weaver</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/explore" 
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                isActive('/explore') ? 'text-primary-600' : 'text-text-primary'
              }`}
            >
              Explore Tales
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    isActive('/dashboard') ? 'text-primary-600' : 'text-text-primary'
                  }`}
                >
                  My Dashboard
                </Link>
                
                <Link 
                  href="/create" 
                  className="btn-primary flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Create Tale
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-text-secondary hover:text-primary-600 transition-colors flex items-center gap-1"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-text-primary hover:text-primary-600 transition-colors"
                >
                  Log In
                </Link>
                
                <Link 
                  href="/signup" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-text-primary hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link 
              href="/explore" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-50 ${
                isActive('/explore') ? 'text-primary-600 bg-primary-50' : 'text-text-primary'
              }`}
              onClick={closeMenu}
            >
              <BookOpen size={20} className="mr-3" />
              Explore Tales
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-50 ${
                    isActive('/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-text-primary'
                  }`}
                  onClick={closeMenu}
                >
                  <Grid size={20} className="mr-3" />
                  My Dashboard
                </Link>
                
                <Link 
                  href="/create" 
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-50 ${
                    isActive('/create') ? 'text-primary-600 bg-primary-50' : 'text-text-primary'
                  }`}
                  onClick={closeMenu}
                >
                  <Sparkles size={20} className="mr-3" />
                  Create Tale
                </Link>
                
                <button
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="flex items-center p-3 rounded-lg text-text-primary hover:bg-gray-50 w-full text-left"
                >
                  <LogOut size={20} className="mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-50 ${
                    isActive('/login') ? 'text-primary-600 bg-primary-50' : 'text-text-primary'
                  }`}
                  onClick={closeMenu}
                >
                  <User size={20} className="mr-3" />
                  Log In
                </Link>
                
                <Link 
                  href="/signup" 
                  className="flex items-center p-3 text-primary-600 font-medium"
                  onClick={closeMenu}
                >
                  <User size={20} className="mr-3" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
