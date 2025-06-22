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
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { getInternship } from "../api/index.js";
import { deleteInternship } from "../api/index";
import { toast } from "react-toastify";
import { createInternship } from "../api/index";
import { updateInternship } from "../api/index"; 
import Navbar from "../components/Navbar";
import FollowUpNotif from "../components/FollowUpNotif.jsx";
import { getThemeColors, getThemeShadows } from "../utils/theme";
import { getUserById } from "../api/index.js";
import GradientText from "../components/GradientText";

const InternshipTable = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const colors = getThemeColors(isDark);
  const shadows = getThemeShadows(isDark);
  const [activeTab, setActiveTab] = useState("current");

  // handle logout
  const handleLogout = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    navigate("/login");
    toast.success("Successfully logged out");
  };

  // handle follow up
  const today = new Date();
  const followUps = applications.filter((app) => {
    if (app.status?.toLowerCase() !== "follow up") return false;
    const followUpDate = new Date(app.followUpDate || app.applicationDate);
    return followUpDate >= today || followUpDate < today; // both future and overdue
  });

  const handleDismissFollowUp = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: "Pending" } : app))
    );
  };

  const handleMarkDoneFollowUp = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: "Done" } : app))
    );
  };

  // retrieve all internship data
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data } = await getInternship();

        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));
        const currentUserID = currentUser?.id;

        const filteredData = data.filter(
          (intern) => String(intern.user) === String(currentUserID)
        );

        console.log("Fetched internships:", filteredData);
        setApplications(filteredData);
      } catch (err) {
        console.log("No Applications Found");
      }
    };

    fetchInternship();
  }, []);

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));
        
        console.log("Current user from storage:", currentUser);
        
        if (currentUser?.id) {
          const { data } = await getUserById(currentUser.id);
          console.log("API response:", data);
          if (data.success) {
            setUserInfo(data.user);
            console.log("Set userInfo to:", data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Fallback to localStorage if API fails
        const currentUser =
          JSON.parse(localStorage.getItem("profile")) ||
          JSON.parse(sessionStorage.getItem("profile"));
        setUserInfo(currentUser);
      }
    };

    fetchUserInfo();
  }, []);

  // (for archive entry)
  const handleArchiveEntry = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, archived: !app.archived } : app
      )
    );
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
  const filteredApplications = applications.filter((app) => {
    const isArchivedMatch =
      activeTab === "archived" ? app.archived : !app.archived;
    const matchesSearch =
      (app.company ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.position ?? "").toLowerCase().includes(searchTerm.toLowerCase());
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
    setEditEntry(null); // Ensure it's a fresh entry, not editing
    setShowModal(true); // Just open the modal
  };

  const handleDeleteEntry = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirmDelete) return;

    try {
      const currentUser =
        JSON.parse(localStorage.getItem("profile")) ||
        JSON.parse(sessionStorage.getItem("profile"));
      if (!currentUser) return alert("No user logged in");
      await deleteInternship(currentUser.id, id); // must use currentUser.id
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete entry. Check console.");
    }
  };

  // (for handling submiting button)
  //
  const handleModalSubmit = async (entry) => {
    // this gets logged in user
    const currentUser =
      JSON.parse(localStorage.getItem("profile")) ||
      JSON.parse(sessionStorage.getItem("profile"));
    if (!currentUser) {
      alert("No user found");
      return;
    }
if (entry._id) {
    const payload = {
      user: currentUser.id,
      company: entry.company,
      position: entry.position,
      applicationDate: entry.applicationDate,
      status: entry.status,
      followUpDate: entry.followUpDate,
      comments: entry.comments,
      links: entry.link
        ? [{ label: "Job Link", url: entry.link }]
        : [],
    };
    try {
      await updateInternship(currentUser.id, entry._id, payload);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update entry");
    }
  } else {
    const formData = new FormData();
    formData.append("user", currentUser.id);
    formData.append("company", entry.company);
    formData.append("position", entry.position);
    formData.append("applicationDate", entry.applicationDate || entry.date); 
    formData.append("status", entry.status);
    if (entry.followUpDate)
      formData.append("followUpDate", entry.followUpDate);
    if (entry.resume) formData.append("resume", entry.resume);
    if (entry.comments) formData.append("comments", entry.comments);
    if (entry.link) {
      formData.append("links[0][label]", "Job Link");
      formData.append("links[0][url]", entry.link);
    }

    try {
      await createInternship(formData);
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to create entry");
    }
  }

  setShowModal(false);
  setEditEntry(null);

  // Refresh applications
  const { data } = await getInternship();
  const currentUserID = currentUser?.id;
  const filteredData = data.filter(
    (intern) => String(intern.user) === String(currentUserID)
  );
  setApplications(filteredData);
};


  // (for status badges)

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-white text-[15px] font-semibold";

    if (!status || typeof status !== "string") {
      return (
        <span 
          className={baseClasses}
          style={{ backgroundColor: colors.mutedForeground }}
        >
          Unknown
        </span>
      );
    }

    switch (status.toLowerCase()) {
      case "accepted":
        return (
          <span 
            className={baseClasses}
            style={{ backgroundColor: "#10b981" }} // Green for accepted
          >
            Accepted
          </span>
        );
      case "withdrawn":
        return (
          <span 
            className={baseClasses}
            style={{ backgroundColor: colors.mutedForeground }}
          >
            Withdrawn
          </span>
        );
      case "rejected":
        return (
          <span 
            className={baseClasses}
            style={{ backgroundColor: colors.destructive }}
          >
            Rejected
          </span>
        );
      case "pending":
        return (
          <span 
            className={baseClasses}
            style={{ backgroundColor: "#f59e0b" }} // Orange for pending
          >
            Pending
          </span>
        );
      case "follow up":
        return (
          <span 
            className={baseClasses}
            style={{ backgroundColor: colors.primary }}
          >
            Follow Up
          </span>
        );
      default:
        return (
          <span 
            className={baseClasses}
            style={{ backgroundColor: colors.mutedForeground }}
          >
            {status}
          </span>
        );
    }
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
        transition={{ duration: 0.15, ease: "easeOut" }}

        className="relative min-h-screen flex items-center justify-center p-4 transition-all duration-300"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="w-[85vw] h-[85vh] rounded-3xl shadow-xl px-6 py-3 overflow-auto flex flex-col transition-all duration-300"
          style={{ 
            backgroundColor: colors.card,
            boxShadow: shadows.lg
          }}
        >
          {/* New Header Section with 70/30 Split */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: 0.02 }}
            className="flex gap-6 mb-6"
          >
            {/* Left Section - 70% */}
            <div className="w-[70%] flex flex-col gap-4">
              {/* Motivational Header */}
              <div className="text-left">
                <h1
                  className="text-3xl font-bold mb-2 transition-all duration-300"
                >
                  <GradientText>
                    Time to hustle, {userInfo?.username || "User"}!
                  </GradientText>
                </h1>
                <p
                  className="text-lg transition-all duration-300"
                  style={{ color: colors.mutedForeground }}
                >
                  Track your internship applications and stay on top of your career goals
                </p>
              </div>

              {/* Archive Tabs */}
              <div>
                <div
                  className="w-full max-w-lg p-1.5 flex justify-between rounded-2xl transition-all duration-300"
                  style={{
                    backgroundColor: colors.muted,
                    boxShadow: shadows.sm
                  }}
                >
                  <button
                    onClick={() => setActiveTab("current")}
                    className="w-1/2 py-3 text-base font-semibold flex items-center justify-center gap-3 rounded-[10px] transition-all duration-300"
                    style={{
                      backgroundColor: activeTab === "current" ? colors.card : "transparent",
                      color: activeTab === "current" ? colors.foreground : colors.mutedForeground
                    }}
                  >
                    <ClockIcon className="h-6 w-6" />
                    Current
                  </button>
                  <button
                    onClick={() => setActiveTab("archived")}
                    className="w-1/2 py-3 text-base font-semibold flex items-center justify-center gap-3 rounded-[10px] transition-all duration-300"
                    style={{
                      backgroundColor: activeTab === "archived" ? colors.card : "transparent",
                      color: activeTab === "archived" ? colors.foreground : colors.mutedForeground
                    }}
                  >
                    <ArchiveBoxIcon className="h-6 w-6" />
                    Archived
                  </button>
                </div>
              </div>
            </div>

            {/* Right Section - 30% */}
            <div className="w-[30%]">
              <FollowUpNotif
                applications={applications}
                isDark={isDark}
                onDismiss={handleDismissFollowUp}
                onMarkDone={handleMarkDoneFollowUp}
              />
            </div>
          </motion.div>

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="flex flex-wrap justify-between items-center mb-6 gap-4"
            >
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="w-5 h-5 absolute left-3 top-2.5 transition-colors"
                    style={{ color: colors.mutedForeground }}
                  />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 shadow-sm rounded-2xl w-56 border transition-all duration-200 focus:ring-2 focus:ring-primary focus:outline-none"
                    style={{
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.foreground
                    }}
                  />
                </div>

                <div className="relative w-44">
                  <ClipboardDocumentCheckIcon
                    className="w-5 h-5 absolute left-3 top-2.5 pointer-events-none transition-colors"
                    style={{ color: colors.mutedForeground }}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none shadow-sm w-full rounded-2xl py-3 pl-10 pr-8 focus:outline-none border transition-all duration-200 focus:ring-2 focus:ring-primary"
                    style={{
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.foreground
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Withdrawn">Withdrawn</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                    <option value="Follow Up">Follow Up</option>
                  </select>
                  <ChevronDownIcon
                    className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none transition-colors"
                    style={{ color: colors.mutedForeground }}
                  />
                </div>

                <div className="relative w-44">
                  <CalendarDaysIcon
                    className="w-5 h-5 absolute left-3 top-2.5 pointer-events-none transition-colors"
                    style={{ color: colors.mutedForeground }}
                  />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="appearance-none shadow-sm w-full rounded-2xl py-3 pl-10 pr-8 focus:outline-none border transition-all duration-200 focus:ring-2 focus:ring-primary"
                    style={{
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.foreground
                    }}
                  >
                    <option value="">Sort by Date</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <ChevronDownIcon
                    className="w-4 h-4 absolute right-3 top-3.5 pointer-events-none transition-colors"
                    style={{ color: colors.mutedForeground }}
                  />
                </div>
              </div>

              {/* Add Entry Button */}
              {activeTab === "current" && (
                <motion.button
                  onClick={handleAddEntry}
                  className="px-6 py-3 rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 font-semibold"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryForeground,
                    boxShadow: shadows.sm
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add New Entry
                </motion.button>
              )}
            </motion.div>

            {/* Main Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.20, delay: 0.01 }}
              className="flex-1 rounded-2xl border overflow-hidden transition-all duration-300"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                boxShadow: shadows.sm
              }}
            >
              <div className="overflow-auto h-full">
                <table className="min-w-full">
                  <thead>
                    <tr
                      className="text-base text-center"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.primaryForeground
                      }}
                    >
                      <th className="px-6 py-4 text-left font-semibold">Company</th>
                      <th className="px-6 py-4 font-semibold">Position</th>
                      <th className="px-6 py-4 font-semibold">Date Applied</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-4 py-2 font-semibold">Follow-Up Date</th>
                      <th className="px-6 py-4 font-semibold">Resume</th>
                      <th className="px-6 py-4 font-semibold">Comments</th>
                      <th className="px-6 py-4 font-semibold">Link</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-12 transition-colors"
                          style={{
                            color: colors.mutedForeground,
                          }}
                        >
                          <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl">📝</div>
                            <p className="text-xl font-medium">No applications yet</p>
                            <p className="text-base">Click "+ Add New Entry" to start tracking your applications</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((app, index) => (
                        <motion.tr
                          key={app._id || app.id}
                          className="text-base border-b transition-all duration-300 hover:scale-[1.01]"
                          style={{
                            backgroundColor: colors.card,
                            color: colors.foreground,
                            borderColor: colors.border
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: colors.accent,
                            scale: 1.01
                          }}
                        >
                          <td className="px-6 py-4 font-medium">
                            {app.company}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {app.position}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {new Date(app.applicationDate).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {app.followUpDate
                              ? new Date(app.followUpDate).toLocaleDateString("en-GB"): "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {app.resume ? (
                              <a
                                href={URL.createObjectURL(app.resume)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline transition-all duration-200 hover:scale-105"
                                style={{ color: colors.primary }}
                              >
                                View
                              </a>
                            ) : (
                              <span style={{ color: colors.mutedForeground }}>-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {app.comments ? (
                              <a
                                href={app.comments}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline transition-all duration-200 hover:scale-105"
                                style={{ color: colors.primary }}
                              >
                                View
                              </a>
                            ) : (
                              <span style={{ color: colors.mutedForeground }}>-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {Array.isArray(app.links) && app.links.length > 0 && app.links[0].url ? (
                              <a
                                href={app.links[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline transition-all duration-200 hover:scale-105"
                                style={{ color: colors.primary }}
                              >
                                {app.links[0].label || "Link"}
                              </a>
                            ) : (
                              <span style={{ color: colors.mutedForeground }}>-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                setEditEntry({
                                    ...app,
                                applicationDate: app.applicationDate
                                  ? new Date(app.applicationDate).toISOString()
                                  : "",
                                ...(app.followUpDate && {
                                  followUpDate: new Date(app.followUpDate).toISOString(),
                                }),
                              });
                                setShowModal(true);
                              }}
                                className="text-md font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{ color: colors.primary }}
                              >
                                Edit
                              </button>
                              <button
                                className="text-md font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{ color: colors.destructive }}
                                onClick={() => handleDeleteEntry(app._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Pagination */}
            {applications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}

                transition={{ duration: 0.2, delay: 0.05 }}
                className="flex justify-between items-center mt-6 px-4"

                style={{ color: colors.foreground }}
              >
                <div className="flex items-center gap-3">
                  <label htmlFor="rowsPerPage" className="font-medium text-sm">
                    Rows per page:
                  </label>
                  <select
                    id="rowsPerPage"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded-lg px-4 py-1 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary focus:outline-none"
                    style={{
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.foreground
                    }}
                  >
                    {[5, 10, 20, 30, 50].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">
                    Page {currentPage} of {Math.max(totalPages, 1)}
                  </span>

                  <div className="flex items-center gap-1">
                    {[
                      { symbol: "«", action: () => setCurrentPage(1), disabled: currentPage === 1 },
                      { symbol: "‹", action: () => setCurrentPage((p) => Math.max(p - 1, 1)), disabled: currentPage === 1 },
                      { symbol: "›", action: () => setCurrentPage((p) => Math.min(p + 1, totalPages)), disabled: currentPage === totalPages },
                      { symbol: "»", action: () => setCurrentPage(totalPages), disabled: currentPage === totalPages }
                    ].map((btn, index) => (
                      <button
                        key={index}
                        onClick={btn.action}
                        disabled={btn.disabled}
                        className="border rounded-lg px-3 py-1 text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: colors.input,
                          borderColor: colors.border,
                          color: colors.foreground
                        }}
                      >
                        {btn.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
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
    </>
  );
};

export default InternshipTable;
