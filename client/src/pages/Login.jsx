import { motion } from 'framer-motion';
import loginImage from "../assets/loginImage.svg";
import { Link } from 'react-router-dom';
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";


const Login = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit = {{ opacity: 0, y: -30 }}
      transition = {{ duration: 0.4 }}
    >
      <div className="min-h-screen flex bg-[#f8f4f3] font-sans text-gray-900">
      {/* Left: Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white p-10">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Right: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg px-6 py-8">
          <div className="mb-6 text-center">
            <h2 className="font-bold text-3xl">
              HUSTLE <span className="bg-blue-600 text-white px-2 rounded-md">HUB</span>
            </h2>
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>

          <form>
            <InputField label="Email" type="email" id="email" name="email" placeholder="Email" />
            <PasswordField label="Password" id="password" name="password" />

            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember Me</label>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Link to="#" className="text-sm text-blue-500 hover:underline">
                Forgot your password?
              </Link>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-blue-500">
            Don’t have an account? <Link to="/signup" className="hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
    
  );
};

export default Login;
