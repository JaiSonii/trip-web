// DriversLayout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drivers",
  description: "Page for managing drivers",
};

interface DriversLayoutProps {
  children: ReactNode;
}

const DriversLayout = ({ children }: DriversLayoutProps) => {
  return (
    <div className={`${inter.className} bg-gray-100 min-h-screen flex flex-col`}>
      <div className="container mx-auto p-4 flex flex-col bg-white shadow-md rounded-md">
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-300 pb-2">
          <h1 className="text-3xl font-bold">Drivers</h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
              <Link href="/drivers/create">
                Add Driver
              </Link>
            </button>
          </div>
        </div>
        <div className="flex-grow">
            {children}
        </div>
      </div>
    </div>
  );
};

export default DriversLayout;
