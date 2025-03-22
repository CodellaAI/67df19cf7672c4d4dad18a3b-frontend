
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Book, Heart, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary mb-6">
            Create Magical <span className="text-primary-600">Tales</span> for Children
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10">
            Generate personalized stories for kids with our AI-powered tale weaver. 
            Customize by age, topic, and more to create the perfect bedtime story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="btn-primary flex items-center justify-center gap-2">
              <Sparkles size={20} />
              Create a Tale
            </Link>
            <Link href="/explore" className="btn-secondary flex items-center justify-center gap-2">
              <Book size={20} />
              Explore Tales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-hover flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize Your Tale</h3>
              <p className="text-text-secondary">Choose age range, topics, characters, and more to personalize the story for your child.</p>
            </div>
            
            <div className="card card-hover flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Book size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate with AI</h3>
              <p className="text-text-secondary">Our AI creates a unique tale based on your preferences, ensuring age-appropriate content.</p>
            </div>
            
            <div className="card card-hover flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Heart size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share or Save</h3>
              <p className="text-text-secondary">Keep your tales private or share them with the community for others to enjoy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Tale Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Tale</h2>
          <div className="card shadow-medium">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 relative">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <Image 
                    src="https://images.unsplash.com/photo-1629412721363-84cd96b1e71d?q=80&w=1000"
                    alt="Illustrated children's tale"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">Age 5-8</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">Adventure</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">The Moonlight Explorer</h3>
                <p className="text-text-secondary mb-6">
                  Join Luna as she discovers a magical portal in her backyard that takes her to a world where animals can talk and trees sing lullabies...
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-rose-500" />
                    <span className="text-sm text-text-secondary">248 likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-400" />
                    <span className="text-sm text-text-secondary">Featured</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/explore" className="text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                    Read more tales <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create your own tale?</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of parents and educators who use Tale Weaver to create magical stories that children love.
          </p>
          <Link href="/create" className="btn-primary inline-flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Start Creating
          </Link>
        </div>
      </section>
    </div>
  )
}
