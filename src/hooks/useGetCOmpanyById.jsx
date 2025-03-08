import { companyContext } from "@/Store/store";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect } from "react";

export default function useGetCOmpanyById(id) {
  let { singlecompany, setSingleCompany } = useContext(companyContext);
  useEffect(() => {
    let fetchedCompanyById = async () => {
      let res = await axios.get(`${ADMIN_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setSingleCompany(res.data.company);
      }
    };
    fetchedCompanyById();
  }, [id]);
  return <></>;
}
