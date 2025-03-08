import React from "react";
import { useContext } from "react";
import JobContextProvider from "@/Store/JobContextProvider";
import { jobContext } from "@/Store/store";
import { useNavigate } from "react-router-dom";

const FeaturedJobs = () => {
  const { jobs } = useContext(jobContext);
  const job = jobs?.slice(0, 4);
  console.log(job);
  const navigate = useNavigate();
  const jobs1 = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Google",
      location: "New York, USA",
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "Facebook",
      location: "San Francisco, USA",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Apple",
      location: "Austin, USA",
    },
    {
      id: 4,
      title: "Project Manager",
      company: "Amazon",
      location: "Seattle, USA",
    },
  ];

  return (
    <section className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Featured Jobs</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {job.length == 0 ? (
          <h1 className="text-center font-semibold">No job Found</h1>
        ) : (
          <>
            {job.map((item) => (
              <div key={item._id} className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold">{item?.title}</h3>
                <p className="text-gray-600">{item?.company?.name}</p>
                <p className="text-gray-500 text-sm">{item?.location}</p>
                <button
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => navigate(`/jobdescription/${item._id}`)}
                >
                  view details
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
