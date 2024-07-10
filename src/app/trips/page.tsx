// TripsPage.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { IParty, ITrip, TripExpense } from '@/utils/interface';
import { statuses } from '@/utils/schema';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
import { fetchBalance } from '@/helpers/fetchTripBalance';

const TripsPage = () => {
  const [trips, setTrips] = useState<ITrip[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parties, setParties] = useState<IParty[]>()

  const router = useRouter()

  useEffect(() => {
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
        setTrips(data.trips);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchParties = async () => {
      try {
        const res = await fetch('/api/parties', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch parties');
        }

        const data = await res.json(); // Parse the response body as JSON
        setParties(data.parties);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        // Add a delay to improve UI experience even on fast networks
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchParties();
    

    fetchTrips();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trips || trips.length === 0) {
    return <div>No trips found</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Trips</h1>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>LR Number</th>
              <th>Party Name</th>
              <th>Truck Number</th>
              <th>Route</th>
              <th>Status</th>
              <th>Party Balance</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, index) => (
              <tr key={index} className="border-t hover:bg-slate-100 cursor-pointer" onClick={()=> router.push(`/trips/${trip.tripId}`)}>
                <td>{new Date(trip.startDate).toLocaleDateString()}</td>
                <td>{trip.LR}</td>
                <td>{parties?.find((party) => party.party_id == trip.party)?.name}</td>

                <td>{trip.truck}</td>
                <td>{trip.route.origin.split(',')[0]} -&gt; {trip.route.destination.split(',')[0]}</td>
                <td>{statuses[trip.status as number]}</td>
                <td>{fetchBalance(trip)}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripsPage;
