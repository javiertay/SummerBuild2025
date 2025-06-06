import React, { useState } from "react";
import loginImage from "../assets/loginImage.svg";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full bg-gray-50">
      {/* Left Side: Image */}
      <div className="hidden sm:flex items-center justify-center bg-white">
        <img
          className="w-4/5 h-auto object-contain"
          src={loginImage}
          alt="Login Illustration"
        />
      </div>

      {/* Right Side: Form */}
      <div className="flex flex-col justify-center px-8">
        <form className="max-w-[400px] w-full mx-auto bg-white shadow-md rounded-2xl p-8">
          <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
            HUSTLE HUB
          </h2>

          <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium">Username</label>
            <input
              className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="text"
            />
          </div>

          <div className="flex flex-col mb-4 relative">
            <label className="mb-1 font-medium">Password</label>
            <input
              className="border p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
              type={showPassword ? "text" : "password"}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </div>
          </div>

          <button className="w-full py-2 my-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition duration-300">
            Sign In
          </button>

          <div className="flex justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input className="mr-2" type="checkbox" />
              Remember Me
            </label>
            <a
              href="#"
              className="hover:underline hover:text-indigo-600 transition duration-200"
            >
              Create an account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
