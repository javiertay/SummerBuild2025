import { Link, useLocation } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const Navbar = ({ isDark, toggleDarkMode, handleLogout }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-700 font-semibold"
      : "text-gray-500 hover:text-blue-700";

  return (
    <nav
      className={`w-full z-50 sticky top-0 border-b py-3 px-6 shadow-sm flex justify-between items-center
        ${isDark ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"}
      `}
    >
      {/* Left: Brand + Nav Links */}
      <div className="flex items-center gap-10">
        <h1 className="text-2xl font-extrabold text-blue-700">HustleHub</h1>
        <div className="hidden md:flex gap-6 text-sm sm:text-base">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Internship Tracker
          </Link>
          <Link to="/recommended" className={isActive("/recommended")}>
            Recommendations
          </Link>
        </div>
      </div>

      {/* Right: Dark mode & Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full shadow transition-colors ${
            isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {isDark ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow transition-all duration-200
            ${isDark
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-red-500 text-white hover:bg-red-600"}
          `}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

