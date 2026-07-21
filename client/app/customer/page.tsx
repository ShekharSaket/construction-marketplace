"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const router = useRouter();

  // Next.js best practice: Check auth inside the component using useEffect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        Customer Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">Total Bookings</h2>
          <p className="text-5xl mt-4">12</p>
        </div>

        <div className="bg-green-500 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">Active Workers</h2>
          <p className="text-5xl mt-4">5</p>
        </div>

        <div className="bg-purple-500 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">Total Spent</h2>
          <p className="text-5xl mt-4">₹12,000</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-4">Recent Bookings</h2>

        <div className="bg-gray-800 p-5 rounded-2xl mb-4">
          <p>3 Labour Workers booked</p>
          <p className="text-gray-400">Work Date: Tomorrow</p>
        </div>

        <div className="bg-gray-800 p-5 rounded-2xl">
          <p>1 Contractor booked</p>
          <p className="text-gray-400">Work Date: Sunday</p>
        </div>
      </div>
    </div>
  );
}