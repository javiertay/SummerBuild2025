import { useState } from "react";
import { motion } from "framer-motion";
import AddEntryModal from "./AddEntryModal"; // adjust path as needed

const InternshipTable = () => {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddEntry = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (entry) => {
    const newEntry = {
      id: Date.now(),
      ...entry,
    };
    setApplications([...applications, newEntry]);
    setShowModal(false);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-white text-base font-semibold";
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
      className="min-h-screen flex items-center justify-center bg-[#f8f4f3] p-4"
    >
      <div className="w-[80vw] h-[75vh] bg-white rounded-2xl shadow-xl p-6 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h6 className="text-5xl font-bold text-gray-800 py-4">Current Internship Applications</h6></div> 
        <div>
            <p className="text-gray-600 text-2xl text-nowrap">Manage all applications in one place. Input entries, update statuses, and monitor activity.</p>
          </div>

          <div className="mt-5 mb-5 flex justify-end">
          <button onClick={handleAddEntry} 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
            + Add Entry</button>
            </div>

        <div className="overflow-auto flex-grow">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg text-nowrap">
            <thead>
              <tr className="bg-purple-600 text-white text-lg text-left ">
                <th className="px-4 py-2 min-w-40">Company Name</th>
                <th className="px-4 py-2 min-w-40">Position</th>
                <th className="px-4 py-2 min-w-40">Application Date</th>
                <th className="px-4 py-2 min-w-40">Status</th>
                <th className="px-4 py-2 min-w-40">CV / Resume</th>
                <th className="px-4 py-2 min-w-35">Comments</th>
                <th className="px-4 py-2 min-w-35">Links</th>
                <th className="px-6 py-2 w-30 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr></tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="text-base text-gray-700 border-t">
                    <td className="px-4 py-2 min-w-40">{app.company}</td>
                    <td className="px-4 py-2 min-w-40">{app.position}</td>
                    <td className="px-4 py-2 min-w-40">{app.date}</td>
                    <td className="px-4 py-2 min-w-40">{getStatusBadge(app.status)}</td>
                    <td className="px-4 py-2 min-w-35">{app.resume}</td>
                    <td className="px-4 py-2 min-w-35">{app.comments}</td>
                    <td className="px-4 py-2 min-w-30">{app.link}</td>
                    <td className="px-4 py-2 w-30 flex gap-2 justify-center">
                      <button className="text-blue-500 hover:underline text-base font-semibold">Edit</button>
                      <button className="text-red-500 hover:underline text-base font-semibold  px-1">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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