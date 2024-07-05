import React, { useState } from 'react';
import StatusModal from './StatusModal';

interface StatusButtonProps {
  status: number ;
  amount: number
  statusUpdate: (data: any) => void;
  dates : Date[]
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, statusUpdate, dates, amount }) => {
  const statusLabels : any = {
    0 : 'Complete Trip',
    1: 'POD Received',
    2: 'POD Submitted',
    3: 'Settle Amount',
    4: 'Settled'
  };

  const label = statusLabels[status];

  let gradientClass = '';
  switch (status) {
    case 0:
      gradientClass = 'bg-gradient-to-r from-blue-500 to-blue-600';
      break;
    case 1:
      gradientClass = 'bg-gradient-to-r from-green-500 to-green-600';
      break;
    case 2:
      gradientClass = 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      break;
    case 3:
      gradientClass = 'bg-gradient-to-r from-purple-500 to-purple-600';
      break;
    case 4:
      gradientClass = 'bg-gradient-to-r from-gray-500 to-gray-600';
      break;
    default:
      gradientClass = 'bg-gradient-to-r from-gray-500 to-gray-600';
      break;
  }

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const saveChanges = (data: any) => {
    statusUpdate(data);
    closeModal();
  };

  return (
    <div className='w-full'>
      <button className={`text-white font-bold py-2 px-4 rounded-lg shadow-lg ${gradientClass}`} onClick={openModal} disabled={status === 4}>
        {label}
      </button>
      <StatusModal status={status} isOpen={modalOpen} onClose={closeModal} onSave={saveChanges} dates={dates} amount={amount}/>
    </div>
  );
};

export default StatusButton;
