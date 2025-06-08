import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/loginImage.svg";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";

const Login2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

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
            {/* Email Field */}
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password Field */}
            <PasswordField
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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
              <Link
                to="/forgot"
                className="text-sm sm:text-base text-blue-500 hover:underline whitespace-nowrap"
              >
                Forgot your password?
              </Link>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base md:text-lg font-semibold px-6 py-2.5 rounded-md transition shrink-0 whitespace-nowrap"
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

