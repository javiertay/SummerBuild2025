import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ShopeeLogo from "../assets/shopee logo.png";
import GrabLogo from "../assets/grablogo.svg";
import GoogleLogo from "../assets/google logo.webp";
import SeaLogo from "../assets/seagroup.png";
import BytedanceLogo from "../assets/bytedance.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDarkMode from "../hooks/useDarkMode";
import Navbar from "../components/Navbar";
import { getExternalInternships, getRecommendedInternships, createInternship } from "../api/index";
import { transformExternalJob } from "../utils/jobUtils";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const applicationTimeline = [
  { week: "Week 1", count: 2 },
  { week: "Week 2", count: 4 },
  { week: "Week 3", count: 1 },
  { week: "Week 4", count: 5 },
];

const roleBreakdown = [
  { name: "Frontend", value: 54 },
  { name: "Backend", value: 25 },
  { name: "Data", value: 15 },
  { name: "UX", value: 6 },
];

const keywordCloud = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Redux",
  "Figma",
];
const matchScore = 82;

const mockJobs = [
  {
    id: 1,
    title: "React Frontend Developer",
    company: "Shopee",
    location: "Singapore",
    logo: ShopeeLogo,
    source: "LinkedIn",
  },
  {
    id: 2,
    title: "Frontend Software Engineer (React/Next.js)",
    company: "Google",
    location: "Remote",
    logo: GoogleLogo,
    source: "Indeed",
  },
  {
    id: 3,
    title: "UI Developer",
    company: "Grab",
    location: "Singapore",
    logo: GrabLogo,
    source: "MyCareersFuture",
  },
  {
    id: 4,
    title: "Frontend Engineer (React + Tailwind)",
    company: "Sea Group",
    location: "Singapore",
    logo: SeaLogo,
    source: "Glassdoor",
  },
  {
    id: 5,
    title: "Web UI Intern",
    company: "Bytedance",
    location: "Singapore",
    logo: BytedanceLogo,
    source: "Indeed",
  },
];

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

const Recommended = () => {
  const [isDark, setisDark] = useDarkMode();
  const navigate = useNavigate();  const [externalJobs, setExternalJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");

  // Extract fetchExternalInternships as a separate function for reuse
  const fetchExternalInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user skills from localStorage to personalize recommendations
      const currentUser = JSON.parse(localStorage.getItem("profile")) || 
                        JSON.parse(sessionStorage.getItem("profile"));
      
      // Use broader skills for better matching with real API data
      const userSkills = []; // Empty array means no skill filtering initially
      
      // Don't filter by location initially - show all available jobs
      const data = await getRecommendedInternships(userSkills, "");
      
      // Add company logos to the data
      const jobsWithLogos = data.slice(0, 10).map(job => ({
        ...job,
        logo: getCompanyLogo(job.company)
      }));
      
      setExternalJobs(jobsWithLogos);
      setFilteredJobs(jobsWithLogos);
    } catch (err) {
      console.error("Error fetching external internships:", err);
      setError("Failed to load external internships. Using mock data.");
      // Fallback to mock data if API fails
      setExternalJobs(mockJobs);
      setFilteredJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh jobs
  const handleRefreshJobs = async () => {
    console.log('🔄 Refreshing jobs...');
    await fetchExternalInternships();
    toast.success("Jobs refreshed successfully!");
  };

  // Fetch external internships on component mount
  useEffect(() => {
    fetchExternalInternships();
  }, []);

  // Filter jobs based on search term, location, and company
  useEffect(() => {
    let filtered = externalJobs.length > 0 ? externalJobs : mockJobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }    if (locationFilter !== "All") {
      console.log(`🌍 Filtering by location: "${locationFilter}"`);
      console.log('📍 Available locations:', filtered.map(job => job.location));
      
      filtered = filtered.filter(job => {
        const jobLocation = job.location.toLowerCase();
        const filterLocation = locationFilter.toLowerCase();
        const matches = jobLocation.includes(filterLocation);
        console.log(`${matches ? '✅' : '❌'} "${job.location}" ${matches ? 'matches' : 'does not match'} "${locationFilter}"`);
        return matches;
      });
      
      console.log(`🌍 After location filter: ${filtered.length} jobs remaining`);
    }

    if (companyFilter !== "All") {
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }    setFilteredJobs(filtered);
  }, [externalJobs, searchTerm, locationFilter, companyFilter]); // Add proper dependencies
  // Helper function to get company logos
  const getCompanyLogo = (companyName) => {
    if (!companyName) return null;
    const company = companyName.toLowerCase();
    if (company.includes('shopee')) return ShopeeLogo;
    if (company.includes('grab')) return GrabLogo;
    if (company.includes('google')) return GoogleLogo;
    if (company.includes('sea')) return SeaLogo;
    if (company.includes('bytedance') || company.includes('tiktok')) return BytedanceLogo;
    return null; // Will show company initial instead
  };

  // Function to add external job to user's internship tracker
  const handleAddToTracker = async (job) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("profile")) || 
                        JSON.parse(sessionStorage.getItem("profile"));
      
      if (!currentUser?.id) {
        toast.error("Please log in to add jobs to your tracker");
        return;
      }

      const internshipData = {
        companyName: job.company,
        position: job.title,
        applicationDate: new Date().toISOString().split('T')[0],
        status: "Applied",
        location: job.location,
        jobUrl: job.applyUrl || "",
        notes: `Added from external recommendations - ${job.source}`,
        salary: job.salary || "",
        user: currentUser.id
      };

      await createInternship(internshipData);
      toast.success(`Added "${job.title}" at ${job.company} to your tracker!`);
    } catch (error) {
      console.error("Error adding job to tracker:", error);
      toast.error("Failed to add job to tracker");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    navigate("/login");
    toast.success("Successfully logged out");
  };
  return (
    <>
      <Navbar
        isDark={isDark}
        toggleDarkMode={() => setIsDark(!isDark)}
        handleLogout={handleLogout}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen bg-[#f8f4f3] p-4 sm:p-10 font-sans text-gray-900"
      >
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-2">
            Recommended Listings
          </h2>
          <p className="text-gray-600 text-lg">
            Based on your internship applications, we’ve curated job suggestions
            tailored to your interests.
          </p>
        </div>

        {/* Line chart + pie chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Application Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
            <h4 className="font-semibold text-gray-700 mb-3 text-lg">
              Application Activity
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={applicationTimeline}>
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart – Role Focus */}
          <div className="bg-white rounded-xl shadow-sm border p-5 h-full flex flex-col items-center justify-center">
            <h4 className="font-semibold text-gray-700 mb-3 text-lg">
              Application Role Focus
            </h4>
            <div className="w-full h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {roleBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-gray-600 text-center">
              Shows how your applications are distributed across roles.
            </p>
          </div>
        </div>

        {/* Skill Match Score and Keyword Cloud */}
        <div className="bg-white rounded-xl shadow-sm border p-5 mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <h4 className="font-semibold text-gray-700 text-lg mb-2">
              Skill Match Score
            </h4>
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
              <span className="text-4xl font-extrabold text-blue-700">
                {matchScore}%
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Reflects how well your skills align with the roles you applied to.
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-semibold text-gray-700 mb-3 text-lg">
              Frequently Mentioned Skills
            </h4>
            <div className="flex flex-wrap gap-3">
              {keywordCloud.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Based on Activity */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10 text-sm text-gray-700">
          <h4 className="text-blue-700 font-semibold mb-2">
            💡 Tips Based on Your Activity
          </h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You’re targeting frontend heavily – consider applying to
              full-stack roles to widen your scope.
            </li>
            <li>
              React and JavaScript are trending in your applications – ensure
              your resume reflects strength in them.
            </li>
            <li>Explore more remote roles – your last 3 were all onsite.</li>
          </ul>
        </div>        {/* Filter and Search Section */}
        <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
          <h4 className="font-semibold text-gray-700 text-lg mb-4">Filter Opportunities</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by title or company
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Frontend Engineer, Google"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Locations</option>
                <option value="Germany">Germany</option>
                <option value="India">India</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Brazil">Brazil</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Qatar">Qatar</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Type
              </label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Companies</option>
                <option value="Tech">Tech Companies</option>
                <option value="Startup">Startups</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredJobs.length} opportunities
            {searchTerm && ` matching "${searchTerm}"`}
            {locationFilter !== "All" && ` in ${locationFilter}`}
          </div>
        </div>

        {/* Suggested Job Listings */}
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-700 text-lg">
            Suggested Opportunities
            {loading && <span className="text-blue-600 ml-2">(Loading...)</span>}
            {error && <span className="text-red-600 ml-2 text-sm">({error})</span>}
          </h4>          <button
            onClick={handleRefreshJobs}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            🔄 Refresh Jobs
          </button>
        </div>
        
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-5 rounded-xl bg-white border border-gray-200 animate-pulse">
                <div className="h-10 w-20 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or clearing filters to see more results.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("All");
                setCompanyFilter("All");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition relative"
              >
                {job.logo ? (
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="h-10 w-auto mb-3 object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-sm">
                      {job.company?.charAt(0) || 'C'}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-blue-800 line-clamp-2">{job.title}</h3>
                <p className="text-gray-700 text-sm mb-2">
                  {job.company} – {job.location}
                </p>
                
                {job.salary && job.salary !== "Competitive" && (
                  <p className="text-green-600 text-sm font-medium mb-2">
                    💰 {job.salary}
                  </p>
                )}
                
                {job.description && (
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {job.description}
                  </p>
                )}
                  <div className="flex justify-between items-center gap-2">
                  <span className="inline-block text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                    Source: {job.source}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToTracker(job)}
                      className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      title="Add to your internship tracker"
                    >
                      + Track
                    </button>
                    
                    {job.applyUrl && job.applyUrl !== "#" ? (
                      <a 
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Apply
                      </a>
                    ) : (
                      <button 
                        onClick={() => toast.info("Application link not available")}
                        className="text-xs bg-gray-400 text-white px-2 py-1 rounded cursor-not-allowed"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="text-sm text-gray-600">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Internship Tracker
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default Recommended;
