import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="p-8 bg-blue-600 text-white text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
      <p className="mb-6">
        Join thousands of job seekers and land your ideal role today.
      </p>
      <button
        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
        onClick={() => navigate("/job")}
      >
        Get Started Now
      </button>
    </section>
  );
};

export default CTASection;
