import itemContext from "@/Store/store";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Jobcard({ item }) {
  let navigate = useNavigate();
  let Id = 1;
  console.log(item);
  console.log(item?.company?.logo);
  const handleDate = (mongoDbTime) => {
    const createDate = new Date(mongoDbTime);
    const currentTime = new Date();
    const differenceTime = (currentTime - createDate) / (1000 * 24 * 60 * 60);
    return Math.floor(differenceTime);
  };

  return (
    <>
      <div className="h-auto w-[300px] m-4 p-6 rounded-lg bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden">
        {/* Job Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img
              src={item?.company?.logo}
              alt="Company Logo"
              className="h-12 w-12 rounded-full bg-neutral-200 shadow-md"
            />
            <div className="ml-3">
              <h3 className="font-bold text-lg text-gray-800">
                {item?.company?.name}
              </h3>
              <h4 className="text-sm text-gray-500">
                {handleDate(item?.postedDate) == 0
                  ? "Today"
                  : `${handleDate(item?.postedDate)} days ago`}
              </h4>
            </div>
          </div>
        </div>

        {/* Job Title */}
        <h2 className="font-extrabold text-2xl text-gray-800 mb-2 tracking-tight">
          {item?.title}
        </h2>

        {/* Job Tags */}
        <div className="flex space-x-2 mb-4">
          {/* Salary Tag */}
          <span
            className="inline-flex items-center bg-blue-200 text-blue-700 font-semibold text-xs px-3 py-1 rounded-full cursor-default"
            title="Salary"
          >
            {item?.salary}
          </span>

          {/* Employment Type Tag */}
          <span
            className="inline-flex items-center bg-green-200 text-green-700 font-semibold text-xs px-3 py-1 rounded-full cursor-default"
            title="Job type"
          >
            full_time
          </span>

          {/* Job Level Tag */}
          <span
            className="inline-flex items-center bg-yellow-200 text-yellow-700 font-semibold text-xs px-3 py-1 rounded-full cursor-default"
            title="Experience in years"
          >
            {item?.experienceLevel}
          </span>
        </div>

        {/* Location */}
        <div
          className="text-gray-700 font-medium text-sm mb-4 cursor-default"
          title="Location"
        >
          {item?.location}
        </div>

        {/* Job Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 overflow-hidden">
          {item?.description}
        </p>

        {/* View Details Button */}
        <div className="flex justify-center">
          <Link to={`/jobdescription/${item._id}`}>
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-full px-4 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-blue-600 transition-colors duration-300 ease-in-out shadow-md hover:shadow-lg">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
