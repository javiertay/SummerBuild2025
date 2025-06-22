import React from "react";
import { motion } from "framer-motion";
import { getThemeColors, getThemeShadows } from "../utils/theme";

const FollowUpNotif = ({ applications, isDark, onDismiss, onMarkDone }) => {
  const colors = getThemeColors(isDark);
  const shadows = getThemeShadows(isDark);

  const today = new Date();
  const followUps = applications.filter((app) => {
    if (app.status?.toLowerCase() !== "follow up") return false;
    const followUpDate = new Date(app.followUpDate || app.applicationDate);
    return followUpDate >= today || followUpDate < today;
  });

  if (followUps.length === 0) {
    return (
      <div
        className="h-full rounded-2xl border p-4 transition-all duration-300"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          boxShadow: shadows.sm
        }}
      >
        <h3
          className="text-lg font-semibold mb-3 transition-colors"
          style={{ color: colors.foreground }}
        >
          Follow-ups to Track
        </h3>
        <div
          className="text-center py-8 transition-colors"
          style={{ color: colors.mutedForeground }}
        >
          <div className="text-4xl mb-2">✅</div>
          <p className="text-sm">No follow-ups needed</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full rounded-2xl border p-4 transition-all duration-300 overflow-auto"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        boxShadow: shadows.sm
      }}
    >
      <h3
        className="text-lg font-semibold mb-3 transition-colors"
        style={{ color: colors.foreground }}
      >
        Follow-ups to Track ({followUps.length})
      </h3>
      <div className="space-y-3">
        {followUps.map((app, index) => (
          <motion.div
            key={app._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, delay: index * 0.05 }}
            className="p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02]"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.border
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4
                  className="font-semibold text-sm transition-colors"
                  style={{ color: colors.foreground }}
                >
                  {app.company}
                </h4>
                <p
                  className="text-xs transition-colors"
                  style={{ color: colors.mutedForeground }}
                >
                  {app.position}
                </p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => onDismiss(app._id)}
                  className="px-2 py-1 text-xs rounded transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: colors.muted,
                    color: colors.mutedForeground
                  }}
                >
                  Dismiss
                </button>
                <button
                  onClick={() => onMarkDone(app._id)}
                  className="px-2 py-1 text-xs rounded transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryForeground
                  }}
                >
                  Done
                </button>
              </div>
            </div>
            <div
              className="text-xs transition-colors"
              style={{ color: colors.mutedForeground }}
            >
              Applied: {new Date(app.applicationDate).toLocaleDateString("en-GB")}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FollowUpNotif;
