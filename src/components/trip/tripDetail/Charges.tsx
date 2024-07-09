import React, { useState, useEffect } from 'react';
import ChargeModal from './ChargeModal';
import { TripExpense } from '@/utils/interface';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditChargeModal from './EditChargeModal';

interface ChargesProps {
  charges: TripExpense[];
  setCharges: React.Dispatch<React.SetStateAction<TripExpense[]>>;
  tripId: string;
  onAddCharge: (charge: TripExpense) => void;
}

const Charges: React.FC<ChargesProps> = ({ charges, onAddCharge, setCharges, tripId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [sortedCharges, setSortedCharges] = useState<TripExpense[]>([]);
  const [selectedCharge, setSelectedCharge] = useState<TripExpense | null>(null);

  useEffect(() => {
    if (charges) {
      const sorted = [...charges].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setSortedCharges(sorted);
    }
  }, [charges]);

  const handleAddCharge = async (newCharge: TripExpense) => {
    const res = await fetch(`/api/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCharge),
    });
    const data = await res.json();
    setCharges((prev: TripExpense[]) => [...prev, data.newCharge]);
  };

  const toggleItemExpansion = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleEditCharge = (index: number) => {
    setSelectedCharge(sortedCharges[index]);
    setEditModalOpen(true);
  };

  const handleDeleteCharge = async (index: number) => {
    const chargeToDelete = sortedCharges[index];
    const res = await fetch(`/api/trips/${tripId}/expenses/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: chargeToDelete._id }),
    });
    if (res.ok) {
      setCharges((prevCharges: TripExpense[]) => prevCharges.filter((charge, i) => i !== index));
    } else {
      console.error('Failed to delete charge:', chargeToDelete._id);
    }
  };

  return (
    <div className={`mt-6 `}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Charges</h3>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 focus:outline-none ml-4 transition duration-300 ease-in-out transform hover:scale-110"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add Charge"
        >
          +
        </button>
      </div>
      {!sortedCharges || sortedCharges.length === 0 ? (
        <p className="text-sm text-gray-500">No charges available.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
          {sortedCharges.map((charge, index) => (
            <div
              key={index}
              className="flex flex-col px-4 py-4 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg cursor-pointer"
              onClick={() => toggleItemExpansion(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Amount: ₹{charge.amount}</p>
                  <p className="text-xs text-gray-600">Type: {charge.expenseType}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Date: {new Date(charge.date).toLocaleDateString()}</p>
                  <p className={`text-xs font-semibold ${charge.partyBill ? 'text-green-600' : 'text-red-600'}`}>
                    {charge.partyBill ? 'Added to Bill' : 'Reduced from Bill'}
                  </p>
                </div>
              </div>
              {expandedItem === index && (
                <div className="mt-4">
                  {charge.notes && (
                    <p className="text-xs text-gray-600">Notes: {charge.notes}</p>
                  )}
                  <div className="mt-2 flex justify-end">
                    <button
                      className="text-xs text-blue-500 mr-2 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleEditCharge(index)}
                    >
                      <MdEdit className="text-xl text-purple-600" /> {/* Increased size of MdEdit */}
                    </button>
                    <button
                      className="text-xs text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => handleDeleteCharge(index)}
                    >
                      <MdDelete className="text-xl text-red-700" /> {/* Increased size of MdDelete */}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ChargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCharge}
      />
      {editModalOpen && selectedCharge && (
        <EditChargeModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={async (editedCharge: TripExpense) => {
            // Send PATCH request to update charge
            const res = await fetch(`/api/trips/${tripId}/expenses`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editedCharge),
            });
            if (!res.ok) {
              console.error('Failed to update charge:', selectedCharge._id);
              return;
            }

            // Update charges in state
            const updatedCharges = sortedCharges.map(charge =>
              charge._id === selectedCharge._id ? editedCharge : charge
            );
            setCharges(updatedCharges);

            // Close edit modal
            setEditModalOpen(false);
          }}
          charge={selectedCharge}
        />
      )}
    </div>
  );
};

export default Charges;
