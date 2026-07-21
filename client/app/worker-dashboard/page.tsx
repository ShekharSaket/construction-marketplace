"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function WorkerDashboard() {
  const [location, setLocation] = useState<any>(null);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const socket = io("[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    if (storedUser?._id) {
      socket.emit("worker-online", storedUser._id);
      fetchActiveJobs(storedUser._id);
    }

    // 1. Store the watch ID so we can clear it later
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          workerId: storedUser._id,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(currentLocation);

        socket.emit("worker-location", currentLocation);
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    socket.on("new-booking", (data) => {
      alert(data.message);
      if (storedUser?._id) fetchActiveJobs(storedUser._id); // Refresh jobs on new booking
    });

    // 2. CRITICAL CLEANUP: Stop tracking when the worker leaves the page
    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, []);

  // Fetch jobs assigned to this worker
  const fetchActiveJobs = async (workerId: string) => {
    try {
      const res = await fetch(`[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)/api/bookings/worker/${workerId}`);
      const data = await res.json();
      
      // Filter out jobs that are already completed
      const pendingJobs = data.filter((job: any) => job.status !== "completed");
      setActiveJobs(pendingJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Mark job as completed
  const handleCompleteJob = async (bookingId: string) => {
    try {
      const res = await fetch(`[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)/api/bookings/${bookingId}/complete`, {
        method: "PUT",
      });

      if (res.ok) {
        alert("Job Completed successfully! XP has been awarded.");
        // Remove the completed job from the screen
        setActiveJobs((prev) => prev.filter((job) => job._id !== bookingId));
      } else {
        alert("Failed to complete job.");
      }
    } catch (error) {
      console.error("Error completing job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Worker Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold">XP Points</h2>
          {/* In a real app, you would fetch this from the updated user profile */}
          <p className="text-4xl mt-4">{user?.experiencePoints || 120}</p>
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

      {/* Active Jobs Section */}
      <h2 className="text-3xl font-bold mb-4">Active Jobs</h2>
      {activeJobs.length === 0 ? (
        <p className="text-gray-400">You have no pending jobs right now.</p>
      ) : (
        <div className="grid gap-6">
          {activeJobs.map((job) => (
            <div key={job._id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <p className="text-xl font-bold mb-1">Booking ID: {job._id}</p>
                <p className="text-gray-400">Date: {new Date(job.workDate).toLocaleDateString()}</p>
                <p className="text-gray-400">Total Pay: ₹{job.totalAmount}</p>
              </div>
              <button
                onClick={() => handleCompleteJob(job._id)}
                className="mt-4 md:mt-0 bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-xl transition duration-200"
              >
                Mark as Completed ✓
              </button>
            </div>
          ))}
        </div>
      )}

      {location && (
        <div className="mt-8 bg-green-500 text-black p-4 rounded-xl inline-block">
          <h2 className="text-xl font-bold mb-2">Live GPS Broadcasting</h2>
          <p>Lat: {location.lat.toFixed(4)} | Lng: {location.lng.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}