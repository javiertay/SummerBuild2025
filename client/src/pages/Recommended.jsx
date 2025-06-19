import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ShopeeLogo from '../assets/shopee logo.png'
import GrabLogo from '../assets/grablogo.svg'
import GoogleLogo from '../assets/google logo.webp'
import SeaLogo from '../assets/seagroup.png'
import BytedanceLogo from '../assets/bytedance.png'

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

const keywordCloud = ["React", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Figma"];
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#f8f4f3] p-4 sm:p-10 font-sans text-gray-900"
    >
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-2">Recommended Listings
        </h2>
        <p className="text-gray-600 text-lg">Based on your internship applications, we’ve curated job suggestions tailored to your interests.
        </p>
      </div>

      {/* Line chart + pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Application Activity */}
        <div className="bg-white rounded-xl shadow-sm border p-5 h-full">
          <h4 className="font-semibold text-gray-700 mb-3 text-lg">Application Activity
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={applicationTimeline}>
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem' }} />
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
          <h4 className="font-semibold text-gray-700 mb-3 text-lg">Application Role Focus
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {roleBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip contentStyle={{ borderRadius: '0.5rem' }} />
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
          <h4 className="font-semibold text-gray-700 text-lg mb-2">Skill Match Score</h4>
          <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
            <span className="text-4xl font-extrabold text-blue-700">{matchScore}%</span>
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
            You’re targeting frontend heavily – consider applying to full-stack
            roles to widen your scope.
          </li>
          <li>
            React and JavaScript are trending in your applications – ensure your
            resume reflects strength in them.
          </li>
          <li>Explore more remote roles – your last 3 were all onsite.</li>
        </ul>
      </div>

      {/* Suggested Job Listings */}
      <h4 className="font-semibold text-gray-700 text-lg mb-4">
        Suggested Opportunities
      </h4>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {mockJobs.map((job) => (
          <div
            key={job.id}
            className="p-5 rounded-xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition relative"
          >
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="h-10 w-auto mb-3 object-contain"
            />
            <h3 className="text-lg font-bold text-blue-800">{job.title}</h3>
            <p className="text-gray-700 text-sm">
              {job.company} – {job.location}
            </p>
            <span className="inline-block mt-3 text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
              Source: {job.source}
            </span>
            <button className="absolute top-3 right-3 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Back to Dashboard */}
      <div className="text-sm text-gray-600">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Internship Tracker
        </Link>
      </div>
    </motion.div>
  );
};

export default Recommended;
