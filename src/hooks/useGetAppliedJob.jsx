import { ApplicationContext } from "@/Store/store";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useEffect } from "react";
import { useContext } from "react";

export default function useGetAppliedJob() {
  let { appliedJob, setAppliedJob } = useContext(ApplicationContext);
  return useEffect(() => {
    let FetchedAppliedJob = async () => {
      try {
        let res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAppliedJob(res.data.applications);
        }
      } catch (error) {}
    };
    FetchedAppliedJob();
  }, []);
}
