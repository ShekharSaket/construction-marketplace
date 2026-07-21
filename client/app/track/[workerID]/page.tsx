"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import { io } from "socket.io-client";
import { usePathname } from "next/navigation"; 

export default function TrackWorker() {
  const pathname = usePathname();
  
  const workerId = pathname.split("/").pop();

  const [workerLocation, setWorkerLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load the Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    // SECURITY GUARD: If workerId is missing, stop here!
    if (!workerId) return;

    // Fetch the Customer's job site location from the database
    const fetchBooking = async () => {
      try {
        const res = await fetch(`[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)/api/bookings/worker/${workerId}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        
        // Grab the most recent booking to get the destination coordinates
        const latestBooking = data[data.length - 1];
        if (latestBooking && latestBooking.location) {
          setCustomerLocation({
            lat: latestBooking.location.lat,
            lng: latestBooking.location.lng
          });
        }
      } catch (error) {
        console.error("Error fetching booking location:", error);
      }
    };

    fetchBooking();

    // Connect to Socket.io to get the Worker's live GPS updates
    const socket = io("[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)");

    socket.emit("join-tracking", workerId);

    socket.on("live-location", (data) => {
      if (data.workerId === workerId) {
        setWorkerLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [workerId]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading Map Engine...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Live Worker Tracking</h1>
        
        <p className="text-gray-400 mb-8">Tracking worker ID: {workerId}</p> 
        
        <div className="w-full h-[600px] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-gray-800">
          <GoogleMap
            zoom={14}
            center={customerLocation || workerLocation || { lat: 23.2599, lng: 77.4126 }}
            mapContainerClassName="w-full h-full"
          >
            {customerLocation && <Marker position={customerLocation} label="You" />}
            
            {workerLocation && <Marker position={workerLocation} label="Worker" />}

            {customerLocation && workerLocation && (
              <Polyline
                path={[workerLocation, customerLocation]}
                options={{
                  strokeColor: "#3b82f6",
                  strokeOpacity: 0.8,
                  strokeWeight: 6,
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}