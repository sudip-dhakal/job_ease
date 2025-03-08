import Navbar from "../Homepage/Navbar";
import { BsThreeDots } from "react-icons/bs";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyContext } from "@/Store/store";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import DeleteBox from "./DeleteBox";

export default function CompaniesTable() {
  const { searchItem, setSearchItem, filterItem, company, setCompany } =
    useContext(companyContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [myId, setMyId] = useState(null);

  const handleDelete = async () => {
    try {
      let res = await axios.delete(`${ADMIN_API_END_POINT}/delete/${myId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCompany(company.filter((item) => item._id !== myId));
        console.log(res);
        toast.success(res.data.message);
      }
    } catch (error) {}
  };

  return (
    <>
      <Navbar />
      {isOpen && (
        <DeleteBox setIsOpen={setIsOpen} handleDelete={() => handleDelete()} />
      )}
      <div className="px-4 lg:px-20 mt-[80px]">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-800">
            Companies
          </h1>
          <button
            className="h-12 px-6 bg-blue-700 hover:bg-blue-500 text-white rounded-lg font-semibold transition"
            onClick={() => navigate("/admin/companies")}
          >
            Add New Company
          </button>
        </div>
        <div className="flex justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by name"
            name="searchItem"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className="h-12 w-full lg:w-96 px-4 border rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 border-b text-xs sm:text-sm lg:text-[1rem] font-semibold">
                  Logo
                </th>
                <th className="px-4 py-3 border-b text-xs sm:text-sm lg:text-[1rem] font-semibold">
                  Name
                </th>
                <th className="px-4 py-3 border-b text-xs sm:text-sm lg:text-[1rem] font-semibold">
                  Description
                </th>
                <th className="px-4 py-3 border-b text-xs sm:text-sm lg:text-[1rem] font-semibold">
                  Website
                </th>
                <th className="px-4 py-3 border-b text-xs sm:text-sm lg:text-[1rem] font-semibold">
                  Location
                </th>
                <th className="px-4 py-3 border-b text-xs sm:text-sm lg:text-[1rem] font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="pr-10 bg-white">
              {filterItem.length > 0 ? (
                filterItem.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                    } hover:bg-gray-200 transition`}
                  >
                    <td className="px-4 py-3 text-center">
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 text-xs sm:text-sm lg:text-base">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs sm:text-sm lg:text-base">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-blue-700 underline text-xs sm:text-sm lg:text-base">
                      {item.website}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-xs sm:text-sm lg:text-base">
                      {item.location}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        {/* Desktop View: Buttons are directly visible */}
                        <div className="hidden sm:flex space-x-4">
                          <FaEdit
                            cursor="pointer"
                            title="Edit"
                            size={24}
                            className="text-blue-600 hover:text-blue-400 transition"
                            onClick={() =>
                              navigate(`/admin/companies/${item._id}`)
                            }
                          />
                          <RiDeleteBack2Fill
                            cursor="pointer"
                            title="Delete"
                            size={24}
                            className="text-red-600 hover:text-red-400 transition"
                            onClick={() => {
                              setMyId(item._id);
                              setIsOpen(true);
                            }}
                          />
                        </div>

                        {/* Mobile View: Three-dot menu */}
                        <div className="sm:hidden flex justify-center relative group">
                          <button className="text-gray-600 hover:text-gray-800">
                            <BsThreeDotsVertical size={24} />
                          </button>

                          {/* Dropdown menu (visible on hover/focus) */}
                          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 space-y-2 z-10 hidden group-hover:block group-focus-within:block">
                            <button
                              className="flex items-center text-blue-600 hover:text-blue-400 w-full"
                              onClick={() =>
                                navigate(`/admin/companies/${item._id}`)
                              }
                            >
                              <FaEdit size={20} className="mr-2" /> Edit
                            </button>
                            <button
                              className="flex items-center text-red-600 hover:text-red-400 w-full"
                              onClick={() => {
                                setMyId(item._id);
                                setIsOpen(true);
                              }}
                            >
                              <RiDeleteBack2Fill size={20} className="mr-2" />{" "}
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 font-medium text-xs sm:text-sm lg:text-base"
                  >
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
