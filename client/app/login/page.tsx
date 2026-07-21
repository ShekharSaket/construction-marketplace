"use client";

import {
  useState,
} from "react";

import { useRouter }
from "next/navigation";

export default function LoginPage() {

  const router =
    useRouter();

  const [phone,
    setPhone] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const handleLogin =
    async () => {

      try {

        const res =
          await fetch(
            "https://construction-marketplace-ttob.onrender.com/api/auth/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                phone,
                password,
              }),
            }
          );

        const data =
          await res.json();

        console.log(data);

        if (data.token) {

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          alert(
            "Login Successful"
          );

          if (
            data.user.role ===
            "customer"
          ) {

            router.push("/");

          } else {

            router.push(
              "/worker"
            );
          }

        } else {

          alert(
            "Invalid Credentials"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "Login Failed"
        );
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900">

      <div className="bg-white text-black p-8 rounded-2xl w-[350px]">

        <h1 className="text-3xl font-bold mb-6 text-center">

          Login

        </h1>

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 border rounded mb-4"
        />

        <button
          onClick={
            handleLogin
          }
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >

          Login

        </button>

      </div>
    </div>
  );
}