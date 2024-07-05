import React from 'react';

const ViewBillButton = () => {
  return (
    <div>
      <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
        <span className="truncate">View Bill</span>
      </button>
    </div>
  );
};

export default ViewBillButton;
