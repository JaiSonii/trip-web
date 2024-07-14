'use client'

import React, { useEffect, useState } from 'react';
import SupplierForm from '@/components/createSupplier';
import { ISupplier } from '@/utils/interface';
import { useRouter } from 'next/navigation';
import { isValidPhone } from '@/utils/validate';
import { useAuth } from '@/components/AuthProvider';



const CreateSupplierPage: React.FC = () => {
  const router = useRouter();


    const handlePartySubmit = async (supplier: ISupplier) => {
        

        if (!isValidPhone(supplier.contactNumber)) {
            alert('Invalid phone number. Please enter a 10-digit phone number.');
            return;
        }

        try {

            const res = await fetch('/api/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplier),
            });

            if (!res.ok) {
                if (res.status === 400) {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.message}`);
                    return;
                }else {
                    alert('An unexpected error occurred. Please try again.');
                    return;
                }
            }

            const data = await res.json();
            console.log(data);
            alert('Supplier added Successfully');
            router.push('/user/suppliers');
        } catch (error) {
            console.error('Error saving supplier:', error);
            alert('An error occurred while adding the supplier. Please try again.');
        }
    };

    return (
        <div className='w-full h-full'>
            <h1 className='text-xl font-bold text-center'>Add a New Supplier</h1>
            <SupplierForm onSubmit={handlePartySubmit} />
        </div>
    );
};

export default CreateSupplierPage;
