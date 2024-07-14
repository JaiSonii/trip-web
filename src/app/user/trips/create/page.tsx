'use client'
import React, { useEffect, useState } from 'react';
import TripForm from '@/components/trip/TripForm';
import { IDriver, TruckModel, IParty, ITrip } from '@/utils/interface';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading'; // Ensure the Loading component shows a GIF
import { loadingIndicator } from '@/components/ui/loadingIndicator';

const CreateTripPage: React.FC = () => {
  const router = useRouter();
  
  const [parties, setParties] = useState<IParty[]>([]);
  const [trucks, setTrucks] = useState<TruckModel[]>([]);
  const [drivers, setDrivers] = useState<IDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // New state for saving overlay
  const [error, setError] = useState<string | null>(null);
  const [latestLR, setLatestLR] = useState<string>(''); // State to hold the latest LR

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch parties, trucks, drivers
        const [partiesRes, trucksRes, driversRes, tripsRes] = await Promise.all([
          fetch('/api/parties'),
          fetch('/api/trucks'),
          fetch('/api/drivers'),
          fetch('/api/trips')
        ]);

        if (!partiesRes.ok || !trucksRes.ok || !driversRes.ok || !tripsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [partiesData, trucksData, driversData, tripsData] = await Promise.all([
          partiesRes.json(),
          trucksRes.json(),
          driversRes.json(),
          tripsRes.json()
        ]);

        setParties(partiesData.parties);
        setTrucks(trucksData.trucks);
        setDrivers(driversData.drivers);

        // Find the latest trip's LR
        if (tripsData.trips.length > 0) {
          const latestTrip = tripsData.trips[0]; // Assuming the API returns trips sorted by date descending
          let num = parseInt(latestTrip.LR.split(' ')[1]) + 1
          setLatestLR('LRN ' + num); // Assuming 'lr' is the field containing LR in the trip object
        } else {
          setLatestLR('LRN 001'); // No trips found
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        // Add a delay to improve UI experience even on fast networks
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, []);

  const handleTripSubmit = async (trip: any) => {
    setSaving(true); // Show loading overlay

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
      if (trip.supplierId) {
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
      router.push('/user/trips');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert(`An error occurred while saving the trip. Please try again.: \n${error}`  );
    } finally {
      setSaving(false); // Hide loading overlay
    }
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full h-full relative">
      {saving &&  (
        <div className='absolute inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50'>
          {loadingIndicator} {/* Ensure Loading component shows the GIF */}
        </div>
      )}
      <h1 className="text-2xl font-bold text-center mb-4">Add a New Trip</h1>
      <TripForm parties={parties} trucks={trucks} drivers={drivers} onSubmit={handleTripSubmit} lr={latestLR}/>
    </div>
  );
};

export default CreateTripPage;
