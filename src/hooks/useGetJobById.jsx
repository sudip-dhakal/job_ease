import { jobContext } from "@/Store/store";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect } from "react";

export default function useGetJobById(id) {
  let { singleJob, setSingleJob } = useContext(jobContext);
  useEffect(() => {
    let fetcedJobById = async () => {
      console.log("FINAL");
      try {
        let res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSingleJob(res.data.job);
          console.log(res);
        }
      } catch (error) {}
    };
    fetcedJobById();
  }, [id]);
}
