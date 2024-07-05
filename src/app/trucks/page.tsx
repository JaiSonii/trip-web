// TrucksPage.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { TruckModel } from '@/utils/interface';

const TrucksPage = () => {
  const [trucks, setTrucks] = useState<TruckModel[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/trucks', {
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
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trucks || trucks.length === 0) {
    return <div>No trucks found</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Trucks</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Truck Number</th>
              <th>Truck Type</th>
              <th>Ownership</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck, index) => (
              <tr key={index} className="border-t">
                <td>{truck.truckNo}</td>
                <td>{truck.truckType}</td>
                <td>{truck.ownership}</td>
                <td>{truck.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrucksPage;
