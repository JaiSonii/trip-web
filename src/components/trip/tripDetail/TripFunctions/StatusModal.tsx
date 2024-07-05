import React, { useState, useEffect } from 'react';
import { statuses } from '@/utils/schema';

interface StatusModalProps {
  status: number;
  isOpen: boolean;
  dates: Date[];
  amount: number
  onClose: () => void;
  onSave: (data: any) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ status, isOpen, onClose, onSave, dates, amount }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [podReceivedDate, setPodReceivedDate] = useState<string>('');
  const [podImage, setPodImage] = useState<File | null>(null);
  const [paymentType, setPaymentType] = useState<string>('');
  const [settlementDate, setSettlementDate] = useState<string>('');
  const [receivedByDriver, setReceivedByDriver] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');


  useEffect(() => {
    if (status === 0) {
      setStartDate(new Date().toISOString().split('T')[0]);
    } else if (status === 1) {
      setPodReceivedDate(new Date().toISOString().split('T')[0]);
    }
  }, [status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setPodImage(file);
  };


  const saveChanges = () => {
    let data: any = {};

    if (statuses[status] === 'Started') {
      dates[1] = new Date(startDate);
      data = { dates: dates, status: status + 1 };
    } else if (statuses[status] === 'Completed') {
      dates[2] = new Date(podReceivedDate);
      // Simulating storage of the image path (mocking for demo purposes)
      const imagePath = `/pod/${podImage?.name}`;
      localStorage.setItem('podImagePath', imagePath);
      data = {  dates: dates, status: status + 1, POD: imagePath };
    } else if (statuses[status] === 'POD Recieved') {
      dates[3] = new Date(startDate);
      data = { dates: dates, status: status + 1 };
    } else if (statuses[status] === 'POD Submitted') {
      dates[4] = new Date(settlementDate);
      data = {
        amount: amount,
        paymentType,
        receivedByDriver,
        notes,
        dates: dates,
        status: status + 1,
      };
    }

    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ maxWidth: '600px', width: '90%' }}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">Trip {statuses[status + 1]}</h2>
          {statuses[status] === 'Started' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          )}
          {statuses[status] === 'Completed' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">POD Received Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={podReceivedDate}
                  onChange={(e) => setPodReceivedDate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">POD Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}
          {statuses[status] === 'POD Recieved' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">POD Submitted Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          )}
          {statuses[status] === 'POD Submitted' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={amount}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="">Select Payment Type</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Settlement Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={settlementDate}
                  onChange={(e) => setSettlementDate(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-500 focus:ring-blue-400"
                    checked={receivedByDriver}
                    onChange={(e) => setReceivedByDriver(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Received by Driver</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="mt-4 flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2" onClick={saveChanges}>
              Save
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
