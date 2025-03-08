import Navbar from "@/Homepage/Navbar";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CompanyModel from "./Companies";
import useGetAllCompany from "@/hooks/useGetAllCompany";

export default function CreateCompany() {
  let navigate = useNavigate();
  let [companyModel, setcompanyModel] = useState(false);
  let [companyName, setCompanyName] = useState("");
  let [message, setMessage] = useState("");

  let Validation = () => {
    if (!companyName) {
      setMessage("The Company name should not be null");
      return false;
    } else if (companyName.length <= 4) {
      setMessage("The length of Company Name must be greater or equal to 4.");
      return false;
    } else {
      return true;
    }
  };

  function handleCancel() {
    navigate("/admin/companytable");
  }

  let handelSubmit = async (e) => {
    e.preventDefault();
    let validMessage = Validation();
    if (validMessage) {
      setcompanyModel(true);
    }
  };

  console.log(companyName);

  return (
    <>
      <Navbar />
      <div className="px-36 mt-20 ">
        <h1 className="text-2xl font-bold">Your Company Name</h1>
        <h3>
          What you would like to Give your company name? <br /> You can chnage
          this later.
        </h3>
        <div className="mt-6">
          <form onSubmit={handelSubmit}>
            <label for="companyName" className="block font-semibold">
              Company Name
            </label>
            <input
              type="text"
              placeholder="jobHunt,Google etc"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setMessage("");
              }}
              name="companyName"
              id="companyName"
              className="h-10 w-full border-2 border-black rounded-md p-3 block"
            ></input>
            {<p className="text-red-800">{message}</p>}
            <div className="mt-4">
              <button
                className="h-10 w-24 bg-slate-500 rounded-md "
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 w-24 bg-coral ml-5 rounded-md"
              >
                Continue
              </button>
            </div>
          </form>
          {companyModel && (
            <CompanyModel
              setcompanyModel={setcompanyModel}
              companyName={companyName}
            />
          )}
        </div>
      </div>
    </>
  );
}
