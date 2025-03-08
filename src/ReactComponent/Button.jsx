import React from "react";

export default function Button({ children }) {
  return (
    <button className="text-white text-center w-28 h-12 px-6 py-3 bg-coral hover:bg-red-500 rounded-lg flex items-center justify-center shadow-md">
      {children}
    </button>
  );
}
