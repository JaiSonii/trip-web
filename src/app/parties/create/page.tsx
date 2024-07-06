'use client'

import React from 'react';
import PartyForm from '@/components/createParty';
import { IParty } from '@/utils/interface';
import { useRouter } from 'next/navigation';
import { isValidGSTNumber } from '@/utils/validate';
import { isValidPhone } from '@/utils/validate';



const CreatePartyPage: React.FC = () => {
    const router = useRouter();

    const handlePartySubmit = async (party: IParty) => {
        if (!isValidGSTNumber(party.gstNumber)) {
            alert('Invalid GST number. Please enter a valid GST number.');
            return;
        }

        if (!isValidPhone(party.contactNumber)) {
            alert('Invalid phone number. Please enter a 10-digit phone number.');
            return;
        }

        try {
            console.log('Submitted Party:', party);

            const res = await fetch('/api/parties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(party),
            });

            if (!res.ok) {
                if (res.status === 400) {
                    const errorData = await res.json();
                    alert(`Error: ${errorData.message}`);
                    return;
                } else if (res.status === 409) {
                    alert('Duplicate GST number. Please use a unique GST number.');
                    return;
                } else {
                    alert('An unexpected error occurred. Please try again.');
                    return;
                }
            }

            const data = await res.json();
            console.log(data);
            alert('Party saved successfully');
            router.push('/parties');
        } catch (error) {
            console.error('Error saving party:', error);
            alert('An error occurred while saving the party. Please try again.');
        }
    };

    return (
        <div className='w-full h-full'>
            <h1 className='text-xl font-bold text-center'>Add a New Party</h1>
            <PartyForm onSubmit={handlePartySubmit} />
        </div>
    );
};

export default CreatePartyPage;
