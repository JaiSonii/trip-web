import React from 'react';

interface ChargeItem {
  label: string;
  value: string;
}

interface ChargesProps {
  charges: ChargeItem[];
  onAddCharge: () => void; // Function to handle adding charges
}

const Charges: React.FC<ChargesProps> = ({ charges, onAddCharge }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Charges</h3>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 focus:outline-none ml-4"
          onClick={onAddCharge}
          aria-label="Add Charge"
        >
          +
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
        {charges.map((charge, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{charge.label}</p>
              <p className="text-xs text-gray-600">{charge.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Charges;
