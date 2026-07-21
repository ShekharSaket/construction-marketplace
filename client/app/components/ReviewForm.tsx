"use client";

import React, { useState } from "react";

type ReviewFormProps = {
  bookingId: string | number;
  workerId: string | number;
  onReviewSubmitted?: () => void;
};

export default function ReviewForm({ bookingId, workerId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage("Please select a star rating.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workerId, rating, reviewText }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Thank you! Your review has been submitted.");
        if (onReviewSubmitted) onReviewSubmitted(); // Optional callback to refresh the page/close modal
      } else {
        setMessage(data.message || "Failed to submit review.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 max-w-md w-full">
      <h3 className="text-2xl font-bold text-white mb-4">Rate Your Worker</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Star Rating Selection */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`text-4xl transition-colors duration-200 ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-500"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          ))}
        </div>

        {/* Text Review */}
        <textarea
          placeholder="How was the work? (Optional)"
          rows={4}
          className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>

        {/* Status Message */}
        {message && (
          <p className={`text-sm ${message.includes("Thank you") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}