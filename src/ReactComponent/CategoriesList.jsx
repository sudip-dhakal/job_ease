import React from "react";

const jobCategories = [
  "Software Development",
  "Data Science",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Design",
  "Project Management",
];

const CategoriesList = () => {
  return (
    <section className="p-8 bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Job Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jobCategories.map((category, index) => (
          <div
            key={index}
            className="p-4 bg-gray-100 shadow-md rounded-lg text-center cursor-pointer hover:bg-blue-500 hover:text-white transition"
          >
            {category}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesList;
