import React, { useEffect, useState } from 'react';
import Modal from './Modal';

import { ITrip, PaymentBook } from '@/utils/interface';

interface DataListProps {
  data: PaymentBook[];
  label: string;
  trip: ITrip;
  setData: React.Dispatch<React.SetStateAction<PaymentBook[]>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  modalTitle: string;
}

const DataList: React.FC<DataListProps> = ({ data, label, modalTitle, trip, setData, setBalance }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listData, setListData] = useState<PaymentBook[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const name = label;

  useEffect(() => {
    const temp = data.filter(account => account.accountType === name);
    const sortedData = temp.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    setListData(sortedData);
  }, [data]);
  

  const handleAddItem = async (newItem: {
    accountType: string;
    amount: number;
    paymentType: 'Cash' | 'Cheque' | 'Online Transfer';
    receivedByDriver: boolean;
    paymentDate: string;
    notes?: string;
  }) => {
    try {
      const res = await fetch(`/api/trips/${trip.tripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { account: newItem } }),
      });
      if (!res.ok) {
        throw new Error('Failed to add new item');
      }
      const resData = await res.json();
      setData(resData.trip.accounts);
      setBalance(resData.trip.balance);

      if (newItem.receivedByDriver === true) {
        const driverRes = await fetch(`/api/drivers/${trip.driver}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            got: newItem.amount,
            gave: 0,
            reason: `Trip ${name}`,
            date: newItem.paymentDate,
          }),
        });
        if (!driverRes.ok) {
          throw new Error('Failed to update driver');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleItemExpansion = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 focus:outline-none ml-4 transition duration-300 ease-in-out transform hover:scale-110"
          onClick={() => setIsModalOpen(true)}
          aria-label={`Add ${label}`}
        >
          +
        </button>
      </div>
      {!data || data.length === 0 ? (
        <p className="text-sm text-gray-500">No {label.toLowerCase()} available.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
          {listData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col px-4 py-4 hover:bg-gray-50 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg cursor-pointer"
              onClick={() => toggleItemExpansion(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.paymentType}</p>
                  <p className="text-xs text-gray-600">Amount: {item.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Date: {new Date(item.paymentDate).toLocaleDateString()}</p>
                </div>
              </div>
              {expandedItem === index && (
                <div className="mt-4">
                  <p className="text-xs text-gray-600">
                    Received by Driver: {item.receivedByDriver === true ? 'Yes' : 'No'}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-gray-600">Notes: {item.notes}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle={modalTitle}
        onSave={handleAddItem}
        accountType={name}
      />
    </div>
  );
};

export default DataList;
