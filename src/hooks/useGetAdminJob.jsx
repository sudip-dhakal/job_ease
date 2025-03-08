import { jobContext } from "@/Store/store";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

export default function useGetAdminJob() {
  let { setAdminJob } = useContext(jobContext);
  useEffect(() => {
    let fetchedAdminJob = async () => {
      try {
        let res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });
        setAdminJob(res.data.jobs);
      } catch (error) {}
    };
    fetchedAdminJob();
  }, []);
  return <></>;
}
