import React from 'react';

interface ProfitProps {
  label: string;
  value: string;
}

const Profit: React.FC<ProfitProps> = ({ label, value }) => {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <div className="flex justify-between items-center">
        <span className="font-medium">{label}</span>
        <span>{value}</span>
      </div>
    </div>
  );
};

export default Profit;
