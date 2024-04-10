import React from "react";

function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="border-4 border-blue-500 rounded-full w-16 h-12 animate-spin"></div>
    </div>
  );
}

export default Loader;
