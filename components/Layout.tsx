import React from 'react'
import Link from 'next/link'
import { Play, Settings, Search } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <nav className="fixed top-0 left-0 right-0 bg-neutral-900 border-b border-neutral-800 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link 
              href="/" 
              className="text-white hover:text-gray-300 text-lg font-bold"
            >
              GSL
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/demo" 
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <Play size={20} />
                <span>Demo</span>
              </Link>
              <Link 
                href="/scanner" 
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <Search size={20} />
                <span>Scanner</span>
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}

