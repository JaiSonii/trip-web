'use client';
import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ITrip } from '@/utils/interface';
import { statuses } from '@/utils/schema';

const SinglePartyTrips = () => {
  const router = useRouter();
  const pathname = usePathname()
  const singleParty = pathname.split('/')[2]
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partyName, setPartyName] = useState<string>('');

  useEffect(() => {

    const fetchTrips = async () => {
      try {
        const res = await fetch(`/api/trips`);
        if (!res.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await res.json();
        const filterData = data.trips.filter((trip: ITrip) => trip.party === singleParty);
        setTrips(filterData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPartyName = async () => {
      console.log(singleParty)
      try {
        const res = await fetch(`/api/parties/${singleParty}`,{
          method : 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch party name');
        }
        const data = await res.json();
        setPartyName(data.party.name);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTrips();
    fetchPartyName();
  }, [singleParty]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (trips.length === 0) return <div>No trips for {partyName}</div>;

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Start Date</th>
            <th>LR Number</th>
            <th>Truck Number</th>
            <th>Route</th>
            <th>Status</th>
            <th>Party Balance</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr
              key={index}
              className="border-t hover:bg-slate-100 cursor-pointer"
              onClick={() => router.push(`/trips/${trip.tripId}`)}
            >
              <td>{new Date(trip.startDate).toLocaleDateString()}</td>
              <td>{trip.LR}</td>
              <td>{trip.truck}</td>
              <td>{trip.route.origin} -&gt; {trip.route.destination}</td>
              <td>{statuses[trip.status as number]}</td>
              <td>{trip.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SinglePartyTrips;
