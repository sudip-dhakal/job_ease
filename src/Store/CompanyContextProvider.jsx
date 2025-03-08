import React, { useState } from "react";
import { companyContext } from "./store";
import useGetAllCompany from "@/hooks/useGetAllCompany";

export default function CompanyContextProvider({ children }) {
  let [singlecompany, setSingleCompany] = useState("");
  let [company, setCompany] = useState([]);
  let [searchItem, setSearchItem] = useState("");
  let [filterItem, setFilterItem] = useState([]);
  filterItem = company.filter((item) => {
    let newitem = item.name.toLowerCase().includes(searchItem.toLowerCase());
    return newitem;
  });

  return (
    <companyContext.Provider
      value={{
        filterItem,
        setFilterItem,
        singlecompany,
        setSingleCompany,
        company,
        setCompany,
        searchItem,
        setSearchItem,
      }}
    >
      {children}
    </companyContext.Provider>
  );
}
