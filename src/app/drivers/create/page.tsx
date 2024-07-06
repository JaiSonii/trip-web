'use client'

import React from 'react';
import DriverForm from '@/components/createDriver';
import { IDriver } from '@/utils/interface';
import { useRouter } from 'next/navigation';


const isValidPhone = (phone: string): boolean => {
    return /^[6789]\d{9}$/.test(phone); // Phone number validation logic for India
};

const CreateDriverPage: React.FC = () => {
    const router = useRouter();

    const handleDriverSubmit = async (driver: IDriver) => {

        if (!isValidPhone(driver.contactNumber)) {
            alert('Invalid phone number. Please enter a 10-digit phone number.');
            return;
        }

        try {

            const res = await fetch('/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driver),
            });

            if (!res.ok) {
                if (res.status === 400) {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.message}`);
                    return;
                } else {
                    alert('An unexpected error occurred. Please try again.');
                    return;
                }
            }

            const data = await res.json();
            console.log(data);
            alert('Driver saved successfully');
            router.push('/drivers');
        } catch (error) {
            console.error('Error saving party:', error);
            alert('An error occurred while saving the party. Please try again.');
        }
    };

    return (
        <div className='w-full h-full'>
            <h1 className='text-xl font-bold text-center'>Add a New Driver</h1>
            <DriverForm onSubmit={handleDriverSubmit} />
        </div>
    );
};

export default CreateDriverPage;
