'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MdDelete } from "react-icons/md";
import DriverLayout from '@/components/driver/driverLayout';
import { IDriver, ITrip, PaymentBook } from '@/utils/interface';
import Loading from '@/app/loading';
import { handleDeleteItem } from '@/helpers/DeleteAccount';

const Driver: React.FC = () => {
  // Extract the driverId from the URL path
  const pathname = usePathname();
  const driverId = pathname.split('/')[2];
  
  // State variables to hold driver data, loading status, and error messages
  const [driver, setDriver] = useState<IDriver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<PaymentBook[]>([]);

  // Function to handle deletion of a specific account
  const handleDelete = async (accountId: string) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setDriver(data.driver);  // Update the driver state with the new data
    } catch (error) {
      alert('Internal server error');
      console.log(error);
    }
  };

  // Function to fetch driver details from the API
  const fetchDriverDetails = async () => {
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver');
      }

      const result = await response.json();
      setDriver(result);  // Update the driver state with the fetched data
    } catch (err: any) {
      setError(err.message);  // Set the error message if fetching fails
    } finally {
      setLoading(false);  // Set loading to false after the fetch operation
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch trips');
      }
  
      const data = await res.json();
      const trips = data.trips.filter((trip: ITrip) => trip.driver === driverId);
  
      // Flatten the accounts array, filter by receivedByDriver, and include tripId
      const accountsData = trips.flatMap((trip: ITrip) =>
        trip.accounts
          .filter((acc: PaymentBook) => acc.receivedByDriver === true)
          .map((acc: PaymentBook) => ({
            ...acc,
            tripId: trip.trip_id,
          }))
      );
  
      setAccounts(accountsData); // Set the filtered accounts to state
  
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  
  
  // Fetch driver details when the component mounts or driverId changes
  useEffect(() => {
    fetchDriverDetails();
    fetchTrips();
  }, [driverId]);

  // Show loading state if data is still being fetched
  if (loading) {
    return <Loading />;
  }

  // Show error message if there's an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Show a message if no driver is found
  if (!driver) {
    return <div>No driver found</div>;
  }

  return (
    <div className="w-full">
      <DriverLayout name={driver.name} status={driver.status} driverId={driver.driver_id} onDriverUpdate={setDriver} />
      <div className="w-full h-full p-4">
        <h2 className="text-xl font-bold mb-4">Driver Accounts</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason</th>
                <th>Driver Gave</th>
                <th>Driver Got</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {driver.accounts.map((account, index: number) => (
                <tr key={index}>
                  <td>{new Date(account.date).toLocaleDateString()}</td>
                  <td>{account.reason}</td>
                  <td>{account.gave || ''}</td>
                  <td>{account.got || ''}</td>
                  <td>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md text-white"
                      onClick={() => handleDelete(account.account_id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
              {accounts.map((account: any, index: number) => (
                <tr key={index}>
                  <td>{new Date(account.paymentDate).toLocaleDateString()}</td>
                  <td>Trip {account.accountType} (from a trip)</td>
                  <td>{''}</td>
                  <td>{account.amount}</td>
                  <td>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md text-white"
                      onClick={async() => {
                        const data = await handleDeleteItem(account.tripId, account)
                        fetchTrips()
                      }}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Driver;
