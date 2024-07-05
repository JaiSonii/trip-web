import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parties",
  description: "Page for managing parties",
};

const PartiesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`${inter.className} bg-gray-100 min-h-screen flex flex-col`}>
      <div className="container mx-auto p-4 flex flex-col bg-white shadow-md rounded-md">
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-300 pb-2">
          <h1 className="text-3xl font-bold">Parties</h1>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
              <Link href="/parties/create">
                Add Party
              </Link>
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
              <Link href="/trips/create">
                Add Trip
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

export default PartiesLayout;
