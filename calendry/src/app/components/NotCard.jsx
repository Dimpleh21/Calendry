"use client";
import { useState } from "react";

export default function NotCard() {
  const [isSnooze, setIsSnooze] = useState(false);
  const [isStop, setIsStop] = useState(false);

  if (isStop) {
    return null; 
  }
  const handleSnooze(){
    setTimeout(() => {
      setIsSnooze(false); 
    }, 300000); 
    return <div className="text-sm text-gray-500 mt-2">Snoozed for 5 minutes</div>;
  }
  return (
    <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md max-w-xs mx-auto">
      <div className="text-center">
        <div className="text-xl font-semibold text-indigo-600 mb-4">
          Event Reminder
        </div>
        <div className="text-gray-700 mb-4">
          This is your reminder to attend the event!
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setIsStop(true)} 
          >
            Stop
          </button>
          <button
            onClick={() => setIsSnooze(!isSnooze)}
            className={`${
              isSnooze ? "bg-gray-300" : "bg-indigo-500"
            } text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            {isSnooze ? "Snoozed" : "Snooze"}
          </button>
        </div>
        {isSnooze && (
          <div className="text-sm text-gray-500 mt-2">
            Snoozed for 5 minutes
            {handleSnooze()}
          </div>
        )}
      </div>
    </div>
  );
}
