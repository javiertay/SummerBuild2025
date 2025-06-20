import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const FollowUpNotification = ({ followUps, isDark }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (followUps.length > 0) {
      setVisible(true);
    }
  }, [followUps]);

  if (!visible || followUps.length === 0) return null;

  return (
    <div className={`fixed top-6 right-6 z-50 max-w-sm w-full p-4 rounded-xl shadow-lg border transition-colors
      ${isDark ? "bg-[#2e2e2e] border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-1">Follow-Up Reminder</h3>
          <ul className="text-sm list-disc pl-5">
            {followUps.map((app) => (
              <li key={app.id}>{app.company}: Follow up was due on {new Date(app.applicationDate).toLocaleDateString("en-GB")}</li>
            ))}
          </ul>
        </div>
        <button onClick={() => setVisible(false)} className="ml-4">
          <XMarkIcon className="w-5 h-5 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default FollowUpNotification;