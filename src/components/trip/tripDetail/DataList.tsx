import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { ITrip, PaymentBook } from '@/utils/interface';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { fetchBalance } from '@/helpers/fetchTripBalance';

interface DataListProps {
  data: PaymentBook[];
  label: string;
  trip: ITrip;
  setData: React.Dispatch<React.SetStateAction<PaymentBook[]>>;
  setTrip : any
  setBalance : any
  modalTitle: string;
}

const DataList: React.FC<DataListProps> = ({data,label,modalTitle,trip,setData,setBalance, setTrip}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<PaymentBook | null>(null);
  const [listData, setListData] = useState<PaymentBook[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  useEffect(() => {
    const temp = data.filter((account) => account.accountType === label);
    const sortedData = temp.sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
    setListData(sortedData);
  }, [data, label]);

  const handleAddItem = async (newItem: any) => {
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
      const pending = await fetchBalance(resData.trip)
      setBalance(pending)
      setIsModalOpen(false);
      setTrip(resData.trip)
      // router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditItem = async (editedItem: any) => {
    try {
      const res = await fetch(`/api/trips/${trip.tripId}/accounts/${editedItem.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: editedItem }),
      });
      if (!res.ok) {
        throw new Error('Failed to edit item');
      }
      const resData = await res.json();
      setData(resData.trip.accounts);
      setTrip(resData.trip)
      setEditData(null);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteItem = async (item: PaymentBook) => {
    try {
      const res = await fetch(`/api/trips/${trip.tripId}/accounts/${item._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { account: item, delete: true } }),
      });
      if (!res.ok) {
        throw new Error('Failed to delete item');
      }
      const resData = await res.json();
      setData((prev: PaymentBook[]) => {
        const updatedData = prev.filter((acc) => acc._id !== item._id);
        console.log('Updated data:', updatedData);
        return updatedData;
      });
      setTrip(resData.trip)
      // router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  

  const toggleItemExpansion = (index: number) => {
    setExpandedItem((prev) => (prev === index ? null : index));
  };

  const openAddModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PaymentBook) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600 focus:outline-none ml-4 transition duration-300 ease-in-out transform hover:scale-110"
          onClick={openAddModal}
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
                    Received by Driver: {item.receivedByDriver ? 'Yes' : 'No'}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-gray-600">Notes: {item.notes}</p>
                  )}
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      className="text-xs text-blue-500 hover:text-blue-700 focus:outline-none"
                      onClick={() => openEditModal(item)}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="text-xs text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleAddItem}
        modalTitle={modalTitle}
        accountType={label}
      />
      {editData && (
        <Modal
          isOpen={!!editData}
          onClose={closeModal}
          onSave={handleEditItem}
          modalTitle="Edit Item"
          accountType={label}
          editData={editData}
        />
      )}
    </div>
  );
};

export default DataList;
