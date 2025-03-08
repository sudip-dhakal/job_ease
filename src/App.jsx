import React, { useContext, useEffect } from "react";

import Hero from "./Homepage/Hero";
import Category from "./Homepage/Category";
import JobListing from "./Homepage/JobListing";
import Footer from "./Homepage/Footer";
import Navbar from "./Homepage/Navbar";
import { useNavigate } from "react-router-dom";
import useGetAlljob from "./Hooks/useGetAllJob.jsx";
import axios from "axios";
import itemContext from "./Store/store";
import FeaturedJobs from "./ReactComponent/FeaturedJobs";
import CategoriesList from "./ReactComponent/CategoriesList";
import HowItWorks from "./ReactComponent/HowItWorks";
import Testimonials from "./ReactComponent/Testimonials";
import CTASection from "./ReactComponent/CTASection";
import RecommendedJobs from "./ReactComponent/RecommendedJobs";

export default function App() {
  let { user, setUser } = useContext(itemContext);
  useGetAlljob();
  console.log(user);

  return (
    <>
      <Navbar />
      <Hero />
      {user?.role == "user" ? (
        <>
          <FeaturedJobs />

          <HowItWorks />
          <Testimonials />
          <CTASection />
          <RecommendedJobs />
        </>
      ) : (
        <>
          <HowItWorks />
        </>
      )}
      <Footer />
    </>
  );
}
