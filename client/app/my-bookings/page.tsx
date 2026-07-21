"use client";

import { useEffect, useState } from "react";
// Adjust these paths if you saved them in a different folder
import ReviewForm from "../components/ReviewForm";
import PayButton from "../components/PayButton"; // NEW: Import the Pay Button

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)/api/bookings");
      const data = await res.json();
      console.log(data);
      setBookings(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">
      <h1 className="text-5xl font-bold mb-10">My Bookings</h1>

      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white text-black p-6 rounded-3xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">
              Booking ID: {booking._id}
            </h2>
            
            <p className="mb-2 text-gray-700">
              <span className="font-bold">Work Date:</span> {new Date(booking.workDate).toLocaleDateString()}
            </p>

            {/* NEW: Display the total amount for the job */}
            <p className="mb-2 text-gray-700">
              <span className="font-bold">Total Amount:</span> ₹{booking.totalAmount}
            </p>
            
            <p className="mb-6 text-gray-700">
              <span className="font-bold">Status:</span>{" "}
              <span className={`font-bold uppercase ${booking.status === 'completed' ? 'text-green-600' : 'text-orange-500'}`}>
                {booking.status || "Pending"}
              </span>
            </p>

            {/* NEW: Payment Section (Only shows if the job is completed) */}
            {booking.status === "completed" && (
              <div className="mb-6 p-5 bg-blue-50 rounded-xl border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-blue-900 text-lg">Payment Required</p>
                  <p className="text-sm text-blue-700">
                    Please pay the total amount of ₹{booking.totalAmount} for this completed job.
                  </p>
                </div>
                {/* Mount the Razorpay Button */}
                <PayButton amount={booking.totalAmount} bookingId={booking._id} />
              </div>
            )}

            <div className="mt-6">
              <p className="mb-3 text-lg font-bold border-b pb-2">Hired Workers</p>
              
              <ul className="space-y-6">
                {booking.workers?.map((item: any, index: number) => (
                  <li key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="font-bold text-xl mb-1">
                      {item.worker?.name || "Unknown Worker"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4 capitalize">Role: {item.role || "Worker"}</p>

                    {/* ONLY show the review form if the job is done and they haven't been rated yet */}
                    {booking.status === "completed" && !item.rating && item.worker?._id && (
                      <div className="mt-4">
                        <ReviewForm 
                          bookingId={booking._id} 
                          workerId={item.worker._id} 
                          onReviewSubmitted={fetchBookings} 
                        />
                      </div>
                    )}

                    {/* If they HAVE been rated, show a success message instead of the form */}
                    {booking.status === "completed" && item.rating && (
                      <p className="text-green-600 font-bold mt-2 bg-green-50 p-3 rounded-lg border border-green-200 inline-block">
                        ⭐ You rated this worker {item.rating} Stars!
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}