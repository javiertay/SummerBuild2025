import React, { useState } from "react";

const AddEntryModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    date: "",
    status: "",
    resume: null,
    comments: "",
    link: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Add Internship Entry</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <input name="company" placeholder="Company Name" className="border p-2 rounded w-full" onChange={handleChange} required />
            <input name="position" placeholder="Position" className="border p-2 rounded w-full" onChange={handleChange} required />
            <input name="date" type="date" className="border p-2 rounded w-full" onChange={handleChange} required />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3"
              required
            >
              <option value="" disabled>Select status</option>
              <option value="Accepted">Accepted</option>
              <option value="Withdrawn">Withdrawn</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
              <option value="Follow Up">Follow Up</option>
            </select>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              name="resume"
              className="border p-2 rounded w-full"
              onChange={handleChange}
            />
            <textarea
              name="comments"
              placeholder="Comments"
              className="border p-2 rounded w-full h-24"
              onChange={handleChange}
            ></textarea>
            <input name="link" placeholder="Links" className="border p-2 rounded w-full" onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
