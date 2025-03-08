import React, { useContext, useState } from "react";
import { MdEdit } from "react-icons/md";
import { SiGmail } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import Skillset from "./Skillset";
import lists from "./UserJobAppliedDetails";
import Edit from "./Edit";
import itemContext, { ApplicationContext } from "@/Store/store";
import useGetAppliedJob from "@/Hooks/useGetAppliedJob";

const Profile = () => {
  const [userAppliedList, setUserAppliedList] = useState(lists);
  const [showEdit, setShowEdit] = useState(false);
  let { user } = useContext(itemContext);
  let { appliedJob, setAppliedJob } = useContext(ApplicationContext);
  useGetAppliedJob();
  console.log(user);

  console.log(user);
  // let data = JSON.parse(user.profile.skills);

  return (
    <>
      <div className="w-full sm:w-[90%] md:w-[70%] mt-10 mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-lg">
        <div className="flex flex-col sm:flex-row items-center mb-6 text-center sm:text-left">
          <img
            src={user.profile.profilePic}
            className="w-16 h-16 rounded-full shadow-md"
            alt="User Profile"
          />
          <div className="mt-4 sm:mt-0 sm:ml-6">
            <h1 className="font-bold text-xl sm:text-2xl text-gray-800">
              {user.fullName}
            </h1>
            <p className="text-sm text-gray-600">{user.profile.bio}</p>
          </div>
          <MdEdit
            onClick={() => setShowEdit(true)}
            size={24}
            className="cursor-pointer mt-2 sm:mt-0 sm:ml-auto text-gray-600 hover:text-blue-500"
          />
        </div>

        <div className="sm:ml-6">
          <p className="flex items-center gap-3 mb-3 text-gray-700 text-sm sm:text-base">
            <SiGmail size={18} className="text-blue-500" />
            <span>{user.email}</span>
          </p>
          <p className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
            <FaPhoneAlt size={18} className="text-green-500" />
            <span>{user.phoneNumber}</span>
          </p>
        </div>

        <div className="mt-6 sm:ml-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {user.profile.skills.map((item) => (
              <Skillset name={item} key={item} />
            ))}
          </div>
          <h3 className="font-semibold mt-4">Resume</h3>
          {/* {user.profile.resume !== "No resume provided" ? (
            <span>
              <a
                href={`http://localhost:8000/${user.resumeData.resumeFilePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Open Resume
              </a>
            </span>
          ) : (
            <p className="text-blue-700 italic">No Resume Provided</p>
          )} */}
        </div>

        <div className="mt-8">
          <h1 className="font-bold text-lg sm:text-xl text-gray-800">
            Applied Jobs
          </h1>
          <div className="overflow-x-auto">
            <table className="mt-4 w-full border-collapse text-xs sm:text-sm border border-gray-300 min-w-max">
              <caption className="text-sm sm:text-base font-semibold p-3 bg-gray-200 text-gray-800">
                Applied Jobs
              </caption>
              <thead>
                <tr className="bg-gray-300 text-gray-700 text-left">
                  <th className="p-2 sm:p-3 border border-gray-400">Date</th>
                  <th className="p-2 sm:p-3 border border-gray-400">
                    Job Role
                  </th>
                  <th className="p-2 sm:p-3 border border-gray-400">Company</th>
                  <th className="p-2 sm:p-3 border border-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {appliedJob.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white hover:bg-gray-100 transition-colors"
                  >
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {item.createdAt.split("T")[0]}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {item?.job?.title || ""}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {item?.job?.company?.name || ""}
                    </td>
                    <td className="p-2 sm:p-3 border border-gray-300">
                      {item.status || ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <Edit setShowEdit={setShowEdit} />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
