import { companyContext } from "@/Store/store";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect } from "react";

export default function useGetAllCompany() {
  let { company, setCompany } = useContext(companyContext);
  useEffect(() => {
    let fetchAllCompany = async () => {
      try {
        let res = await axios.get(`${ADMIN_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCompany(res.data.companies);
        }
      } catch (error) {}
    };
    fetchAllCompany();
  }, []);
  return <div></div>;
}
