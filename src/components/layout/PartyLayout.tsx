// components/parties/PartyLayout.tsx
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface PartyLayoutProps {
  children: React.ReactNode;
  partyName: string;
  partyId: string;
}

const PartyLayout: React.FC<PartyLayoutProps> = ({ children, partyName, partyId }) => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Trips', path: `/parties/${partyId}/trips` },
    { name: 'Passbook', path: `/parties/${partyId}/passbook` },
    { name: 'Monthly Balances', path: `/parties/${partyId}/monthly-balances` },
    { name: 'Party Details', path: `/parties/${partyId}/details` },
  ];

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-4">{partyName}</h1>
      <div className="flex space-x-4 mb-4 border-b-2 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => router.push(tab.path)}
            className={`px-4 py-2 transition duration-300 ease-in-out ${
              pathname === tab.path
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'border-transparent text-gray-600 hover:text-blue-500 hover:border-blue-500'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default PartyLayout;
