import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import SignupForm from "./ReactComponent/SignupForm.jsx";
import Login from "./ReactComponent/Login.jsx";
import job from "./ReactComponent/Job.jsx";
import Job from "./ReactComponent/Job.jsx";
import Browse from "./Homepage/Browse.jsx";
import JobDescription from "./ReactComponent/JobDescription.jsx";
import ItemContextProvider from "./Store/ItemContextProvider.jsx";
import CompaniesTable from "./admin/CompaniesTable.jsx";
import { Toaster } from "@/components/ui/sonner";
import Profile from "./ReactComponent/Profile.jsx";
import Edit from "./ReactComponent/Edit.jsx";
import JobContextProvider from "./Store/JobContextProvider.jsx";
import CreateCompany from "./admin/CreateCompany.jsx";
import Companies from "./admin/Companies.jsx";
import CompanyContextProvider from "./Store/CompanyContextProvider.jsx";
import Admin_jobs from "./admin/Admin_jobs.jsx";
import New_job from "./admin/New_job.jsx";
import Applicants from "./admin/Applicants.jsx";
import ApplicatonContextProvider from "./Store/ApplicatonContextProvider.jsx";

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/job",
    element: <Job />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/jobdescription/:id",
    element: <JobDescription />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/edit",
    element: <Edit />,
  },

  //The admin panel are start from here.
  {
    path: "/admin/companies",
    element: <Companies />,
  },
  {
    path: "/admin/companies/:id",
    element: <Companies />,
  },
  {
    path: "/admin/createcompany",
    element: <CreateCompany />,
  },
  {
    path: "/admin/companytable",
    element: <CompaniesTable />,
  },
  {
    path: "/admin/job",
    element: <Admin_jobs />,
  },
  {
    path: "/admin/jobs/create",
    element: <New_job />,
  },
  {
    path: "/admin/jobs/create/:id",
    element: <New_job />,
  },
  {
    path: "/admin/jobs/:id/apllicants",
    element: <Applicants />,
  },
]);

createRoot(document.getElementById("root")).render(
  <JobContextProvider>
    <ItemContextProvider>
      <CompanyContextProvider>
        <ApplicatonContextProvider>
          <StrictMode>
            <RouterProvider router={router}></RouterProvider>
            <Toaster />
          </StrictMode>
        </ApplicatonContextProvider>
      </CompanyContextProvider>
    </ItemContextProvider>
  </JobContextProvider>
);
