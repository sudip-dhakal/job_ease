import Navbar from "@/Homepage/Navbar";
import { ApplicationContext } from "@/Store/store";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { GiCheckMark } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BsThreeDots } from "react-icons/bs";
let shortListingStatus = ["accepted", "rejected"];

const Applicants = () => {
  let navigation = useNavigate();
  let params = useParams();
  let { applicants, setApplicants } = useContext(ApplicationContext);
  const [openPopover, setOpenPopover] = useState(null);

  useEffect(() => {
    let FetchedApplicants = async () => {
      try {
        let res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/applicants`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log(res.data);
          setApplicants(res.data.applicants);
        }
      } catch (error) {
        console.log(error);
      }
    };
    FetchedApplicants();
  }, []);

  let handleStatus = async (status, id) => {
    try {
      await axios.put(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status },
        { withCredentials: true }
      );
      setOpenPopover(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-0">
        <Navbar />
        <div className="mt-24 w-[90%] md:w-[80%] mx-auto bg-white p-4 md:p-6 shadow-xl rounded-xl border border-gray-300">
          <h2 className="font-bold text-xl md:text-2xl mb-4 text-gray-800 border-b-2 pb-2">
            Applicants ({applicants?.length})
          </h2>
          <div className="overflow-x-auto">
            {applicants?.length === 0 ? (
              <div className="flex flex-col md:flex-row items-center">
                <div className="text-blue-700 text-lg md:text-2xl italic inline-block">
                  No applicants yet
                </div>
                <button
                  type="button"
                  className="text-white bg-blue-700 px-3 py-2 md:px-4 md:py-2 ml-0 md:ml-4 rounded-md cursor-pointer hover:bg-blue-400 transition-all duration-300 mt-3 md:mt-0"
                  onClick={() => navigation("/admin/job")}
                >
                  Go Back
                </button>
              </div>
            ) : (
              <table className="w-full text-center border border-gray-400 shadow-md rounded-lg overflow-hidden text-xs md:text-sm">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-2 px-3 md:py-3 md:px-4 border">
                      Full Name
                    </th>
                    <th className="py-2 px-3 md:py-3 md:px-4 border">Email</th>
                    <th className="py-2 px-3 md:py-3 md:px-4 border">
                      Matching Score
                    </th>
                    <th className="py-2 px-3 md:py-3 md:px-4 border">Resume</th>

                    <th className="py-2 px-3 md:py-3 md:px-4 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants?.map((items, index) => (
                    <tr
                      key={index}
                      className="border-b bg-white hover:bg-gray-200 transition"
                    >
                      <td className="py-2 px-3 md:py-3 md:px-4 text-gray-800 font-medium">
                        {items.applicant.fullName}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4 text-gray-700">
                        {items.applicant.email}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4 font-semibold text-blue-600">
                        {items.matchingScore}
                      </td>
                      <td className="py-2 px-3 md:py-3 md:px-4">
                        <a
                          href={`http://localhost:8000/${items.applicant.resume.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline font-medium"
                        >
                          Open Resume
                        </a>
                      </td>

                      <td className="py-2 px-3 md:py-3 md:px-4">
                        <Popover
                          open={openPopover === index}
                          onOpenChange={(isOpen) =>
                            setOpenPopover(isOpen ? index : null)
                          }
                        >
                          <PopoverTrigger className="p-2 bg-gray-300 rounded-full hover:bg-gray-400 transition">
                            <BsThreeDots className="text-gray-600" />
                          </PopoverTrigger>
                          <PopoverContent className="w-24 md:w-28 mt-2 p-2 bg-white shadow-lg rounded-md border border-gray-300">
                            {shortListingStatus.map((status, idx) => (
                              <button
                                key={idx}
                                value={status}
                                onClick={() => {
                                  handleStatus(status, items.applicationId);
                                  setOpenPopover(null); // Closes popover on selection
                                }}
                                className={`w-full py-1 px-2 text-xs md:text-sm rounded-md text-white font-medium transition ${
                                  status === "accepted"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                } mt-1`}
                              >
                                {status}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Applicants;
