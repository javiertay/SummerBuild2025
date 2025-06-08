import { useState } from "react";
import { motion } from "framer-motion";
import AddEntryModal from "../components/AddEntryModal"; // adjust path as needed

const InternshipTable = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

// (for search and filter feature)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // (for page settings)
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filteredApplications = applications.filter(app => {
  const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || app.position.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter ? app.status === statusFilter : true;
  return matchesSearch && matchesStatus;
    });

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);

  const paginatedData = filteredApplications.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
  );


  const handleAddEntry = () => {
    setShowModal(true);
  }; // (for + Add Entry) 

  const handleDeleteEntry = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (confirmDelete) {
    setApplications(applications.filter(app => app.id !== id));}

  }; // (for Deleting entries, i felt extra so added prompt)

  const handleModalSubmit = (entry) => {
    const newEntry = {
      id: Date.now(),
      ...entry,
    };
    setApplications([...applications, newEntry]);
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
      <div className="w-[85vw] h-[85vh] bg-white rounded-2xl shadow-xl px-5 py-2 overflow-hidden flex flex-col">
        <div className="flex justify-between items-ce nter mb-2">
            <h6 className="text-[42px] font-bold text-gray-800 py-2">Current Internship Applications</h6></div> 
        <div>
            <p className="text-gray-600 text-[20px] text-nowrap">Manage all applications in one place. Input entries, update statuses, and monitor activity.</p>
          </div>

          {/*Search, Status filter and Add Entry   */}

          <div className="flex flex-wrap items-center justify-between w-full mt-4 mb-4">
          {/* Left section: Search and Status */}
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder=" Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded-2xl w-48"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-4 py-2 rounded-2xl w-34 text-center"
            >
              <option value="">Status</option>
              <option value="Accepted">Accepted</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </div>

          {/* Right section: Button */}
          <div>
            <button
              onClick={handleAddEntry}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              + Add Entry
            </button>
          </div>
        </div>  
        <div className="overflow-auto flex-grow rounded-2xl">
          <table className="min-w-full bg-white border border-gray-200  text-nowrap">
            <thead>
              <tr className="bg-purple-600 text-white text-[16px] text-center divide-x divide-gray-400">
                <th className="px-4 py-2 min-w-45 text-left">Company Name</th>
                <th className="px-4 py-2 min-w-30">Position</th>
                <th className="px-4 py-2 min-w-40">Application Date</th>
                <th className="px-4 py-2 min-w-30 text-center">Status</th>
                <th className="px-4 py-2 max-w-35">CV / Resume</th>
                <th className="px-4 py-2 max-w-35">Comments</th>
                <th className="px-4 py-2 min-w-20">Links</th>
                <th className="px-6 py-2 w-30 ">Actions</th>
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
                      <button className="text-blue-500 hover:underline text-[15px] font-semibold ">Edit</button>
                      <button className="text-red-500 hover:underline text-[15px] font-semibold  px-1"
                      onClick={() => handleDeleteEntry(app.id)}> Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>


          {/* table pages feature  */}

          <div className="flex justify-end items-center gap-6 mt-4 text-sm text-gray-600">
            {/* Rows per page dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="rowsPerPage" className="font-medium">Rows per page</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // reset to page 1 on change
                }}
                className="border rounded px-2 py-1 bg-white hover:bg-gray-100"
              >
                {[5, 10, 20, 30, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            {/* Page count */}
            <span className="font-medium">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>

            {/* Pagination arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              >
                &lsaquo;
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              >
                &rsaquo;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="border rounded px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              >
                &raquo;
              </button>
            </div>
          </div>

        </div>
      </div>
      

      {showModal && (
        <AddEntryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      
    </motion.div>
  );
};

export default InternshipTable;