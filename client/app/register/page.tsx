"use client";

import { useState } from "react";

export default function RegisterPage() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
  useState<string>("customer");

  const handleRegister = async () => {

    const res = await fetch(
      "[https://construction-marketplace-ttob.onrender.com](https://construction-marketplace-ttob.onrender.com)/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center text-white">

      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-6">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
<select
  value={role}
  aria-label="Select Role"
  title="Select Role"
  className="w-full p-3 mb-4 rounded bg-gray-800"
  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
    setRole(e.target.value)
  }
>
  <option value="customer">
    Customer
  </option>

  <option value="labour">
    Labour
  </option>

  <option value="trowel">
    Trowel
  </option>

  <option value="contractor">
    Contractor
  </option>
</select>
      
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 p-3 rounded-xl font-bold"
        >
          Register
        </button>

      </div>
    </div>
  );
}