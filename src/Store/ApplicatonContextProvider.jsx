import React, { useContext, useState } from "react";
import { ApplicationContext } from "./store";

export default function ApplicatonContextProvider({ children }) {
  let [applicants, setApplicants] = useState([]);
  let [appliedJob, setAppliedJob] = useState([]);
  return (
    <ApplicationContext.Provider
      value={{ applicants, setApplicants, appliedJob, setAppliedJob }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
