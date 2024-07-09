'use client'

import React, { useEffect, useState } from 'react';
import { ITrip } from '@/utils/interface';
import { useParams } from 'next/navigation';
import TripDetails from '@/components/trip/tripDetail/TripDetail';
import Loading from '@/app/loading';

const TripPage: React.FC = () => {
  const [trip, setTrip] = useState<ITrip | null>(null);
  const { tripId } = useParams();

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const res = await fetch(`/api/trips/${tripId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch trip details');
        }
        const data = await res.json();
        setTrip(data.trip);


        
      } catch (error) {
        console.error('Error fetching trip details:', error);
      }
    };

    if (tripId) {
      fetchTripDetails();
    }
  }, [tripId]);

  if (!trip) {
    return <Loading />;
  }

  return (
    <div className=" mx-auto p-4">
      <TripDetails trip={trip} setTrip={setTrip}/>
    </div>
  );
};

export default TripPage;
