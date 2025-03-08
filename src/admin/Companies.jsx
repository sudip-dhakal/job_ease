import Navbar from "@/Homepage/Navbar";
import useGetCOmpanyById from "@/hooks/useGetCOmpanyById";
import { companyContext } from "@/Store/store";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Companies({ setcompanyModel, companyName }) {
  let navigate = useNavigate();
  let { singlecompany, setSingleCompany } = useContext(companyContext);
  let params = useParams();
  const id = params.id;
  console.log(id);
  console.log(singlecompany);

  let [loading, setLoading] = useState(false); // Manage loading state
  let [editLoading, setEditLoading] = useState(false);
  let [company, setCompany] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: "",
  });
  // const url = company.file;

  // const filename = url.split("/").pop();
  // console.log(filename); // Output: s5axox5qhmokdqhccyuc.png

  function handelEventChange(e) {
    setCompany({ ...company, [e.target.name]: e.target.value });
  }

  function handelFileChange(e) {
    setCompany({ ...company, file: e.target.files?.[0] });
  }
  console.log(company);
  useEffect(() => {
    let fetchCompanyByID = async () => {
      if (id) {
        setEditLoading(true);
        try {
          let res = await axios.get(`${ADMIN_API_END_POINT}/get/${id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            setSingleCompany(res.data.company);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setEditLoading(false);
        }
      }
    };
    fetchCompanyByID();
  }, [id]);

  let handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting the form
    //companyName, description, website, location
    let formData = new FormData();
    formData.append("companyName", company.name);
    formData.append("description", company.description);
    formData.append("website", company.website);
    formData.append("location", company.location);
    formData.append("logo", company.file);

    try {
      if (!id) {
        let res = await axios.post(
          `${ADMIN_API_END_POINT}/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);

          navigate("/admin/companytable");
        }
      } else {
        let res = await axios.put(
          `${ADMIN_API_END_POINT}/update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);

          navigate("/admin/companytable");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the company.");
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };
  useEffect(() => {
    if (!id) {
      setCompany({
        name: "",
        description: "",
        website: "",
        location: "",
        file: "",
      });
    }
  }, []);

  useEffect(() => {
    // Reset the form to empty when params.id changes

    // Populate the form with the new company's data
    if (params.id && singlecompany) {
      setCompany({
        name: singlecompany.name || "",
        description: singlecompany.description || "",
        website: singlecompany.website || "",
        location: singlecompany.location || "",
        file: singlecompany.logo || "",
      });
    }
  }, [params.id, singlecompany]);
  console.log(editLoading);

  return (
    <>
      <Navbar />

      {editLoading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-transparent border-t-cyan-500 border-b-cyan-500 rounded-full animate-spin"></div>
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-cyan-300 to-cyan-500 opacity-20 blur-xl"></div>
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-700 tracking-wide">
            Fetching Company Details...
          </p>
        </div>
      ) : (
        <>
          <div className="right-0 left-0 top-0 bottom-0 fixed bg-grayCustom"></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] sm:w-[35rem] max-h-[90%]  rounded-md p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold sm:mt-10">Company Setup</h1>
              <RxCross2
                color="black"
                size={25}
                cursor="pointer"
                onClick={() => navigate("/admin/companytable")}
              />
            </div>
            <form onSubmit={handelSubmit}>
              <div className="flex flex-wrap px-6">
                <div className="mt-4 w-full sm:w-[14rem]">
                  <label htmlFor="company" className="block font-semibold">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="company name "
                    name="name"
                    value={company.name}
                    onChange={handelEventChange}
                    id="company"
                    className="border-2 rounded-md h-10 px-3 mt-1 w-full"
                  />
                </div>
                <div className="mt-4 sm:ml-6 w-full sm:w-[14rem]">
                  <label htmlFor="location" className="block font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location "
                    name="location"
                    id="location"
                    value={company.location}
                    onChange={handelEventChange}
                    className="border-2 rounded-md h-10 px-3 mt-1 w-full"
                  />
                </div>

                {/* <div className="mt-4 sm:ml-6 w-full sm:w-[14rem]">
                  <label htmlFor="des" className="block font-semibold">
                    Description
                  </label>
                  <textarea
                    type="text"
                    placeholder="Description "
                    name="description"
                    value={company.description}
                    onChange={handelEventChange}
                    id="des"
                    className="border-2 rounded-md h-10 px-3 mt-1 w-full"
                  />
                </div> */}

                <div className="mt-4 w-full sm:w-[14rem]">
                  <label htmlFor="Web" className="block font-semibold">
                    Website
                  </label>
                  <input
                    type="text"
                    placeholder="Enter url "
                    name="website"
                    value={company.website}
                    onChange={handelEventChange}
                    id="Web"
                    className="border-2 rounded-md h-10 px-3 mt-1 w-full"
                  />
                </div>

                {/* <div className="mt-4 sm:ml-6 w-full sm:w-[14rem]">
                  <label htmlFor="location" className="block font-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Location "
                    name="location"
                    id="location"
                    value={company.location}
                    onChange={handelEventChange}
                    className="border-2 rounded-md h-10 px-3 mt-1 w-full"
                  />
                </div> */}

                <div className="mt-4 w-full  sm:w-[14rem]">
                  <label
                    htmlFor="company"
                    className="block font-semibold ml-3 mt-2"
                  >
                    Logo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    name="file"
                    onChange={handelFileChange}
                    id="logo"
                    className="inline ml-3"
                  />
                </div>
                {/* <p className="text-red-700 text-sm max-w-[400%] mt-4">
                      Make sure to choose the correct image. This cannot be
                      previewed
                    </p> */}
                {/* <div>
                      <p>
                        <a
                          href="#"
                          className="text-blue-700 hover:underline whitespace-nowrap"
                        >
                          {filename}
                        </a>
                      </p>
                    </div> */}
                <div className="w-full">
                  <label htmlFor="des" className="block font-semibold">
                    Description
                  </label>
                  <textarea
                    type="text"
                    placeholder="Description "
                    name="description"
                    value={company.description}
                    onChange={handelEventChange}
                    id="des"
                    className="border-2 rounded-md h-28 px-3 mt-1 w-full"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 mt-4 rounded-md font-bold flex justify-center items-center transition-all duration-300 ease-in-out ${
                    loading
                      ? "bg-coral cursor-not-allowed"
                      : "hover:bg-coral text-white bg-orange-800"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
