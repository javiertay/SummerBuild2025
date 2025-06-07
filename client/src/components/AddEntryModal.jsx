import React, { useState } from "react";

const AddEntryModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    date: "",
    status: "",
    resume: null,
    comments: null,
    link: ""
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" || name === "commentsFile") {
      setFormData({
        ...formData,
        [name === "resume" ? "resume" : "comments"]: files[0],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-700/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl max-h-[80vh] overflow-y-auto p-6 rounded-xl shadow-xl">
        <h4 className="text-2xl font-semibold mb-4">Add Internship Entry</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">

            {/* Company */}
            <div className="flex flex-col">
              <label htmlFor="company" className="mb-1 text-base text-gray-700">Company</label>
              <input
                id="company"
                name="company"
                placeholder="Company Name"
                className="border p-2 rounded w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Position */}
            <div className="flex flex-col">
              <label htmlFor="position" className="mb-1 text-base text-gray-700">Position</label>
              <input
                id="position"
                name="position"
                placeholder="Position Applied"
                className="border p-2 rounded w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label htmlFor="date" className="mb-1 text-base text-gray-700">Date Applied</label>
              <input
                id="date"
                name="date"
                type="date"
                className="border p-2 rounded w-full"
                onChange={handleChange}
                required
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label htmlFor="status" className="mb-1 text-base text-gray-700">Application Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-md py-2 px-2"
                required
              >
                <option value="" disabled>Select Status</option>
                <option value="Accepted">Accepted</option>
                <option value="Withdrawn">Withdrawn</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
                <option value="Follow Up">Follow Up</option>
              </select>
            </div>

            {/* Resume Upload */}
            <div className="flex flex-col">
              <label htmlFor="resume" className="mb-1 text-base text-gray-700">Upload CV / Resume [Optional]</label>
              <input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0
                           file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700
                           hover:file:bg-purple-100 border p-2 rounded w-full"
                onChange={handleChange}
              />
              {formData.resume && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: <span className="text-blue-600">{formData.resume.name}</span>
                </p>
              )}
            </div>

            {/* Comments Upload */}
            <div className="flex flex-col">
              <label htmlFor="commentsFile" className="mb-1 text-base text-gray-700">Upload Comments [Optional]</label>
              <input
                id="commentsFile"
                name="commentsFile"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0
                           file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700
                           hover:file:bg-purple-100 border p-2 rounded w-full"
                onChange={handleChange}
              />
              {formData.comments && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: <span className="text-blue-600">{formData.comments.name}</span>
                </p>
              )}
            </div>

            {/* Link */}
            <div className="flex flex-col">
              <label htmlFor="link" className="mb-1 text-base text-gray-700">Job Link/Portal [Optional]</label>
              <input
                id="link"
                name="link"
                placeholder="https://..."
                className="border p-2 rounded w-full"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 whitespace-nowrap"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
