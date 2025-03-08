import Navbar from "@/Homepage/Navbar";
import React, { useContext, useEffect, useState } from "react";
import DummyAdminData from "./DummyAdminData";
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import New_job from "./New_job";
import useGetAlljob from "@/Hooks/useGetAllJob";
import { companyContext, jobContext } from "@/Store/store";
import useGetAdminJob from "@/Hooks/useGetAdminJob";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import DeleteBox from "./DeleteBox";

const Admin_jobs = () => {
  useGetAdminJob();
  let navigate = useNavigate();
  const [dummyData] = useState(DummyAdminData);
  const [newJobFlag, setNewJobFlag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [myId, setMyId] = useState(null);

  let {
    adminJobFilterHandler,
    adminJobFilter,
    setAdminJobFilter,
    jobs,
    setJobs,
    searchName,
    setSearchName,
    filterJob,
    adminjob,
    setAdminJob,
    filterHandler,
  } = useContext(jobContext);
  let { company } = useContext(companyContext);
  console.log(jobs);

  console.log(searchName);
  function handleSearch(e) {
    setSearchName(e.target.value);
  }
  useEffect(() => {
    adminJobFilterHandler(searchName);
  }, [searchName]);

  async function handleDelete(id) {
    try {
      let res = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        console.log(res);
        setAdminJob((prevJobs) => prevJobs.filter((job) => job._id !== id));
      }
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="ml-5 mr-5 sm:ml-20 sm:mr-20 bg-gray-100 min-h-screen p-6 rounded-lg shadow-md">
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-md shadow-sm">
          <input
            type="text"
            placeholder="Filter by name"
            className="border border-gray-400 focus:border-blue-500 focus:outline-none w-full sm:w-1/3 rounded-md px-3 py-2 text-gray-700"
            name="searchName"
            value={searchName}
            onChange={handleSearch}
          />
          <Link to="/admin/jobs/create" className="mt-4 sm:mt-0">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-300 w-full sm:w-auto"
              onClick={() => setNewJobFlag(true)}
            >
              New Job
            </button>
          </Link>
        </div>
        <div className="mt-8 bg-white p-6 rounded-md shadow-sm">
          <table className="w-full border-collapse text-gray-800">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="border-b-2 border-gray-300 py-3 text-sm sm:text-base">
                  Company Name
                </th>
                <th className="border-b-2 border-gray-300 py-3 text-sm sm:text-base">
                  Role
                </th>
                <th className="border-b-2 border-gray-300 py-3 text-sm sm:text-base">
                  Date
                </th>
                <th className="border-b-2 border-gray-300 py-3 text-sm sm:text-base">
                  Action
                </th>
              </tr>
            </thead>
            {adminjob.length > 0 ? (
              <tbody>
                {adminJobFilter.map((item, index) => {
                  // Find the company matching the company_id in the job
                  const companyName =
                    company.find((c) => c._id === item.company)?.name ||
                    "Unknown Company";

                  return (
                    <tr
                      key={index}
                      className="text-center border-b hover:bg-gray-200 transition duration-200"
                    >
                      <td className="py-4 text-xs sm:text-sm">
                        {companyName} {/* Display matched company name */}
                      </td>
                      <td className="py-4 text-xs sm:text-sm">{item?.title}</td>
                      <td className="py-4 text-xs sm:text-sm">
                        {item?.createdAt?.split("T")[0]}
                      </td>
                      <td>
                        <div className="flex justify-center items-center space-x-4">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              navigate(`/admin/jobs/create/${item._id}`)
                            }
                          >
                            <MdModeEdit size={24} title="Edit" />
                          </button>
                          <button
                            type="button"
                            className="text-green-600 hover:text-green-800"
                            onClick={() =>
                              navigate(`/admin/jobs/${item._id}/apllicants`)
                            }
                          >
                            <FaEye size={24} title="Applicants" />
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(item._id)}
                          >
                            <MdDelete size={24} title="Delete" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 font-semibold"
                  >
                    First post the job
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {newJobFlag && <New_job setNewJobFlag={setNewJobFlag} />}
      </div>
    </>
  );
};

export default Admin_jobs;
