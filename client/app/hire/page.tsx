"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HireWorkerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // We are using a dummy worker here so you can test the Booking and Map Routing.
  // Later, you can fetch a real list of workers from your backend!
  const availableWorkers = [
    {
      _id: "6a23b5ba25bce5a44c5178f5", // The real worker ID you found earlier
      name: "Ramesh (Test Worker)",
      role: "contractor",
      pricePerDay: 1500,
    }
  ];

  const handleBookWorker = async (workerId: string, role: string, pricePerDay: number) => {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser._id) {
      alert("Please login as a customer first!");
      router.push("/login");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // THIS IS THE MAGIC: We grab the customer's GPS location right when they book!
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const customerLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: "Customer Site",
        };

        try {
          const res = await fetch("https://construction-marketplace-ttob.onrender.com/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: storedUser._id,
              workers: [{ worker: workerId, role: role, pricePerDay: pricePerDay }],
              workDate: new Date().toISOString(),
              location: customerLocation, // Sending the coordinates to the database
            }),
          });

          const data = await res.json();

          if (res.ok) {
            alert("Booking Successful! Redirecting to Live Tracking...");
            // Redirect the customer to the tracking map with the worker's ID
            router.push(`/track/${workerId}`);
          } else {
            alert("Booking failed: " + data.message);
          }
        } catch (error) {
          console.error(error);
          alert("An error occurred while booking.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Could not get your location. Please allow GPS permissions.");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Hire a Worker</h1>

        <div className="grid gap-6">
          {availableWorkers.map((worker) => (
            <div key={worker._id} className="bg-white text-black p-6 rounded-3xl shadow-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{worker.name}</h2>
                <p className="text-gray-600 uppercase tracking-widest text-sm mb-2">{worker.role}</p>
                <p className="text-xl font-bold text-green-600">₹{worker.pricePerDay}/day</p>
              </div>

              <button
                onClick={() => handleBookWorker(worker._id, worker.role, worker.pricePerDay)}
                disabled={loading}
                className={`px-8 py-4 rounded-xl font-bold text-white transition-all ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Getting Location..." : "Book & Track Live"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}