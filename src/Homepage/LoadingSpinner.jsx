import React from "react";

export default function LoadingSpinner() {
  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <button class="relative flex items-center px-6 py-3 text-white bg-teal-500 rounded-md shadow-lg focus:outline-none">
        <span class="absolute inset-0 flex items-center justify-center">
          <svg
            class="w-6 h-6 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="url(#gradient)"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291V12H0a8 8 0 006 5.291z"
            ></path>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style="stop-color: #00acc1; stop-opacity: 1"
                />
                <stop
                  offset="50%"
                  style="stop-color: #ff5722; stop-opacity: 1"
                />
                <stop
                  offset="100%"
                  style="stop-color: #4caf50; stop-opacity: 1"
                />
              </linearGradient>
            </defs>
          </svg>
        </span>

        <span class="relative">Processing...</span>
      </button>
    </div>
  );
}
