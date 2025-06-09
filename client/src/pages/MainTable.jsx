import { useState } from "react";
import { motion } from "framer-motion";
import AddEntryModal from "../components/AddEntryModal"; // adjust path as neededz
import {
  MagnifyingGlassIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const InternshipTable = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // (for edit)
  const [editEntry, setEditEntry] = useState(null);

  //(for search and filter feature)

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // (for page and date settings)

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filteredApplications = applications.filter(app => {
  const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || app.position.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter ? app.status === statusFilter : true;
  return matchesSearch && matchesStatus;
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
    setShowModal(true);
  }; 

  // (for Deleting entries, i felt extra so added prompt)

  const handleDeleteEntry = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (confirmDelete) {
    setApplications(applications.filter(app => app.id !== id));}
  }; 

  const handleModalSubmit = (entry) => {
  if (editEntry) {
    setApplications(applications.map(app =>
      app.id === editEntry.id ? { ...app, ...entry, id: editEntry.id } : app
    ));
    setEditEntry(null);
  } else {
    setApplications([...applications, { id: Date.now(), ...entry }]);
  }
  setShowModal(false);
};


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
      className="min-h-screen flex items-center justify-center bg-[#ecdbf3f4] p-4"
    >
      <div className="w-[85vw] h-[85vh] bg-white rounded-2xl shadow-xl px-5 py-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-1">
            <h6 className="text-[42px] font-bold text-gray-800 py-1">Current Internship Applications</h6></div> 
        <div>
            <p className="text-gray-600 text-[20px] mb-4 text-nowrap">Manage all applications in one place. Input entries, update statuses, and monitor activity.</p>
          </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white border border-gray-100 rounded-xl shadow-sm mb-4">

          {/*Search, Status filter and Add Entry  */}

          <div className="flex flex-wrap items-center justify-between w-full mt-3 mb-3 mx-4">

          {/* Left section: Search and Status */}

          <div className="flex gap-4 flex-wrap border-gray-100">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 border-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Company Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-400 rounded-2xl w-48"
                />
              </div>
              

                {/* Select status dropdown */}

              <div className="relative w-40">
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none w-full border rounded-2xl border-gray-400 py-2 pl-10 pr-8 text-gray-700 focus:outline-none"
                >
                  <option value="">Status</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>


              {/* Date filter dropdown */}

              <div className="relative w-40">
                <CalendarDaysIcon className="w-5 h-5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)} 
                  className="appearance-none w-full border rounded-2xl border-gray-400 py-2 pl-10 pr-8 text-gray-700 focus:outline-none"
                >
                  <option value="">Date</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
          </div>

              {/* Add Entry Button */}

              <div>
                <button
                  onClick={handleAddEntry}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg shadow hover:bg-purple-700 transition"
                >
                  + Add Entry
                </button>
              </div>
            </div> 
          </div>


        {/* MAIN TABLE!!! */}

        <div className="overflow-auto flex-grow">
          <table className="min-w-full bg-white border border-gray-100 text-nowrap">
            <thead>
              <tr className="bg-purple-600 text-white text-[16px] text-center divide-x divide-gray-400">
                <th className="px-4 py-2 min-w-45 text-left rounded-tl-xl">Company Name</th>
                <th className="px-4 py-2 min-w-30">Position</th>
                <th className="px-4 py-2 min-w-40">Application Date</th>
                <th className="px-4 py-2 min-w-30 text-center">Status</th>
                <th className="px-4 py-2 max-w-35">CV / Resume</th>
                <th className="px-4 py-2 max-w-35">Comments</th>
                <th className="px-4 py-2 min-w-20">Links</th>
                <th className="px-6 py-4 w-30 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-6">No applications yet. Click "+ Add Entry" to begin.</td>
                </tr>
              ) : (
                paginatedData.map((app) => (
                  <tr key={app.id} className="text-[15px] text-gray-800 border-t border-gray-300 even:bg-purple-50 odd:bg-white hover:bg-gray-100 ">
                    <td className="px-4 py-2 max-w-40 break-words whitespace-normal">{app.company}</td>
                    <td className="px-4 py-2 min-w-40">{app.position}</td>
                    <td className="px-4 py-2 min-w-40 text-center">{app.date}</td>
                    <td className="px-4 py-2 min-w-40 text-center">{getStatusBadge(app.status)}</td>

                    {/* to view the resume file in the main table, if no file replace with '-' */}
                    <td className="px-4 py-2 min-w-35 text-center"> {app.resume ? (
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
                    <td className="px-4 py-2 min-w-35 text-center">{app.comments ? (
                        <a
                          href={URL.createObjectURL(app.comments)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-[15px]"
                        >
                        Click to View
                        </a>
                      ) : ("-")}
                    </td>
                    <td className="px-4 py-2 max-w-35 break-words whitespace-normal">{app.link}</td>
                    <td className="px-4 py-2 w-30 flex gap-2 text-center">
                      <button 
                      onClick={() => {
                        setEditEntry(app);
                        setShowModal(true);
                      }}
                      className="text-blue-500 hover:underline text-[15px] font-semibold ">Edit</button>
                      <button className="text-red-500 hover:underline text-[15px] font-semibold  px-1"
                      onClick={() => handleDeleteEntry(app.id)}> Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Table bottom and Pagination */}

            <tfoot>
              <tr>
                <td colSpan="8" className="px-4 py-4 text-right bg-purple-100 rounded-b-xl">
                  <div className="flex justify-end items-center gap-6 text-sm text-gray-600 rounded ">
                    <div className="flex items-center gap-2">
                      <label htmlFor="rowsPerPage" className="font-medium">Rows per page</label>
                      <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border rounded px-2 py-1 bg-purple-100 hover:bg-gray-100"
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
                        className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-70">&laquo;</button>
                      <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                        className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-70">&lsaquo;</button>
                      <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                        className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-70">&rsaquo;</button>
                      <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                        className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-70">&raquo;</button>
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
          onClose={()=> {
            setShowModal(false);
            setEditEntry(null);
          }}
          onSubmit={handleModalSubmit}
          initialData={editEntry}
        />
      )}
      
    </motion.div>
  );
};

export default InternshipTable;