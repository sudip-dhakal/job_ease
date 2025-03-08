import React, { useContext } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Joblist from "@/ReactComponent/Jobcard";
import jobs from "@/jobs";
import itemContext from "@/Store/store";

export default function Browse() {
  let { filteritems } = useContext(itemContext);
  return (
    <>
      <Navbar />
      <h1 className="mt-20 px-20 text-3xl font-semibold">
        Search Result({filteritems.length})
      </h1>
      <div className="px-20 flex flex-wrap">
        {filteritems.map((item) => (
          <Joblist item={item} />
        ))}
      </div>
    </>
  );
}
