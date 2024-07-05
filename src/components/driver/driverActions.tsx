import React from 'react';

interface DriverActionsProps {
  onGaveClick: () => void;
  onGotClick: () => void;
}

const DriverActions: React.FC<DriverActionsProps> = ({ onGaveClick, onGotClick }) => {
  return (
    <div className="mr-4 flex items-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={onGaveClick}
      >
        Driver Gave
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={onGotClick}
      >
        Driver Got
      </button>
    </div>
  );
};

export default DriverActions;
