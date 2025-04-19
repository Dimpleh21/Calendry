"use client";
import { useState } from "react";
const Notify = ({ data, onClose }) => {
  return (
    <div className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-3 rounded shadow-lg z-50">
      <div className="font-bold">Event Created</div>
      <div>{data.title}</div>
      <button
        className="mt-2 bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 cursor-pointer"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default Notify;
