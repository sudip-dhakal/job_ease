import React, { useContext, useState } from "react";
import { ImCross } from "react-icons/im";
import itemContext from "@/Store/store";
import axios from "axios";
import { toast } from "sonner";

const Edit = ({ setShowEdit }) => {
  const { user, setUser } = useContext(itemContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skillSet = [
    "Python",
    "Ruby",
    "JavaScript",
    "HTML",
    "CSS",
    "Node JS",
    "Django",
    "React",
    "Angular",
    "Vue",
    "Flask",
  ];
  // let skillToShow = JSON.parse(user.profile.skills);
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    bio: user.profile.bio,
    files: null,
    profilePic: null,
  });
  // const filePath = user?.resumeData?.resumeFilePath;

  // // Extract the file name
  // const fileName = filePath?.split("\\").pop();

  // // Remove "resume-" from the beginning
  // const extractedName = fileName?.replace("resume-", "");

  // console.log(extractedName, "sushil");

  // const url = user?.profile?.profilePic;

  // // Extract the file name
  // const fileName1 = url?.split("/").pop();

  // console.log(fileName1, "profilePic");

  const handleEventChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setInput({ ...input, files: e.target.files?.[0] || null });
  };

  const handleProfilePicChange = (e) => {
    setInput({ ...input, profilePic: e.target.files?.[0] || null });
  };

  const handleSkillChange = (e) => {
    const selectedSkills = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSkills([...new Set([...skills, ...selectedSkills])]); // Ensure no duplicates
  };

  const handleSkillRemove = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  let formData = new FormData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", skills);

    if (input.files) formData.append("resume", input.files);
    if (input.profilePic) formData.append("profilePic", input.profilePic);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    try {
      const res = await axios.patch(
        "http://localhost:8000/api/v1/user/profile/update",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(formData);
      if (res.data.success) {
        const existingUser = JSON.parse(localStorage.getItem("user")) || {};
        const newUserData = { ...existingUser, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(newUserData));

        setUser(newUserData);
        console.log(res.data);
        toast.success(res.data.message);
        setShowEdit(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="w-full h-full bg-white shadow-lg p-6 relative overflow-y-auto max-w-2xl sm:max-w-full sm:h-auto sm:rounded-lg">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-xl font-bold">Update Profile</h2>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setShowEdit(false)}
            >
              <ImCross />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  value={input.fullName || ""}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={input.email || ""}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={input.phoneNumber || ""}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <input
                  type="text"
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={input.bio || ""}
                  onChange={handleEventChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Your Skills
              </label>
              <select
                id="skills"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                multiple
                onChange={handleSkillChange}
                value={skills}
              >
                {skillSet.map((item, index) => (
                  <option key={index} value={item}>
                    {item || ""}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap mt-3 gap-2">
                {skills.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-full"
                  >
                    <span>{item || ""}</span>
                    <ImCross
                      size={14}
                      className="cursor-pointer"
                      onClick={() => handleSkillRemove(item)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full flex justify-normal sm:w-1/2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="w-full cursor-pointer text-sm"
                    onChange={handleFileChange}
                  />
                  <span className="text-gray-500 text-xs">Supported: PDF</span>
                </div>
                <div className="mt-9">
                  {/* <span>
                    <a
                      href={`http://localhost:8000/${user?.resumeData?.resumeFilePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {extractedName}
                    </a>
                  </span> */}
                </div>
              </div>
              <div className="w-full flex justify-center sm:w-1/2">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    className="w-full cursor-pointer text-sm inline"
                    onChange={handleProfilePicChange}
                  />
                  <span className="text-gray-500 text-xs">
                    Supported: Images
                  </span>
                </div>

                {/* <div className="mt-9">
                  <span>
                    <a
                      href={`http://localhost:8000/${user.profile.profilePic}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {fileName1}
                    </a>
                  </span>
                </div> */}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                className="h-12 w-full sm:w-[15%] bg-coral text-white rounded-md font-semibold hover:bg-orange-500 active:bg-orange-600 transition-all duration-200 flex items-center justify-center"
                onClick={() => setShowEdit(false)}
              >
                Go Back
              </button>
              <button
                type="submit"
                className="h-12 w-full sm:w-[15%] bg-coral text-white rounded-md font-semibold hover:bg-orange-500 active:bg-orange-600 transition-all duration-200 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;
