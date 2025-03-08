import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Homepage/Navbar";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

export default function SignupForm() {
  let navigate = useNavigate();
  let [loadingState, setLoadingState] = useState(false);
  let [errors, setErrors] = useState({});
  let [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    profilePic: "",
  });

  function handelEventChange(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  function handelFileChange(e) {
    setInput({ ...input, file: e.target.files?.[0] });
  }

  const validate = () => {
    let newErrors = {};
    if (!input.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (
      !input.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
    ) {
      newErrors.email = "Enter a valid email.";
    }
    if (!input.phoneNumber.trim() || !/^\d{10}$/.test(input.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }
    if (!input.password.trim() || input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!input.role) newErrors.role = "Please select a role.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoadingState(true);
    let formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("profilePic", input.file);

    try {
      let res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-20 h-auto w-[40%] border-2 m-auto px-8 shadow-lg p-8 bg-white rounded-lg">
        <div className="flex justify-center mb-6">
          <img src="./image/logo.png" alt="Logo" className="h-16 w-16" />
        </div>

        <h1 className="text-center font-bold text-3xl mb-6">SIGNUP</h1>

        <form onSubmit={handelSubmit}>
          <div className="mb-4">
            <label className="block font-semibold text-md">Full Name:</label>
            <input
              className="block h-10 w-full border-2 rounded-md p-3"
              type="text"
              placeholder="Enter your full name"
              value={input.fullName}
              onChange={handelEventChange}
              name="fullName"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-md">Email:</label>
            <input
              className="block h-10 w-full border-2 rounded-md pl-3"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={input.email}
              onChange={handelEventChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-md">Phone Number:</label>
            <input
              className="block h-10 w-full border-2 rounded-md pl-3"
              type="tel"
              placeholder="Enter your phone number"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={handelEventChange}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-md">Password:</label>
            <input
              className="block h-10 w-full border-2 rounded-md pl-3"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={input.password}
              onChange={handelEventChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-semibold text-md">
              Profile Picture:
            </label>
            <input
              className="block h-10 w-full border-2 rounded-md p-3"
              type="file"
              accept="image/*"
              onChange={handelFileChange}
            />
          </div>

          <div className="mb-6 space-x-4">
            <label className="block font-semibold text-md mb-2">Role:</label>
            <input
              type="radio"
              name="role"
              value="user"
              onChange={handelEventChange}
              className="mr-2"
            />
            <label className="font-semibold text-md">User</label>
            <input
              type="radio"
              name="role"
              value="recruiter"
              onChange={handelEventChange}
              className="ml-4 mr-2"
            />
            <label className="font-semibold text-md">Recruiter</label>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

          <button
            type="submit"
            className="h-12 w-full bg-coral text-white rounded-md font-semibold hover:bg-orange-500 active:bg-orange-800 transition-all flex items-center justify-center"
            disabled={loadingState}
          >
            {loadingState ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Register...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
