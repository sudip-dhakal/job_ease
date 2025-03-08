import itemContext from "@/Store/store";
import React, { useContext, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  let { filter, setFilter, applyfilter, user } = useContext(itemContext);
  let location = useRef("");
  let keyword = useRef("");
  let navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    let loc = location.current.value;
    let keyw = keyword.current.value;
    applyfilter(keyw, loc);
    navigate("/browse");
  }

  return (
    <>
  <div className="min-h-screen w-full bg-hero-pattern bg-cover relative flex items-center px-6 sm:px-12 bg-black/70">
    <div className="z-10 p-6 sm:p-10 text-offWhite space-y-6 max-w-2xl ml-6 sm:ml-24">
      <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
        Find Your Dream Job
      </h1>
      <h2 className="text-xl sm:text-2xl font-light">
        Thousands of jobs are available for you
      </h2>

      <div className="flex flex-col sm:flex-row mt-6 w-full sm:w-auto outline-black space-y-4 sm:space-y-0">
        {user?.role == "user" && (
          <form className="flex flex-col sm:flex-row w-full sm:w-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter keyword"
              className="h-12 sm:h-16 w-full sm:w-72 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none bg-darkGray text-black pl-4 border-b-2 sm:border-r-2 border-solid border-gray-700 outline-none text-lg sm:text-[20px]"
              name="keyword"
              ref={keyword}
            />
            <input
              type="text"
              placeholder="Enter location"
              className="h-12 sm:h-16 w-full sm:w-72 bg-white pl-4 border-none outline-none text-black text-lg sm:text-[20px]"
              name="location"
              ref={location}
            />
            <button
              type="submit"
              className="h-12 sm:h-16 w-full sm:w-16 flex items-center justify-center bg-gray-500 rounded-b-lg sm:rounded-r-lg sm:rounded-b-none hover:bg-slate-400"
            >
              <FaSearch className="text-white text-xl" />
            </button>
          </form>
        )}
      </div>
    </div>
  </div>
</>

  );
}
