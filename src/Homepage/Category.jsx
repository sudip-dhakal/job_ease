import React from "react";
import CategoryCard from "./CategoryCard";

export default function Category() {
  return (
    <>
      <div className="pl-20 pr-20 min-h-[480px] w-full bg-[#F0F4F8] m-auto ">
        <h1 className="text-center m-4 text-3xl text-black font-bold">
          Category
        </h1>
        <CategoryCard />
      </div>
    </>
  );
}
