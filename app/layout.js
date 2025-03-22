
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Tale Weaver - AI-Powered Children\'s Stories',
  description: 'Create magical tales for children with our AI-powered story generator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-background min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
