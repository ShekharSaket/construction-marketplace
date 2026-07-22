"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// 1. THE DYNAMIC IMPORT
const DynamicMap = dynamic(() => import("./components/Map"), {
  ssr: false, 
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse">
      <p className="text-gray-500 font-medium">Loading map data...</p>
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