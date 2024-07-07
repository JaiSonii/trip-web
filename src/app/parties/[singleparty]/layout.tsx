'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PartyLayout from '@/components/layout/PartyLayout';

interface PartyLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<PartyLayoutProps> = ({ children }) => {
  const {singleparty} = useParams();
  const [partyName, setPartyName] = useState<string>('');

  useEffect(() => {
    if (!singleparty) return;

    const fetchPartyName = async () => {
      try {
        const res = await fetch(`/api/parties/${singleparty}`);
        if (!res.ok) {
          throw new Error('Failed to fetch party name');
        }
        const data = await res.json();
        setPartyName(data.party.name);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchPartyName();
  }, [singleparty]);

  if (!singleparty) {
    return <div>Loading...</div>;
  }

  return (
    <PartyLayout partyId={singleparty as string} partyName={partyName}>
      {children}
    </PartyLayout>
  );
};

export default Layout;
