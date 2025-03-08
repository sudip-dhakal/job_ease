import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import itemContext, { jobContext } from "@/Store/store";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import useGetJobById from "@/hooks/useGetJobById";

export default function JobDescription() {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { singleJob, setSingleJob } = useContext(jobContext);
  const { user } = useContext(itemContext);
  let requirements = singleJob?.requirements?.split(",") || [];
  let [applied, setApplied] = useState(false);

  console.log(requirements);
  // const isApplied = user?._id
  //   ? singleJob?.applications?.some((application) => {
  //       console.log("Checking application:", application); // Log the applicant's ID
  //       console.log("Comparing with user._id:", user._id);
  //       return String(application.applicant) === String(user._id);
  //     })
  //   : false;

  useEffect(() => {
    if (!params.id) return;

    const fetchJobById = async () => {
      try {
        setloading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true,
        });
        console.log(res);
        if (res.data.success) {
          setSingleJob(res.data.job);
          setloading(false);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setloading(false);
      }
    };
    fetchJobById();
  }, [params.id, setSingleJob, applied]);

  const handleApply = async () => {
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${params.id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setApplied(true);
        console.log(res.data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  console.log(singleJob);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="text-2xl font-semibold text-gray-500">
            Loading...
          </span>
        </div>
      ) : (
        <div className="py-8 px-4 md:px-8 max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md shadow-black overflow-hidden">
          {/* Job Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-4">
            {singleJob?.title || "N/A"}
          </h1>

          {/* Job Details */}
          <div className="space-y-4 mt-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-wrap space-x-4">
                <span className="bg-blue-100 text-blue-600 font-semibold text-sm py-2 px-4 rounded-full shadow-md mb-2 md:mb-0">
                  {singleJob?.salary || "N/A"}
                </span>
                <span className="bg-green-100 text-green-600 font-semibold text-sm py-2 px-4 rounded-full shadow-md mb-2 md:mb-0">
                  {singleJob?.jobType || "N/A"}
                </span>
                {requirements.length > 0 &&
                  requirements.map((item, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-600 font-semibold text-sm py-2 px-4 rounded-full shadow-md mb-2 md:mb-0"
                    >
                      {item}
                    </span>
                  ))}
              </div>
              <div className="flex flex-wrap space-x-6 mt-4 md:mt-0">
                {/* Apply Button */}
                <button
                  disabled={applied}
                  onClick={!applied ? handleApply : undefined}
                  className={`h-12 w-36 rounded-md text-white font-semibold transition-all duration-300 ${
                    applied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {applied ? "Already Applied" : "Apply"}
                </button>
                {/* Back Button */}
                <button
                  className="h-12 w-36 rounded-md text-white font-semibold bg-gray-600 hover:bg-gray-700 transition-all duration-300"
                  onClick={() => navigate("/job")}
                >
                  Back
                </button>
              </div>
            </div>

            {/* Job Description Header */}
            <div className="border-t-2 border-gray-300 mt-6 pt-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Job Description
              </h2>

              {/* Job Description */}
              <div className="space-y-3">
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">Role: </span>
                  {singleJob?.title || "N/A"}
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">Location: </span>
                  {singleJob?.location || "N/A"}
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">
                    Description:{" "}
                  </span>
                  {singleJob?.description || "N/A"}
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">
                    Experience:{" "}
                  </span>
                  {singleJob?.experienceLevel || "N/A"} years
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">Salary: </span>
                  {singleJob?.salary || "N/A"}
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">
                    Total Applicants:{" "}
                  </span>
                  {singleJob?.applications?.length || "N/A"}
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-700">
                  <span className="font-bold text-indigo-600">
                    Posted Date:{" "}
                  </span>
                  {singleJob?.postedDate
                    ? new Date(singleJob.postedDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
