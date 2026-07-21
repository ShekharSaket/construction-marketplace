"use client";

import {
  useEffect,
  useState,
} from "react";

export default function AdminDashboard() {

  const [stats,
    setStats] =
    useState<any>(null);

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats =
    async () => {

      try {

        const res = await fetch("https://construction-marketplace-ttob.onrender.com/api/admin/stats");

        const data =
          await res.json();

        console.log(data);

        setStats(data);

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">

      <h1 className="text-5xl font-bold mb-10">

        Admin Dashboard

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-blue-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold">

            Users

          </h2>

          <p className="text-5xl mt-4">

            {stats?.totalUsers || 0}

          </p>

        </div>

        <div className="bg-green-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold">

            Workers

          </h2>

          <p className="text-5xl mt-4">

            {stats?.totalWorkers || 0}

          </p>

        </div>

        <div className="bg-purple-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold">

            Bookings

          </h2>

          <p className="text-5xl mt-4">

            {stats?.totalBookings || 0}

          </p>

        </div>

        <div className="bg-red-600 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-bold">

            Revenue

          </h2>

          <p className="text-5xl mt-4">

            ₹{stats?.totalRevenue || 0}

          </p>

        </div>

      </div>

    </div>
  );
}