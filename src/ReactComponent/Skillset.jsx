import React from "react";

const Skillset = ({ name }) => {
  // console.log(name)
  return (
    <div className="bg-blue-700 rounded-[17px] p-2">
      <p className="text-white text-[1rem]">{name}</p>
    </div>
  );
};

export default Skillset;
