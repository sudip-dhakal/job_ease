import React, { useContext, useState } from "react";
import Navbar from "../Homepage/Navbar";
import { FaSearch } from "react-icons/fa";
import Joblist from "./Jobcard";
import { Slider } from "../components/ui/slider";
import itemContext, { jobContext } from "@/Store/store";
import useGetAlljob from "@/Hooks/useGetAlljob";

export default function Job() {
  useGetAlljob();
  const filterData = [
    {
      FilterType: "Location",
      array: ["Kathmandu", "Pokhara", "Butwal", "Chitwan", "Jhapa"],
    },
    {
      FilterType: "Industry",
      array: ["Fullstack Developer", "Frontend Developer", "AWS"],
    },
    {
      FilterType: "Skills",
      array: ["html", "css", "python"],
    },
  ];

  const { jobs, filterJob, setFilterJob, filterHandler } =
    useContext(jobContext);

  // Track the selected filter
  const [selectedFilter, setSelectedFilter] = useState("");

  // Handle filter change
  function handleChange(e) {
    const filterValue = e.target.value;
    setSelectedFilter(filterValue); // Update the selected filter state
    filterHandler(filterValue); // Call the filter handler with the new value
  }

  // Handle clear filter
  function handleClear() {
    setSelectedFilter(""); // Reset the selected filter
    setFilterJob(jobs); // Reset the jobs to show all
  }

  return (
    <>
      <Navbar />

      <div className="lg:px-20 px-4 mt-20 flex flex-col lg:flex-row">
        <h1 className="text-2xl font-bold mb-2 lg:fixed">Find Job</h1>

        <div className="h-auto lg:h-screen w-full lg:w-48 mt-8 shadow-md p-6 lg:fixed">
          {filterData.map((item) => (
            <div key={item?.FilterType}>
              <h1 className="font-bold">{item.FilterType}</h1>
              {item?.array.map((data) => (
                <div key={data}>
                  <input
                    type="radio"
                    value={data}
                    id={data}
                    name={item?.FilterType}
                    checked={selectedFilter === data}
                    onChange={handleChange}
                  />
                  <label htmlFor={data}>{data}</label>
                  <br />
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600 w-full"
          >
            Clear Filters
          </button>
        </div>

        <div className="lg:ml-48 mt-4 flex flex-wrap">
          {filterJob.length == 0 ? (
            <h1 className="ml-96 mt-60 font-semibold">No Job Found</h1>
          ) : (
            <>
              {filterJob.map((item) => (
                <Joblist item={item} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
