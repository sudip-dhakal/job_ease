import { jobContext } from "@/Store/store";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect } from "react";

export default function useGetAlljob() {
  let { setJobs } = useContext(jobContext);
  useEffect(() => {
    let fetchAllJob = async () => {
      //since api fetching is the asynchronous task so we use the function like this
      try {
        let res = await axios.get(`${JOB_API_END_POINT}/get`, {
          withCredentials: true,
        });

        console.log(res.data);
        if (res.data.success) {
          setJobs(res.data.jobs);
        }
      } catch (error) {}
    };
    fetchAllJob();
  }, []);
  return <></>;
}
