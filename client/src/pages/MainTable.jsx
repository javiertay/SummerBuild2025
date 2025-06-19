import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AddEntryModal from "../components/AddEntryModal"; // adjust path as neededz
import {
  MagnifyingGlassIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  ClockIcon, 
  ArchiveBoxIcon,
  ArrowDownTrayIcon

} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { getInternship } from "../api/index.js";
import { toast } from "react-toastify"
import { createInternship } from "../api/index";

const InternshipTable = () => {
    const [isDark, setIsDark] = useDarkMode();
    const [applications, setApplications] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // handle logout
    const handleLogout = () => {
      localStorage.removeItem("profile")
      sessionStorage.removeItem("profile");
      navigate("/login");
      toast.success("Successfully logged out")
    }

    // retrieve all internship data
    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const { data } = await getInternship();

                const currentUser = JSON.parse(localStorage.getItem("profile")) || JSON.parse(sessionStorage.getItem("profile"));
                const currentUserID = currentUser?.id;

                const filteredData = data.filter((intern) => String(intern.user) === String(currentUserID));

                console.log(filteredData)
                setApplications(filteredData)
            } catch (err) {
                console.log("No Applications Found")
            }
        };

        fetchInternship();
    }, []);

    // (for archive entry)
    const [activeTab, setActiveTab] = useState("current");
    const handleArchiveEntry = (id) => {
        setApplications(applications.map(app =>
            app.id === id ? { ...app, archived: !app.archived } : app
        ));
        setShowModal(false);
        setEditEntry(null);
    };

    // (for edit entry)
    const [editEntry, setEditEntry] = useState(null);

    // (for search and filter feature)

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    
    // (for page and date settings)

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const filteredApplications = applications.filter(app => {
        const isArchivedMatch = activeTab === "archived" ? app.archived : !app.archived;
        const matchesSearch =
            app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? app.status === statusFilter : true;
        return isArchivedMatch && matchesSearch && matchesStatus;
    });

    // (for date filter feature)

    const [dateFilter, setDateFilter] = useState("");
    const sortedApplications = [...filteredApplications];
    if (dateFilter === "newest") {
        sortedApplications.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (dateFilter === "oldest") {
        sortedApplications.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // (Paginate the sorted results)

    const paginatedData = sortedApplications.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil(sortedApplications.length / rowsPerPage);

    // (for + Add Entry) 

    const handleAddEntry = () => {
        setEditEntry(null);     // Ensure it's a fresh entry, not editing
        setShowModal(true);     // Just open the modal
        };

    // (for Deleting entries, i felt extra so added prompt)

    const handleDeleteEntry = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
        if (confirmDelete) {
        setApplications(applications.filter(app => app.id !== id));}
    }; 

    // (for handling submiting button)
    // 
    const handleModalSubmit = async (entry) => {

      // this gets logged in user
      const currentUser = JSON.parse(localStorage.getItem("profile")) || JSON.parse(sessionStorage.getItem("profile"));
      if (!currentUser) {
      alert("No user found");
      return;}

      const formData = new FormData();
      // must include currentUser.id 
      formData.append("user", currentUser.id); 
      formData.append("company", entry.company);
      formData.append("position", entry.position);
      formData.append("applicationDate", entry.date);
      formData.append("status", entry.status);
      if (entry.resume) formData.append("resume", entry.resume);
      if (entry.comments) formData.append("comments", entry.comments);
      if (entry.link) {
        formData.append("links[0][label]", "Job Link");
        formData.append("links[0][url]", entry.link);
      }


      try {
        const { data } = await createInternship(formData);
        setApplications((prev) => [...prev, data]);
        setShowModal(false);
      } catch (error) {
        console.error("Failed to create internship:", error);
        alert("Something wrong. Please check console.");
      }
    };

    // (for status badges)

    const getStatusBadge = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-white text-[15px] font-semibold";
        switch (status.toLowerCase()) {
        case "accepted":
            return <span className={`${baseClasses} bg-green-500`}>Accepted</span>;
        case "withdrawn":
            return <span className={`${baseClasses} bg-gray-500`}>Withdrawn</span>;
        case "rejected":
            return <span className={`${baseClasses} bg-red-500`}>Rejected</span>;
        case "pending":
            return <span className={`${baseClasses} bg-orange-400`}>Pending</span>;
        case "follow up":
            return <span className={`${baseClasses} bg-purple-500`}>Follow Up</span>;
        default:
            return <span className={`${baseClasses} bg-gray-300`}>{status}</span>;
        }
    };

    return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className={`relative min-h-screen flex items-center justify-center p-4 transition-colors ${isDark? "bg-[#333333]" : "bg-[rgba(236,219,243,0.4)]"}`}  
    >
      {/* button to toggle between dark & light mode */}
      <div className ="absolute top-4 left-4 z-50 flex gap-4">
        {/* Dark mode toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-full shadow transition-colors ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        >{isDark ? "🌙 " : "☀️"}
        </button>

        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow transition-all duration-200
            ${isDark
            ? "bg-red-600 text-white hover:bg-red-700 active:scale-95"
            : "bg-red-500 text-white hover:bg-red-600 active:scale-95"}
          `}
      >
            <ArrowDownTrayIcon className="w-4 h-4" />
            Logout
          </button>
      </div>

      <div className={`w-[85vw] h-[85vh] rounded-2xl shadow-xl px-5 py-1 overflow-auto flex flex-col transition-colors ${isDark? "bg-[#2b2b2b]" : "bg-[rgba(236,219,243,0.4)]"}`}>
        <div className="flex justify-between items-center mb-1">
            <h6 className={`text-[42px] font-bold py-1 transition-colors ${isDark? "text-gray-100" : "text-gray-800"}`}>Current Internship Applications</h6></div> 
        <div>
            <p className={`text-[20px] mb-4 text-nowrap transition-colors ${isDark? "text-gray-300": "text-gray-600"  /* original on light */}`}>Manage all applications in one place. Input entries, update statuses, and monitor activity.</p>
          </div>
        <div className={`rounded-3xl shadow-sm border px-5 py-4 m-5 w-full max-w-[95vw] mx-auto transition-colors ${isDark? "bg-[#323437] border-gray-700" : "bg-gray-50 border-gray-200"}`}>

          {/* Archive Tabs */}

          <div className="flex justify-center my-4">
            <div className={`w-[90vw] shadow-sm rounded-xl py-1.5 px-2 flex justify-between transition-colors ${isDark? "bg-[#2e2e2e]" : "bg-gray-200"}`}>
              <button
                onClick={() => setActiveTab("current")}
                className={`w-1/2 py-2 text-base font-semibold flex items-center justify-center gap-2 rounded-xl transition-colors ${activeTab === "current" ? `${isDark ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"} shadow` : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}`}
              >
                <ClockIcon className="h-6 w-5" />
                Current
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`w-1/2 py-2 text-base font-semibold flex items-center justify-center gap-2 rounded-xl transition-colors ${activeTab === "archived" ? `${isDark ? "bg-gray-700 text-gray-100" : "bg-white text-gray-900"} shadow` : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}`}
              >
                <ArchiveBoxIcon className="h-6 w-5" />
                Archived
              </button>
            </div>
          </div>

          {/*Search, Status and Date filters and Add Entry  */}

          <div className="flex flex-wrap justify-between items-center w-full mt-3 mb-3 mx-2 gap-4 pr-4">

              {/* Search Company */}

              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative ">
                  <MagnifyingGlassIcon className={`w-5 h-5 absolute left-3 top-2.5 transition-colors ${isDark ? "text-gray-100" : "text-gray-500"}`}/>
                  <input
                    type="text"
                    placeholder="Company Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 shadow-sm rounded-2xl w-48 border transition-colors ${isDark? "bg-[#2e2e2e] border-[#4B5563] text-gray-100 placeholder-gray-400" : "bg-white   border-gray-400 text-gray-700 placeholder-gray-500" }`}
                  />
                </div>

                {/* Status Filter */}

                <div className="relative w-40">
                  <ClipboardDocumentCheckIcon className={`w-5 h-5 absolute left-3 top-2.5 pointer-events-none transition-colors ${isDark ? "text-gray-100" : "text-gray-500"}`}/>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`appearance-none shadow-sm w-full rounded-2xl py-2 pl-10 pr-8 focus:outline-none border transition-colors ${isDark? "bg-[#2e2e2e] border-[#4B5563] text-gray-100": "bg-white border-gray-400 text-gray-700"}`}
                  >
                    <option value="">Status</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Withdrawn">Withdrawn</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                    <option value="Follow Up">Follow Up</option>
                  </select>
                  <ChevronDownIcon className={`w-4 h-4 absolute right-3 top-3.5 pointer-events-none transition-colors ${isDark ? "text-gray-100" : "text-gray-500"}`}/>
                </div>

                {/* Date Filter */}

                <div className="relative w-40">
                  <CalendarDaysIcon className={`w-5 h-5 absolute left-3 top-2.5 pointer-events-none transition-colors ${isDark ? "text-gray-100" : "text-gray-500"}`}/>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)} 
                    className={`appearance-none shadow-sm w-full rounded-2xl py-2 pl-10 pr-8 focus:outline-none border transition-colors ${isDark? "bg-[#2e2e2e] border-[#4B5563] text-gray-100": "bg-white border-gray-400 text-gray-700"}`}
                  >
                    <option value="">Date</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <ChevronDownIcon className={`w-4 h-4 absolute right-3 top-3.5 pointer-events-none transition-colors ${isDark ? "text-gray-100" : "text-gray-500"}`}/>
                </div>
              </div>

              {/* Add Entry Button */}
              {activeTab === "current" && (
                <div>
                  <button
                    onClick={handleAddEntry}
                    className={`px-3 py-2 rounded-2xl shadow-sm transition w-32 ${isDark? "bg-purple-800 hover:bg-purple-900 text-white" : "bg-purple-600 hover:bg-purple-700 text-white" }`}
                  >
                    + Add Entry
                  </button>
                </div>
              )}
            </div>


        {/* MAIN TABLE!!! */}

        {/* Table Head */}

        <div className="overflow-auto flex-grow">
          <table className={`min-w-full text-nowrap transition-colors ${isDark? "bg-[#2e2e2e] border-[#4B5563] text-gray-100" : "bg-white border-white text-gray-800"}`}>
            <thead>
              {/* change the purple here */}
              <tr className={`text-[16px] text-center divide-x ${
    isDark
      ? "bg-purple-800 text-white divide-gray-400"
      : "bg-purple-600 text-white divide-gray-400"}`}>
                <th className="px-4 py-2 min-w-60 text-left rounded-tl-xl">Company Name</th>
                <th className="px-4 py-2 max-w-60">Position</th>
                <th className="px-4 py-2 max-w-40">Application Date</th>
                <th className="px-4 py-2 max-w-25 text-center">Status</th>
                <th className="px-4 py-2 max-w-30">CV / Resume</th>
                <th className="px-4 py-2 max-w-30">Comments</th>
                <th className="px-4 py-2 max-w-25 ">Links</th>
                <th className="px-6 py-4 w-35 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}

            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center border py-5 transition-colors" style={{color: isDark ? "#D1D5DB" : "#4B5563", borderColor: isDark ? "#4B5563" : "#D1D5DB",}}>No applications yet. Click "+ Add Entry" to begin.</td>
                </tr>
              ) : (
                paginatedData.map((app) => (
                  
                  <tr key={app.id} className="text-[15px] border rounded-br transition-colors"
                  style={{
                    backgroundColor: isDark
                      ? "#2e2e2e"
                      : app.id % 2 === 0
                          ? "rgba(162,155,255,0.4)"
                          : "#FFFFFF",
                    color: isDark ? "#F3F4F6" : "#111827",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = isDark ? "#444444" : "rgba(162,155,255,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = isDark
                      ? "#2e2e2e"
                      : app.id % 2 === 0
                          ? "rgba(162,155,255,0.4)"
                          : "#FFFFFF";
                  }}>
                    <td className="px-4 py-3 max-w-40 break-words whitespace-normal">{app.company}</td>
                    <td className="px-4 py-2 min-w-40 text-center">{app.position}</td>
                    <td className="px-4 py-2 max-w-40 text-center">{new Date(app.date).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-2 max-w-25 text-center">{getStatusBadge(app.status)}</td>

                    {/* to view the resume file in the main table, if no file replace with '-' */}
                    <td className="px-4 py-2 max-w-30 text-center"> {app.resume ? (
                         <a
                          href={URL.createObjectURL(app.resume)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-[15px]"
                        >
                        Click to View
                        </a>
                      ) : ("-")}
                    </td>

                    {/* to view the comments file in the main table, if no file replace with '-' */}
                    <td className="px-4 py-2 max-w-30 text-center">{app.comments ? (
                        <a
                          href={URL.createObjectURL(app.comments)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-[15px]"
                        >
                        Click to View</a>) :  ("-")}
                    </td>

                    <td className="px-4 py-2 max-w-35 text-center">
                      {app.link ? (
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-[15px]"
                        >
                          Link</a>) : ("-")}
                    </td>

                    <td className="px-4 py-2 w-30 gap-3 text-center">
                      <button 
                      onClick={() => {
                        setEditEntry(app);
                        setShowModal(true);
                      }}
                      className="text-blue-500 hover:underline text-[15px] font-semibold ">Edit</button>
                      <button className="text-red-500 hover:underline text-[15px] font-semibold  px-2"
                      onClick={() => handleDeleteEntry(app.id)}> Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Table foot and Pagination */}

            <tfoot>
              <tr>
                <td colSpan="8" className={`px-4 py-4 text-right border-amber-50 transition-colors ${isDark ? "bg-[#2e2e2e]" : "bg-white"}`}>
                  <div className={`flex justify-end items-center gap-6 text-sm rounded transition-colors ${isDark ? "text-white" : "text-gray-600"}`}>
                    <div className="flex items-center gap-2">
                      <label htmlFor="rowsPerPage" className="font-medium">Rows per page</label>
                      <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className={`border rounded px-2 py-1 transition-colors ${isDark? "bg-[#2e2e2e] hover:bg-[#444444]" : "bg-white hover:bg-gray-100"}`}
                      >
                        {[5, 10, 20, 30, 50].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>

                    <span className="font-medium">
                      Page {currentPage} of {Math.max(totalPages, 1)}
                    </span>

                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                        className={`border rounded px-2 py-1 transition-colors disabled:opacity-70 ${isDark ? "hover:bg-[#444444]" : "hover:bg-gray-100"}`}>&laquo;</button>
                      <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                        className={`border rounded px-2 py-1 transition-colors disabled:opacity-70 ${isDark ? "hover:bg-[#444444]" : "hover:bg-gray-100"}`}>&lsaquo;</button>
                      <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                        className={`border rounded px-2 py-1 transition-colors disabled:opacity-70 ${isDark ? "hover:bg-[#444444]" : "hover:bg-gray-100"}`}>&rsaquo;</button>
                      <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                        className={`border rounded px-2 py-1 transition-colors disabled:opacity-70 ${isDark ? "hover:bg-[#444444]" : "hover:bg-gray-100"}`}>&raquo;</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
            </table>
        </div>
      </div>

      {showModal && (
        <AddEntryModal
          onClose={() => {
            setShowModal(false);
            setEditEntry(null);
          }}
          onSubmit={handleModalSubmit}
          onArchive={handleArchiveEntry}
          initialData={editEntry}
        />
      )}

      </div>
    </motion.div>
  );
};

export default InternshipTable;