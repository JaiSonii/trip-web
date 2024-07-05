'use client';
import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { ITrip } from '@/utils/interface';

const SinglePartyTrips = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const singleParty = pathname.split('/')[2];
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(singleParty)
    const fetchTrips = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/trips/${singleParty}`);
        if (!res.ok) {
          throw new Error('Failed to fetch trips');
        }
        const data = await res.json();
        setTrips(data.trips);
      } catch (err : any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [singleParty]);

  if(trips.length == 0) return <div>No trips for {singleParty}</div>
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Trips for {singleParty}</h1>
      <ul>
        {trips.map(trip => (
          <li key={trip._id as string}>{trip.route.origin} to {trip.route.destination}</li>
        ))}
      </ul>
    </div>
  );
};

export default SinglePartyTrips;
