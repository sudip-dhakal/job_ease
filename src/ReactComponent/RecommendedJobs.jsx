import { useContext, useEffect, useState } from "react";
import axios from "axios";
import itemContext from "@/Store/store";
import { useNavigate } from "react-router-dom";

const RecommendedJobs = () => {
  let { user } = useContext(itemContext);
  let [recommendJob, setRecommendJob] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?._id) return; // Avoid API call if userId is not provided

      try {
        const response = await axios.get(
          `http://localhost:8000/api/recommend-jobs?user_id=${user._id}`
        );
        setRecommendJob(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs(); // Call API when component mounts or userId changes
  }, [user?._id]); // Re-run when userId changes

  return (
    <>
      {recommendJob.length === 0 ? (
        <h1 className="font-bold text-2xl text-center mt-4">
          No recommended jobs for you
        </h1>
      ) : (
        <>
          <h1 className="font-bold text-2xl text-center mb-4">
            Recommended jobs for you
          </h1>
          <div className="flex flex-wrap justify-center">
            {recommendJob?.map((jobs) => (
              <div
                key={jobs._id}
                className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-6 m-4"
              >
                {/* Job Title */}
                <h2 className="text-xl font-semibold text-gray-900">
                  {jobs.title}
                </h2>

                {/* Job Type & Experience */}
                <p className="text-sm text-gray-500 mt-1">
                  {jobs.jobType} | {jobs.experienceLevel} years exp.
                </p>

                {/* Job Description */}
                <p className="text-gray-600 mt-3">{jobs.description}</p>

                {/* Job Requirements (Converted from String to Array) */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {jobs.requirements ? (
                    jobs.requirements
                      .split(",") // Split string into an array by commas
                      .map((requirement, index) => (
                        <span
                          key={index}
                          className="bg-cyan-600 text-black px-3 py-1 text-sm rounded-full"
                        >
                          {requirement.trim()} {/* Trim spaces */}
                        </span>
                      ))
                  ) : (
                    <span className="text-gray-500">
                      No specific requirements
                    </span>
                  )}
                </div>

                {/* Location & Posted Date */}
                <div className="flex justify-between items-center text-gray-500 text-sm mt-3">
                  <p>{jobs.location}</p>
                  <p>{new Date(jobs.postedDate).toLocaleDateString()}</p>
                </div>

                {/* Salary */}
                <p className="text-lg font-semibold text-gray-900 mt-3">
                  Salary: NPR {jobs.salary}
                </p>

                {/* Apply Button */}
                <button
                  className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
                  onClick={() => navigate(`/jobdescription/${jobs._id}`)}
                >
                  View details
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default RecommendedJobs;
