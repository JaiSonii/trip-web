// TrucksPage.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { TruckModel } from '@/utils/interface';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const TrucksPage = () => {
  const router = useRouter();

  const [trucks, setTrucks] = useState<TruckModel[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await fetch('/api/trucks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch trucks');
        }

        const data = await res.json();
        setTrucks(data.trucks);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        // Add a delay to improve UI experience even on fast networks
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchTrucks();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!trucks || trucks.length === 0) {
    return <div>No trucks found</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Trucks</h1>
      <div className="table-container">
        <table className="custom-table w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Truck Number</th>
              <th className="border p-2">Truck Type</th>
              <th className="border p-2">Ownership</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, index) => (
              <tr key={index} className="border-t">
                <td className="border p-2">{truck.truckNo}</td>
                <td className="border p-2">{truck.truckType}</td>
                <td className="border p-2">{truck.ownership}</td>
                <td className="border p-2">{truck.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrucksPage;
