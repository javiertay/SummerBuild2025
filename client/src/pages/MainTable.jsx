import { useState } from "react";
import { motion } from "framer-motion";
import AddEntryModal from "../components/AddEntryModal"; // adjust path as needed

const InternshipTable = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // (for page settings)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(applications.length / rowsPerPage);

  const paginatedData = applications.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage);

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
            <p className="text-gray-600 text-[24px] text-nowrap">Manage all applications in one place. Input entries, update statuses, and monitor activity.</p>
          </div>

          <div className="mt-5 mb-5 flex justify-end">
          <button onClick={handleAddEntry} 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
            + Add Entry</button>
            </div>

        <div className="overflow-auto flex-grow">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-nowrap">
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
                <tr></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="text-[15px] text-gray-800 border-t border-gray-300 even:bg-purple-50 odd:bg-white">
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
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
  <span>Showing {paginatedData.length} of {applications.length} rows</span>
  <div className="flex items-center gap-1">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
    >
      &laquo;
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1
            ? "bg-purple-600 text-white  hover:bg-purple-700 transition"
            : "hover:bg-gray-200"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
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