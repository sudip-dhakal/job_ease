import { Link, useNavigate } from "react-router-dom";
import Button from "../ReactComponent/Button";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import itemContext from "@/Store/store";
import useGetAlljob from "@/Hooks/useGetAllJob";
import useGetAllCompany from "@/Hooks/useGetAllCompany";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

export default function Navbar() {
  const location = useLocation();
  let navigate = useNavigate();
  let { user, setUser } = useContext(itemContext);

  useGetAllCompany();
  let handleClick = async () => {
    let res = await axios.get(`${USER_API_END_POINT}/logout`, {
      withCredentials: true,
    });
    if (res.data.success) {
      setUser(null);
      localStorage.removeItem("user");
      toast.success(res.data.message);
      navigate("/");
    }
  };

  return (
    <nav className="flex bg-primary text-white items-center h-16 !bg-cyan text-lg    pl-20 pr-20 w-full fixed top-0 z-20  ">
      <div className="flex items-center w-48">
        <Link to="/">
          <img
            src="/image/logo.png"
            className="h-12 w-12"
            alt="Job ease logo"
          />
        </Link>

        <Link to="/">
          <h3 className="text-mywhite w-auto font-bold">Job ease</h3>
        </Link>
      </div>
      <ul className="ml-[40rem] flex space-x-6 justify-center w-[40%] items-center list-none">
        {!user ? (
          <>
            <li>
              <Link
                to="/login"
                className={
                  location.pathname === "/login"
                    ? "bg-red-500 rounded-md  text-white px-4 py-2"
                    : ""
                }
              >
                <Button>Login</Button>
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={location.pathname === "/signup" ? "underline" : ""}
              >
                <Button>Signup</Button>
              </Link>
            </li>
          </>
        ) : (
          <>
            {user.role == "recruiter" ? (
              <>
                <Link
                  to="/admin/companytable"
                  className={
                    location.pathname === "/admin/companytable"
                      ? "bg-red-500 rounded-md  text-white px-4 py-2"
                      : ""
                  }
                >
                  <li>Companies</li>
                </Link>
                <Link
                  to="/admin/job"
                  className={
                    location.pathname === "/admin/job"
                      ? "bg-red-500 rounded-md  text-white px-4 py-2"
                      : ""
                  }
                >
                  <li>Jobs</li>
                </Link>

                <div>
                  <Popover>
                    <PopoverTrigger>
                      <img
                        src={user.profile.profilePic}
                        className="h-8 w-8 m-1 rounded-full flex items-center"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="mt-3">
                      <div className="h-auto w-48  ">
                        <div className="flex  space-x-3 ">
                          <img
                            src={user.profile.profilePic}
                            className="h-8 w-8 m-1 rounded-full flex items-center"
                          />
                          <h1 className=" text-xl font-semibold">
                            {user.fullName}
                          </h1>
                        </div>

                        <Link>
                          <div
                            className="flex space-x-3 px-3
                    "
                          >
                            <IoIosLogOut size={30} />
                            <h1 className="text-xl  " onClick={handleClick}>
                              Log Out
                            </h1>
                          </div>
                        </Link>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className={
                      location.pathname === "/"
                        ? "bg-red-500 rounded-md  text-white px-4 py-2"
                        : ""
                    }
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/job"
                    className={
                      location.pathname === "/job"
                        ? "bg-red-500 rounded-md  text-white px-4 py-2"
                        : ""
                    }
                  >
                    Job
                  </Link>
                </li>

                <div>
                  <Popover>
                    <PopoverTrigger>
                      <img
                        src={user?.profile?.profilePic}
                        className="h-8 w-8 m-1 rounded-full flex items-center"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="mt-3 bg-slate-300 shadow-lg rounded-lg">
                      <div className="h-auto w-48 flex flex-col gap-y-4 p-3">
                        <Link to="/profile">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user?.profile?.profilePic}
                              className="h-10 w-10 rounded-full flex-shrink-0"
                              alt="Profile"
                            />
                            <h1 className="text-xl font-semibold hover:text-blue-500 hover:scale-110 transition-all duration-300">
                              Your Profile
                            </h1>
                          </div>
                        </Link>
                        <Link>
                          <div className="flex items-center space-x-3">
                            <IoIosLogOut size={40} className="text-red-500" />
                            <h1
                              className="text-xl font-semibold hover:text-red-500 hover:scale-110 transition-all duration-300"
                              onClick={handleClick}
                            >
                              Log Out
                            </h1>
                          </div>
                        </Link>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}
