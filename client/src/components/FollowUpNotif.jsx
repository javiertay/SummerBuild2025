import { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FollowUpNotification = ({ applications, isDark, onMarkDone, onDismiss }) => {
  const today = new Date();
  const [visible, setVisible] = useState(true);

  const getFollowUpCategory = (app) => {
    const followUpDate = new Date(app.followUpDate || app.applicationDate);
    const diffDays = Math.floor((followUpDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < -7) return null;
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";
    if (diffDays <= 2) return "upcoming";
    return null;
  };

  const categorizedFollowUps = { overdue: [], today: [], upcoming: [] };

  applications
    ?.filter((app) => app.status?.toLowerCase() === "follow up")
    .forEach((app) => {
      const category = getFollowUpCategory(app);
      if (category) categorizedFollowUps[category].push(app);
    });

  useEffect(() => {
    if (
      categorizedFollowUps.overdue.length ||
      categorizedFollowUps.today.length ||
      categorizedFollowUps.upcoming.length
    ) {
      setVisible(true);
    }
  }, [applications]);

  if (!visible) return null;

  const renderCard = (app, colorClass, statusText) => (
    <div
      key={app._id || app.id}
      className={`flex justify-between items-center px-4 py-3 rounded-lg shadow-sm border-l-4 ${colorClass} bg-white text-gray-800`}
    >
      <div>
        <p className="font-semibold text-sm">
          {app.company} — {app.position} (
          <span className="text-gray-500">
            {new Date(app.followUpDate || app.applicationDate).toLocaleDateString("en-GB")}
          </span>
          )
        </p>
        <p className="text-sm text-gray-500">{statusText}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onMarkDone(app._id || app.id)}
          className="p-1 rounded-full hover:bg-green-100 hover:text-green-600 transition"
        >
          <CheckIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDismiss(app._id || app.id)}
          className="p-1 rounded-full hover:bg-red-100 hover:text-red-600 transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full py-4 flex justify-center transition-colors ${
        isDark ? "bg-[#333333]" : "bg-[rgba(236,219,243,0.4)]"
      }`}
    >
      <div
        className={`w-[90%] max-w-5xl p-6 rounded-xl shadow-md transition-colors ${
          isDark ? "bg-[#2b2b2b] text-white" : "bg-[rgba(236,219,243,0.4)] text-gray-800"
        }`}
      >
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
          <span>🔔</span> Follow-Ups to Track
        </h3>

        {categorizedFollowUps.overdue.length > 0 && (
          <div className="space-y-3 mb-4">
            {categorizedFollowUps.overdue.map((app) =>
              renderCard(app, "border-red-500", "Follow-up overdue")
            )}
          </div>
        )}

        {categorizedFollowUps.today.length > 0 && (
          <div className="space-y-3 mb-4">
            {categorizedFollowUps.today.map((app) =>
              renderCard(app, "border-yellow-400", "Follow-up today")
            )}
          </div>
        )}

        {categorizedFollowUps.upcoming.length > 0 && (
          <div className="space-y-3">
            {categorizedFollowUps.upcoming.map((app) =>
              renderCard(app, "border-green-500", "Upcoming interview")
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpNotification;
