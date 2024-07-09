import React, { useState, useEffect } from 'react';
import { MdEdit } from "react-icons/md";

interface TripInfoProps {
  label: string;
  value: string;
  tripId?: string;
}

const TripInfo: React.FC<TripInfoProps> = ({ label, value, tripId }) => {
  const [notes, setNotes] = useState<string>(''); // State to hold the notes
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);

  useEffect(() => {
    if (label === 'Notes') {
      setNotes(value); // Initialize notes state with the provided value only once
    }
  }, [label, value]);

  const handleSaveNotes = async () => {
    const res = await fetch(`/api/trips/${tripId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { notes } }),
    });
    if (!res.ok) {
      console.error('Failed to save notes');
    }
    setIsEditingNotes(false); // Save notes and close editing
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 w-full hover:shadow-xl transition-shadow duration-300 relative">
      <p className="text-sm font-medium text-blue-600 mb-1 tracking-wide uppercase">{label}</p>
      <div className="flex items-center justify-between mb-2">
        {label === 'Notes' && !isEditingNotes ? (
          <div className="flex-1">
            <p className="text-2xl font-semibold text-gray-900 overflow-hidden overflow-ellipsis whitespace-pre-wrap">
              {notes}
            </p>
          </div>
        ) : (
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        )}
        {label === 'Notes' && !isEditingNotes && (
          <button
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg py-1 px-3 rounded-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 absolute top-4 right-4"
            onClick={() => setIsEditingNotes(true)}
          >
            <MdEdit />
          </button>
        )}
      </div>
      {label === 'Notes' && isEditingNotes && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes..."
            rows={4}
          />
          <div className="flex justify-end mt-4 space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSaveNotes}
            >
              Save
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setIsEditingNotes(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripInfo;
