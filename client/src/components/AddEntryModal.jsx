import React, { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getThemeColors } from "../utils/theme";
import { motion, AnimatePresence } from "framer-motion";

const AddEntryModal = ({ onClose, onSubmit, onArchive, initialData }) => {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    applicationDate: "",
    status: "",
    followUpDate: "",
    resume: null,
    comments: null,
    link: "",
  });

  const colors = getThemeColors(false); // Modal always uses light theme for consistency

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || "",
        position: initialData.position || "",
        applicationDate: initialData?.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split("T")[0]
          : "",
        status: initialData.status || "",
        followUpDate: initialData?.followUpDate
          ? new Date(initialData.followUpDate).toISOString().split("T")[0]
          : "",
        resume: null,
        comments: initialData.comments || "",
        link: initialData.link || "",
      });
    }
  }, [initialData]);

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
    const payload = {
      ...formData,
      _id: initialData?._id,
    };
    onSubmit(payload);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          className="w-full max-w-xl max-h-[80vh] overflow-y-auto p-6 rounded-xl shadow-xl"
          style={{
            backgroundColor: colors.card,
            color: colors.foreground,
            boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.3)",
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <h4
            className="text-2xl font-semibold mb-4"
            style={{ color: colors.foreground }}
          >
            {initialData ? "Edit Internship Entry" : "Add Internship Entry"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Company */}
              <div className="flex flex-col">
                <label
                  htmlFor="company"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  placeholder="Company Name"
                  className="border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Position */}
              <div className="flex flex-col">
                <label
                  htmlFor="position"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Position
                </label>
                <input
                  id="position"
                  name="position"
                  value={formData.position}
                  placeholder="Position Applied"
                  className="border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Date */}
              <div className="flex flex-col">
                <label
                  htmlFor="date"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Date Applied
                </label>
                <input
                  id="applicationDate"
                  name="applicationDate"
                  type="date"
                  value={formData.applicationDate}
                  className="border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Followup Dates */}
              <div className="flex flex-col">
                <label
                  htmlFor="followUpDate"
                  className="mb-1 text-base text-gray-700"
                >
                  Follow-Up Date [Optional]
                </label>
                <input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate || ""}
                  className="border p-2 rounded w-full"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                />
              </div>
              {/* Status */}
              <div className="flex flex-col">
                <label
                  htmlFor="status"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Application Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-md py-2 px-2 transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="Accepted">Accepted</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
              </div>{" "}
              {/* Resume Upload */}
              <div className="flex flex-col">
                <label
                  htmlFor="resume"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Upload CV / Resume [Optional, PDF only]
                </label>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                />
                {formData.resume && (
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.mutedForeground }}
                  >
                    Selected:{" "}
                    <span style={{ color: colors.primary }}>
                      {formData.resume.name}
                    </span>
                    {!formData.resume.name.toLowerCase().endsWith(".pdf") && (
                      <span className="text-red-500 block">
                        Warning: Only PDF files are allowed!
                      </span>
                    )}
                  </p>
                )}
              </div>
              {/* Comments Upload */}
              {/* Comments Text Input */}
              <div className="flex flex-col">
                <label
                  htmlFor="comments"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Comments [Optional]
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  value={formData.comments || ""}
                  placeholder="Write any comments or notes here..."
                  className="border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              {/* Link */}
              <div className="flex flex-col">
                <label
                  htmlFor="link"
                  className="mb-1 text-base"
                  style={{ color: colors.foreground }}
                >
                  Job Link/Portal [Optional]
                </label>
                <input
                  id="link"
                  name="link"
                  value={formData.link}
                  placeholder="https://..."
                  className="border p-2 rounded w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center pt-4">
              {/* Archive Entry button */}
              {initialData && (
                <button
                  type="button"
                  onClick={() => {
                    console.log("archived:", initialData._id);
                    onArchive(initialData._id);
                    onClose();
                  }}
                  className="text-white px-4 py-2 rounded whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: initialData.archived
                      ? "#10b981"
                      : "#f59e0b",
                  }}
                >
                  {initialData.archived ? "Retrieve Entry" : "Archive Entry"}
                </button>
              )}

              {/* Cancel and Submit buttons */}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: colors.muted,
                    color: colors.mutedForeground,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white px-4 py-2 rounded whitespace-nowrap inline-flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryForeground,
                  }}
                >
                  <PlusIcon className="w-5 h-5 text-white" />
                  {initialData ? "Update Entry" : "Add Entry"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEntryModal;
