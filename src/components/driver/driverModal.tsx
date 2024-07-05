import React, { useState } from 'react';
import { driverGave, driverGot } from '@/utils/utilArray';

interface DriverModalProps {
  open: boolean;
  onClose: () => void;
  type: 'gave' | 'got' | null;
  onConfirm: (amount: number, reason: string, date: string) => void;
}



const DriverModal: React.FC<DriverModalProps> = ({ open, onClose, type, onConfirm }) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');

  const handleConfirm = () => {
    const finalReason = reason === 'Other' ? otherReason : reason;
    onConfirm(amount, finalReason, date);
    setAmount(0)
    setReason('')
    setOtherReason('')
    setDate('')
  };

  const handleCancel = () => {
    onClose();
  };

  const reasonOptions = type === 'gave' ? driverGave : driverGot;

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50 backdrop-blur-lg"></div>
          <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{type === 'gave' ? 'Driver Gave' : 'Driver Got'}</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <select
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a reason</option>
                  {reasonOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {reason === 'Other' && (
                  <input
                    type="text"
                    className="mt-2 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Enter other reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    required
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverModal;
