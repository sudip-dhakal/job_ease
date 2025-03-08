import React, { useEffect, useState } from "react";
import { jobContext } from "./store";

export default function JobContextProvider({ children }) {
  let [jobs, setJobs] = useState([]);
  let [singleJob, setSingleJob] = useState([]);
  let [searchName, setSearchName] = useState(null);
  let [filterJob, setFilterJob] = useState([]);

  let [adminjob, setAdminJob] = useState([]);
  let [adminJobFilter, setAdminJobFilter] = useState([]);
  function filterHandler(filter) {
    console.log(filter);
    if (!filter) {
      setFilterJob(jobs);
    } else {
      let filterJob1 = jobs.filter((item) => {
        return (
          item.title.toLowerCase().includes(filter.toLowerCase()) ||
          item.location.toLowerCase().includes(filter.toLowerCase()) ||
          item.requirements.includes(filter.toLowerCase())
        );
      });
      setFilterJob(filterJob1);
    }
  }
  function adminJobFilterHandler(filter) {
    console.log(filter);
    if (!filter) {
      setAdminJobFilter(adminjob);
    } else {
      let filterJob1 = adminjob.filter((item) => {
        return (
          item.title.toLowerCase().includes(filter.toLowerCase()) ||
          item.location.toLowerCase().includes(filter.toLowerCase()) ||
          item.requirements.includes(filter.toLowerCase())
        );
      });
      setAdminJobFilter(filterJob1);
    }
  }

  useEffect(() => {
    setFilterJob(jobs);
  }, [jobs]);

  useEffect(() => {
    setAdminJobFilter(adminjob);
  }, [adminjob]);
  return (
    <jobContext.Provider
      value={{
        filterHandler,
        adminJobFilterHandler,
        adminJobFilter,
        setAdminJobFilter,
        filterJob,
        setFilterJob,
        adminjob,
        setAdminJob,
        jobs,
        setJobs,
        singleJob,
        setSingleJob,
        searchName,
        setSearchName,
      }}
    >
      {children}
    </jobContext.Provider>
  );
}
