import React from 'react';

interface TripStatusProps {
  status: number;
  dates: (Date)[]; // Array of dates, allowing for null values
}

const TripStatus: React.FC<TripStatusProps> = ({ status, dates }) => {
  const statuses = ['Started', 'Completed', 'POD Received', 'POD Submitted', 'Settled'];
  const statusIndex = status;

  return (
    <div className="mt-6 p-4">
      <div className="flex items-center ml-28">
        {statuses.map((s, index) => (
          <div key={s} className="flex items-center w-full justify-between">
            <div className={`flex items-center justify-center w-9 h-9 rounded-full ${index <= statusIndex ? 'bg-green-500' : 'bg-gray-300'}`}>
              {index === statusIndex && <span className="text-white">✓</span>}
            </div>
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-1 ${index < statusIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-evenly mt-2 text-sm text-gray-500">
        {statuses.map((s,index) => (
          <div key={s} className="mr-5 w-20 text-center">
            {s}
            <div className="mt-1 text-xs text-gray-400">
              {dates[index] ? new Date(dates[index]).toLocaleDateString() : '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripStatus;
