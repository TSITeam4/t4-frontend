import React from "react";

const PageTitle = ({ title, description, className = "" }) => {
  return (
    <div
      className={`mx-auto text-center max-w-3xl px-6 md:px-12 pt-12 ${className}`}
    >
      <h1 className="text-3xl font-bold pb-5">{title}</h1>
      <hr className="border-t border-[#F9C726] w-4/5 mx-auto pb-5" />
      {description && (
        <p className="text-gray-300 font-georgia leading-relaxed pb-10 px-4 md:px-12">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
