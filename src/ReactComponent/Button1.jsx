import React from "react";

const Button = ({ name, click }) => {
  return (
    <div>
      <button
        type="submit"
        className="font-semibold bg-blue-900 text-white p-2 text-xl rounded-md float-right mt-6"
        onClick={click}
      >
        {name}
      </button>
    </div>
  );
};

export default Button;
