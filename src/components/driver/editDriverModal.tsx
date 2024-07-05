// components/EditDriverModal.tsx
import React, { useState } from 'react';
import { IDriver } from '@/utils/interface';
import { isValidPhone } from '@/utils/validate';

interface EditDriverModalProps {
  name: string;
  driverId: string;
  handleEdit: (driverName: string, mobileNumber: string) => void;
  onCancel : () =>void;
}

const EditDriverModal: React.FC<EditDriverModalProps> = ({ name, driverId, handleEdit, onCancel }) => {
  const [driverName, setDriverName] = useState<string>(name);
  const [mobileNumber, setMobileNumber] = useState<string>(''); // Initialize mobileNumber with an empty string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!isValidPhone(mobileNumber)) {
      alert('Enter a Valid Phone')
      return
    }
    handleEdit(driverName, mobileNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Edit Driver</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded mr-2"
              onClick={() => {setDriverName(name)
                onCancel()
              }} // Reset name field to original value on cancel
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriverModal;
