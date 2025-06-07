import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/loginImage.svg";

const Login2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-[#f8f4f3] font-sans text-gray-900">
      {/* Left: Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-10">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
           <div className="max-w-[630px] sm:w-[80%] px-6 py-10 bg-white shadow-lg rounded-2xl space-y-6">

          {/* Header */}
          <div className="mb-4 text-center">
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl">
              HUSTLE <span className="bg-blue-600 text-white px-2 rounded-md">HUB</span>
            </h2>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center text-gray-700 mb-6">
            Login
            </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base md:text-lg font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2.5 sm:py-3 px-4 text-sm sm:text-base md:text-lg mt-1 outline-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base md:text-lg font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2.5 sm:py-3 px-4 pr-10 text-sm sm:text-base md:text-lg mt-1 outline-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={`bx ${showPassword ? "bx-show" : "bx-hide"} text-lg`}></i>
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
              <label
                htmlFor="remember"
                className="ml-2 text-sm sm:text-base text-gray-600"
              >
                Remember Me
              </label>
            </div>

            {/* Forgot Password & Button */}
            <div className="flex flex-row items-center justify-between gap-1 mb-6">
              <a href="#" className="text-sm sm:text-base text-blue-500 hover:underline whitespace-nowrap">
                Forgot your password?
              </a>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base md:text-lg font-semibold px-6 py-2.5 rounded-md transition shrink-0  whitespace-nowrap"
                >
                Sign In
                </button>
            </div>
          </form>

          {/* Sign up */}
          <div className="text-sm sm:text-base text-center text-blue-500">
            Don’t have an account?{" "}
            <Link to="/signup" className="hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login2;
