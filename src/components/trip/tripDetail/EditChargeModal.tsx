import React, { useState } from 'react';
import { TripExpense } from '@/utils/interface';

interface EditChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedCharge: TripExpense) => void;
  charge: TripExpense;
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

const EditChargeModal: React.FC<EditChargeModalProps> = ({ isOpen, onClose, onSave, charge }) => {
  const [editedCharge, setEditedCharge] = useState({
    _id: charge._id,
    trip_id: charge.trip_id,
    partyBill: charge.partyBill,
    amount: charge.amount || 0,
    date: new Date(charge.date),
    expenseType: charge.expenseType || '',
    notes: charge.notes || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setEditedCharge({ ...editedCharge, [name]: !editedCharge.partyBill } ); // Toggle the boolean value
    } else {
      setEditedCharge({ ...editedCharge, [name]: value });
    }
  };

  const handleSave = () => {
    onSave(editedCharge as any);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Edit Charge</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Add to Party Bill</label>
          <input
            type="checkbox"
            name="partyBill"
            checked={editedCharge.partyBill}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        {editedCharge.partyBill ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expense Type</label>
            <select
              name="expenseType"
              value={editedCharge.expenseType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Expense Type</option>
              {chargeType.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Expense Type</label>
            <select
              name="expenseType"
              value={editedCharge.expenseType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Deduction Type</option>
              {deductionType.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={editedCharge.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={editedCharge.date.toISOString().split('T')[0]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={editedCharge.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditChargeModal;
