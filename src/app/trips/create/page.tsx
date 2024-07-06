'use client';

import React, { useEffect, useState } from 'react';
import TripForm from '@/components/trip/TripForm';
import { IDriver, TruckModel, IParty, ITrip } from '@/utils/interface';
import { useRouter } from 'next/navigation';

const CreateTripPage: React.FC = () => {
  const router = useRouter();
  const [parties, setParties] = useState<IParty[]>([]);
  const [trucks, setTrucks] = useState<TruckModel[]>([]);
  const [drivers, setDrivers] = useState<IDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partiesRes, trucksRes, driversRes] = await Promise.all([
          fetch('/api/parties'),
          fetch('/api/trucks'),
          fetch('/api/drivers')
        ]);

        if (!partiesRes.ok || !trucksRes.ok || !driversRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [partiesData, trucksData, driversData] = await Promise.all([
          partiesRes.json(),
          trucksRes.json(),
          driversRes.json()
        ]);

        setParties(partiesData.parties);
        setTrucks(trucksData.trucks);
        setDrivers(driversData.drivers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleTripSubmit = async (trip: any) => {
  
    try {
      // Create the trip
      const tripRes = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trip),
      });
  
      if (!tripRes.ok) {
        throw new Error('Failed to create trip');
      }
  
      // Update supplier truck hire cost
      const supplierRes = await fetch(`/api/suppliers/${trip.supplierId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ truckHireCost: trip.truckHireCost }), // Assuming truckHireCost is a field in trip
      });
  
      if (!supplierRes.ok) {
        throw new Error('Failed to update supplier');
      }
  
      // Update driver status
      const driverRes = await fetch(`/api/drivers/${trip.driver}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'On Trip' }), // Assuming your PATCH route can handle this
      });
  
      if (!driverRes.ok) {
        throw new Error('Failed to update driver status');
      }

      const truckRes = await fetch(`/api/trucks/${trip.truck}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'On Trip' }), // Assuming your PATCH route can handle this
      });
  
      if (!truckRes.ok) {
        throw new Error('Failed to update driver status');
      }
  
      const data = await tripRes.json();
      console.log(data);
      alert('Trip saved successfully');
      router.push('/trips');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('An error occurred while saving the trip. Please try again.');
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold text-center mb-4">Add a New Trip</h1>
      <TripForm parties={parties} trucks={trucks} drivers={drivers} onSubmit={handleTripSubmit} />
    </div>
  );
};

export default CreateTripPage;
