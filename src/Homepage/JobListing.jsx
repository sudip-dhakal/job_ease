import React, { useContext } from "react";
import Joblist from "../ReactComponent/Jobcard";
import jobs from "../jobs";
import { jobContext } from "@/Store/store";
import useGetAlljob from "@/hooks/useGetAlljob";
import LoadingSpinner from "./LoadingSpinner";

export default function JobListing() {
  let { jobs, setJobs } = useContext(jobContext);
  useGetAlljob();
  return (
    <>
      <h1 className="text-4xl text-center mt-4 font-bold">
        Popular Job Categories
      </h1>
      <div className="pl-20 pr-20 min-h-[400px] w-full bg-white flex flex-wrap">
        {jobs.map((item) => {
          console.log(item);
          return <Joblist item={item} />;
        })}
      </div>
    </>
  );
}
