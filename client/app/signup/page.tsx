"use client";

import {
  useState,
} from "react";

import { useRouter }
from "next/navigation";

export default function SignupPage() {

  const router =
    useRouter();

  const [formData,
    setFormData] =
    useState({

      name: "",
      phone: "",
      password: "",
      role: "labour",
    });

  const handleChange =
    (
      e: any
    ) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });
    };
  const handleSignup =
    async () => {

      try {

        const res =
          await fetch(
            "[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)/api/auth/register",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                formData
              ),
            }
          );

        const data =
          await res.json();

        console.log(data);

        alert(
          "Account Created"
        );

        router.push(
          "/login"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Signup Failed"
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900">

      <div className="bg-white text-black p-8 rounded-2xl w-[350px]">

        <h1 className="text-3xl font-bold mb-6 text-center">

          Create Account

        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={
            handleChange
          }
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={
            handleChange
          }
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={
            handleChange
          }
          className="w-full p-3 border rounded mb-4"
        />

        <select
          name="role"
          aria-label="Role"
          onChange={
            handleChange
          }
          className="w-full p-3 border rounded mb-4"
        >

          <option value="labour">
            Labour
          </option>

          <option value="trowel">
            Trowel
          </option>

          <option value="contractor">
            Contractor
          </option>

          <option value="customer">
            Customer
          </option>

        </select>

        <button
          onClick={
            handleSignup
          }
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >

          Sign Up

        </button>

      </div>
    </div>
  );
}