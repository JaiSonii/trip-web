import React, { useEffect, useState } from 'react';
import { RiSteering2Fill } from "react-icons/ri";
import Link from 'next/link';

interface TruckHeaderProps {
  truck: string;
  driver: string;
}

const TruckHeader: React.FC<TruckHeaderProps> = ({ truck, driver }) => {
  const [truckName, setTruckName] = useState(truck);
  const [driverName, setDriverName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await fetch(`/api/drivers/${driver}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch driver');
        }

        const result = await response.json();
        setDriverName(result.name);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDriverDetails();
  }, [driver]);

  return (
    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg text-white">
      <div className="flex items-center">
        <div className="bg-white p-4 rounded-full text-indigo-500">
          <span className="text-4xl">🚛</span>
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold cursor-pointer transition-all duration-300 ease-in-out transform hover:text-indigo-300 hover:scale-105 hover:z-10">
            <Link href={`/trucks/${truck}`}>
              <span>{truckName}</span>
            </Link>
          </h1>
        </div>
      </div>
      <div className="flex items-center">
        <RiSteering2Fill className="text-4xl text-white mr-2 transition-all duration-300 ease-in-out transform hover:text-indigo-300 hover:scale-105 hover:z-10 cursor-pointer" />
        <div className="text-right">
          {isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : (
            <div className="flex items-center">
              <h1 className="text-2xl font-bold cursor-pointer transition-all duration-300 ease-in-out transform hover:text-indigo-300 hover:scale-105 hover:z-10">
                <Link href={`/drivers/${driver}`}>
                  <span>{driverName}</span>
                </Link>
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TruckHeader;
