// DriversPage.tsx
'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import from 'next/router' instead of 'next/navigation'
import { IDriver } from '@/utils/interface';
import Loading from '@/app/loading';
import { useAuth } from '@/components/AuthProvider';

const DriversPage = () => {

  const router = useRouter();

 

  const [drivers, setDrivers] = useState<IDriver[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch('/api/drivers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch drivers');
        }

        const data = await res.json();
        setDrivers(data.drivers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);



  // Handling different states
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!drivers || drivers.length === 0) {
    return <div>No drivers found</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Drivers</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Status</th>
              <th>Balance (in Rupees)</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr key={index}>
                <td>{driver.name}</td>
                <td>{driver.contactNumber || '-'}</td>
                <td>{driver.status}</td>
                <td>{driver.balance || 0}</td>
                <td>
                  <Link href={`/user/drivers/${driver.driver_id}`} className="text-blue-500 hover:underline cursor-pointer">
                    View Driver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriversPage;
