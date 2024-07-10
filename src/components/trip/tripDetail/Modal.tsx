import React, { useEffect, useState } from 'react';
import { PaymentBook } from '@/utils/interface';
import { revalidatePath } from 'next/cache';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id : string | undefined
    accountType: string;
    amount: number;
    paymentType: 'Cash' | 'Cheque' | 'Online Transfer';
    receivedByDriver: boolean;
    paymentDate: Date; // Ensure paymentDate is of type Date
    notes?: string;
  }) => void;
  modalTitle: string;
  accountType: string;
  editData?: PaymentBook | null;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  modalTitle,
  accountType,
  editData,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<'Cash' | 'Cheque' | 'Online Transfer'>('Cash');
  const [receivedByDriver, setReceivedByDriver] = useState<boolean>(false);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (editData) {
      setAmount(editData.amount);
      setPaymentType(editData.paymentType);
      setReceivedByDriver(editData.receivedByDriver as boolean);
      // Ensure editData.paymentDate is a Date object before calling toISOString()
      const formattedDate = editData.paymentDate instanceof Date
        ? editData.paymentDate.toISOString().split('T')[0]
        : new Date(editData.paymentDate).toISOString().split('T')[0];
      setPaymentDate(formattedDate);
      setNotes(editData.notes || '');
    } else {
      setAmount(0);
      setPaymentType('Cash');
      setReceivedByDriver(false);
      setPaymentDate(new Date().toISOString().split('T')[0]); // Set current date in ISO format
      setNotes('');
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id : editData?._id.toString(),
      accountType,
      amount,
      paymentType,
      receivedByDriver,
      paymentDate: new Date(paymentDate), // Convert paymentDate string to Date object
      notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{modalTitle}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
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
                checked={receivedByDriver as boolean}
                onChange={(e) =>{
                  console.log(typeof(receivedByDriver))
                  setReceivedByDriver(e.target.checked)
                } }
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
