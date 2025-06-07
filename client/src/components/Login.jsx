import React, { useState } from "react";
import loginImage from "../assets/loginImage.svg";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);


  return (
    <div className="min-h-screen flex bg-[#f8f4f3] font-sans text-gray-900">
      {/* Left: Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-10">
        <img
          src={loginImage} // replace with your image path
          alt="Login Illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="font-bold text-3xl">
              HUSTLE <span className="bg-blue-600 text-white px-2 rounded-md">HUB</span>
            </h2>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

          <form>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-sm mt-1 outline-blue-500"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-sm mt-1 outline-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'} text-lg`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>

            {/* Forgot Password & Button */}
            <div className="flex items-center justify-between mb-6">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot your password?
              </a>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Sign up */}
          <div className="mt-6 text-sm text-center text-blue-500">
            Don’t have an account? <a href="#" className="hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;