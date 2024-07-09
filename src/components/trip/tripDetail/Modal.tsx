import { PaymentBook } from '@/utils/interface';
import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    accountType: string;
    amount: number;
    paymentType: 'Cash' | 'Cheque' | 'Online Transfer';
    receivedByDriver: boolean;
    paymentDate: string;
    notes?: string;
  }) => void;
  modalTitle: string;
  accountType: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, modalTitle, accountType }) => {
  const [amount, setAmount] = useState<number | ''>(0);
  const [paymentType, setPaymentType] = useState<'Cash' | 'Cheque' | 'Online Transfer'>('Cash');
  const [receivedByDriver, setReceivedByDriver] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toLocaleDateString());
  const [notes, setNotes] = useState('');


  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
      onSave({
        accountType,
        amount: Number(amount),
        paymentType,
        receivedByDriver,
        paymentDate,
        notes,
      });
    setAmount('');
    setPaymentType('Cash');
    setReceivedByDriver(false);
    setPaymentDate('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.valueAsNumber)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as 'Cash' | 'Cheque' | 'Online Transfer')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Online Transfer">Online Transfer</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={receivedByDriver}
              onChange={(e) => setReceivedByDriver(e.target.checked)}
              className="mr-2"
            />
            <label className="block text-sm font-medium text-gray-700">Received By Driver</label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
    
  );
};

export default Modal;
