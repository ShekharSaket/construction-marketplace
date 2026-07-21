"use client";

import {
  useEffect,
  useState,
} from "react";

export default function WorkerJobs() {

  const [jobs,
    setJobs] =
    useState<any[]>([]);

  useEffect(() => {

    fetchJobs();

  }, []);

  const fetchJobs =
    async () => {

      try {

        const workerId =
          "6a19705da029a5bea01e1f1f";

        const res =
          await fetch(
            `https://construction-marketplace-ttob.onrender.com/api/bookings/worker/${workerId}`
          );

        const data =
          await res.json();

        console.log(data);

        setJobs(data);

      } catch (error) {

        console.log(error);
      }
    };

  const totalEarnings =
    jobs.reduce(
      (
        total,
        job
      ) =>
        total +
        (job.totalAmount || 0),

      0
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-8">

      <h1 className="text-5xl font-bold mb-10">

        Worker Jobs Dashboard

      </h1>

      <div className="bg-green-600 p-6 rounded-3xl shadow-2xl mb-10">

        <h2 className="text-3xl font-bold">

          Total Earnings

        </h2>

        <p className="text-5xl mt-4">

          ₹{totalEarnings}

        </p>

      </div>

      <div className="grid gap-6">

        {
          jobs.map(
            (job) => (

              <div
                key={job._id}
                className="bg-white text-black p-6 rounded-3xl shadow-2xl"
              >

                <h2 className="text-2xl font-bold mb-4">

                  Booking ID:
                  {" "}
                  {job._id}

                </h2>

                <p className="mb-2">

                  Work Date:
                  {" "}
                  {
                    new Date(
                      job.workDate
                    ).toLocaleDateString()
                  }

                </p>

                <p className="mb-2">

                  Status:
                  {" "}
                  {
                    job.status
                  }

                </p>

                <p className="mb-2">

                  Total Amount:
                  {" "}
                  ₹{
                    job.totalAmount
                  }

                </p>

              </div>
            )
          )
        }

      </div>
    </div>
  );
}