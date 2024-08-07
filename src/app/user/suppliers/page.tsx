// PartiesPage.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ISupplier } from '@/utils/interface';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const SuppliersPage = () => {
  const router = useRouter();

 
  const [suppliers, setSuppliers] = useState<ISupplier[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTrips, setActiveTrips] = useState(0)

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetch('/api/suppliers', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch parties');
        }

        const data = await res.json(); // Parse the response body as JSON
        setSuppliers(data.suppliers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        // Add a delay to improve UI experience even on fast networks
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!suppliers || suppliers.length === 0) {
    return <div>No Suppliers found</div>;
  }

  return (
    <div className="w-full h-full p-4">
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact Number</th>
              <th>Active Trips</th>
              <th>Supplier Balance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.supplier_id as string} className="border-t">
                <td>{supplier.name}</td>
                <td>{supplier.contactNumber}</td>
                <td>{activeTrips}</td>
                <td>{supplier.balance}</td>
                <td>
                  <Link href={`#`} className="text-blue-500 hover:underline cursor-pointer">
                    Action
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

export default SuppliersPage;
