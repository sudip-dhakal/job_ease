import React from "react";
import { FaSearch, FaClipboardCheck, FaBriefcase } from "react-icons/fa";

const steps = [
  {
    icon: <FaSearch size={40} className="text-blue-500" />,
    title: "Search for Jobs",
    description:
      "Use our advanced search filters to find the perfect job for you.",
  },
  {
    icon: <FaClipboardCheck size={40} className="text-blue-500" />,
    title: "Apply Easily",
    description:
      "Submit your application with just a few clicks and track your progress.",
  },
  {
    icon: <FaBriefcase size={40} className="text-blue-500" />,
    title: "Get Hired",
    description: "Connect with top employers and land your dream job.",
  },
];

const HowItWorks = () => {
  return (
    <section className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6 text-center">
        {steps.map((step, index) => (
          <div key={index} className="p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
