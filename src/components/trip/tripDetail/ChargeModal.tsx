import React, { useState } from 'react';

interface ChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: any;
}

const chargeType = [
  'Detention/Halting Charges',
  'Repair Expense',
  'Loading Charges',
  'Unloading Charges',
  'Union Charges',
  'Weight Charges',
  'Other Charges'
];

const deductionType = [
  'Material Loss',
  'Brokerage',
  'Late Fees',
  'TDS',
  'Mamul',
  'Other'
];

interface TripExpense {
  trip_id: string;
  partyBill: boolean;
  amount: number;
  date: Date;
  expenseType: string;
  notes?: string;
}

const ChargeModal: React.FC<ChargeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<TripExpense>({
    trip_id: '',
    partyBill: true,
    amount: 0,
    date: new Date(),
    expenseType: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData({ ...formData, [name]: type === 'checkbox'? !formData.partyBill: value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Add New Charge</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Add to Party Bill</label>
          <input
            type="checkbox"
            name="partyBill"
            checked={formData.partyBill}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Expense Type</label>
          <div className="relative">
            <select
              name="expenseType"
              value={formData.expenseType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
            >
              <option value="">Select Expense Type</option>
              {formData.partyBill
                ? chargeType.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))
                : deductionType.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-4 w-4 fill-current text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date.toISOString().split('T')[0]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded-md">
            Cancel
          </button>
          <button onClick={handleSave} className="p-2 bg-blue-500 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChargeModal;
