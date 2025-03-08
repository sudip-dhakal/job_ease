import Navbar from "@/Homepage/Navbar";
import useGetAllCompany from "@/hooks/useGetAllCompany";
import useGetJobById from "@/hooks/useGetJobById";
import itemContext, { companyContext, jobContext } from "@/Store/store";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";

import React, { useContext, useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const New_job = ({ setNewJobFlag }) => {
  let navigate = useNavigate();
  let { company, setCompany } = useContext(companyContext);
  let { jobs, setJobs, singleJob, setSingleJob } = useContext(jobContext);
  let { user } = useContext(itemContext);
  const filepath = console.log(user);
  console.log(company);
  const params = useParams();
  const id = params.id;
  useEffect(() => {
    const selectedComapny = company.filter(
      (item) => item._id == singleJob.company
    );
    setCompany(selectedComapny);
  }, [params.id, singleJob]);

  console.log(singleJob);
  // Loading state for the submit button
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [Input, setInput] = useState({
    title: "",
    description: "",
    companyId: "",
    location: "",
    requirements: "",
    salary: null,
    position: "",
    jobType: "",
    experience: null,
    descriptionFile: "",
  });
  // const path = Input.descriptionFile;
  // const filename = path.split(/[/\\]/).pop();
  // console.log(filename);
  useEffect(() => {
    if (id) {
      setEditLoading(true);
      const fetchJobByID = async () => {
        try {
          let res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
            withCredentials: true,
          });
          console.log(res, "SUSHil");
          setSingleJob(res.data.job);
          setLoading(false);
        } catch (error) {
          console.log(error);
        } finally {
          setEditLoading(false);
        }
      };
      fetchJobByID();
    }
  }, [id]);

  let handelEventChange = (e) => {
    setInput({ ...Input, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };
  function handleFileChange(e) {
    setInput({ ...Input, descriptionFile: e.target.files?.[0] });
  }
  console.log(Input);

  function handelSelectChange(e) {
    setInput({ ...Input, companyId: e.target.value });
  }
  console.log(Input);
  let handelSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let formData = new FormData();

    formData.append("title", Input.title);
    formData.append("description", Input.description);
    formData.append("descriptionFile", Input.descriptionFile);
    formData.append("requirements", Input.requirements);
    formData.append("salary", Input.salary);
    formData.append("location", Input.location);
    formData.append("position", Input.position);
    formData.append("jobType", Input.jobType);
    formData.append("experience", Input.experience);
    formData.append("companyId", Input.companyId);
    formData.append("userId", user._id);
    console.log(formData);

    // Set loading to true to show spinner

    try {
      setLoading(true);
      if (!id) {
        let res = await axios.post(`${JOB_API_END_POINT}/post`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (res.data.success) {
          navigate("/admin/job");
          toast.success(res.data.message);
        }
      } else {
        let res = await axios.patch(
          `${JOB_API_END_POINT}/update/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          navigate("/admin/job");
          toast.success(res.data.message);
        }
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      // Set loading to false after the request is done
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!params.id) {
      // Initialize empty form for creating a new job
      setInput({
        title: "",
        description: "",
        companyId: "",
        location: "",
        requirements: "",
        salary: null,
        position: "",
        jobType: "",
        experience: null,
        descriptionFile: "",
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id && singleJob) {
      // Populate form fields for editing when singleJob is available
      setInput({
        title: singleJob.title || "",
        description: singleJob.description || "",
        companyId: singleJob.companyId || "",
        location: singleJob.location || "",
        requirements: singleJob.requirements ? singleJob.requirements : "",
        salary: singleJob.salary || null,
        position: singleJob.position || "",
        jobType: singleJob.jobType || "",
        experience: singleJob.experienceLevel || null,
        descriptionFile: singleJob.descriptionFile || "",
      });
    }
  }, [params.id, singleJob]);

  return (
    <>
      <Navbar />

      {editLoading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center  backdrop-blur-md bg-black/50">
          <div className="relative flex items-center justify-center"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700 tracking-wide">
            Fetching Job Details...
          </p>
        </div>
      ) : (
        <div className="  backdrop-blur-md fixed inset-0 flex justify-center items-center bg-opacity-70 ">
          <div className="w-full max-w-2xl h-[80%] mx-auto bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-2xl">Post a New Job!</h3>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => navigate("/admin/job")}
              >
                <ImCross size={20} />
              </button>
            </div>

            <form className="space-y-3" onSubmit={handelSubmit}>
              {/* Row 1 */}
              <div className="flex flex-wrap  -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="title"
                    className="block font-semibold text-gray-700"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="Job Title"
                    name="title"
                    value={Input.title}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="requirements"
                    className="block font-semibold text-gray-700"
                  >
                    Require Skills
                  </label>
                  <input
                    type="text"
                    placeholder="Requirements"
                    name="requirements"
                    value={Input.requirements}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="salary"
                    className="block font-semibold text-gray-700"
                  >
                    Salary
                  </label>
                  <input
                    type="number"
                    placeholder="Salary"
                    name="salary"
                    value={Input.salary}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="location"
                    className="block font-semibold text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location"
                    name="location"
                    value={Input.location}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="experience"
                    className="block font-semibold text-gray-700"
                  >
                    Experience
                  </label>
                  <input
                    type="number"
                    placeholder="Experience"
                    name="experience"
                    value={Input.experience}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="jobType"
                    className="block font-semibold text-gray-700"
                  >
                    Job Type
                  </label>
                  <input
                    type="text"
                    placeholder="Job Type"
                    name="jobType"
                    value={Input.jobType}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="position"
                    className="block font-semibold text-gray-700"
                  >
                    Position
                  </label>
                  <input
                    type="text"
                    placeholder="Position"
                    name="position"
                    value={Input.position}
                    onChange={handelEventChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <label
                    htmlFor="company"
                    className="block font-semibold text-gray-700"
                  >
                    Company
                  </label>
                  <select
                    className="custom-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500"
                    onChange={handelSelectChange}
                  >
                    {!params.id ? (
                      <option value="" disabled selected hidden>
                        Select a company
                      </option>
                    ) : null}
                    {company.map((item) => (
                      <option value={item._id} key={item._id} name="companyId">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Input */}
              <label
                htmlFor="descriptionFile"
                className="block font-semibold text-gray-700 mb-1"
              >
                Upload Description File
              </label>
              <div className="flex md:w-1/2 px-2 mb-4 md:mb-0 items-center justify-between">
                <div>
                  <input
                    type="file"
                    name="descriptionFile"
                    onChange={handleFileChange}
                    className="w-56"
                  />
                </div>
                {/* <div className="mx-auto ml-40">
                  <a
                    href="#"
                    className="text-teal-500 hover:underline inline-block whitespace-nowrap"
                  >
                    {filename}
                  </a>
                </div> */}
              </div>

              <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                <label
                  htmlFor="description"
                  className="block font-semibold text-gray-700"
                >
                  Description Text
                </label>
                <textarea
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={Input.description}
                  onChange={handelEventChange}
                  className="w-[300%] p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
                />
              </div>

              {/* Submit Button */}
              <div className="text-right mt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Posting...
                    </>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default New_job;
