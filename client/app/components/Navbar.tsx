"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / Home Link */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">
                ConstMarket
              </span>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/customer" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === '/customer' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Customer
            </Link>
            <Link 
              href="/worker-dashboard" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === '/worker-dashboard' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Worker Dashboard
            </Link>
            <Link 
              href="/my-bookings" 
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === '/my-bookings' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              My Bookings
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}