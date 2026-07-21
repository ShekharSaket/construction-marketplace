"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { checkAuth } from "../utils/checkAuth";

export default function WorkerDashboard() {
  const [notification, setNotification] = useState("");

  useEffect(() => {
    checkAuth();

    // 1. Initialize socket connection
    const socket = io("https://construction-marketplace-ttob.onrender.com");

    // Get the real worker ID from local storage (fallback to your hardcoded one for testing)
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentWorkerId = storedUser._id || "6a23b5ba25bce5a44c5178f5";

    socket.emit("worker-online", {
      workerId: currentWorkerId,
      name: "Worker Active",
    });

    // 2. Start high-accuracy GPS tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        socket.emit("worker-location", {
          workerId: currentWorkerId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("GPS Tracking Error:", error);
      },
      { 
        enableHighAccuracy: true, // Forces device to use real GPS chip
        maximumAge: 0 // Prevents caching old locations
      } 
    );

    socket.on("new-booking", (data) => {
      setNotification(data.message);
      alert(data.message);
    });

    // 3. CRITICAL CLEANUP: Runs when the worker leaves this page
    return () => {
      navigator.geolocation.clearWatch(watchId); // Stops draining battery
      socket.disconnect(); // Closes the WebSocket
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Worker Dashboard</h1>
      
      {notification && (
        <div className="bg-yellow-500 text-black p-4 rounded-xl mb-6">
          {notification}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold">XP Points</h2>
          <p className="text-4xl mt-4">120</p>
        </div>

        <div className="bg-green-600 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold">Earnings</h2>
          <p className="text-4xl mt-4">₹5400</p>
        </div>

        <div className="bg-purple-600 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold">Status</h2>
          <p className="text-4xl mt-4">Online</p>
        </div>
      </div>
    </div>
  );
}