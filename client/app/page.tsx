"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// THE UPGRADED DYNAMIC IMPORT WITH STRUCTURAL PLACEHOLDER
const DynamicMap = dynamic(() => import("./components/Map"), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-[400px] bg-gray-200 rounded-2xl animate-pulse relative overflow-hidden flex flex-col items-center justify-center border border-gray-300">
      
      {/* Faux UI to mimic map controls */}
      <div className="absolute top-4 left-4 bg-white/60 w-32 h-8 rounded shadow-sm"></div>
      <div className="absolute top-4 right-4 bg-white/60 w-10 h-10 rounded shadow-sm"></div>
      
      {/* Map Pin SVG Icon */}
      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      
      <p className="text-gray-500 font-medium tracking-wide">Locating workers near you...</p>
    </div>
  ),
});

export default function HomePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Construction Marketplace
          </h1>
          <p className="text-gray-600 text-lg">
            Find workers and professionals near your location.
          </p>
        </header>

        <section className="w-full bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <DynamicMap liveLocation={userLocation} />
        </section>

      </div>
    </main>
  );
}