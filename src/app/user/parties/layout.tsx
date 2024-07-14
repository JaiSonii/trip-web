import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from 'next/link';
import '@/app/globals.css'
import { Button } from "@/components/ui/button";

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
            <Button>
              <Link href="/user/parties/create">
                Add Party
              </Link>
              </Button>
            <Button >
              <Link href="/user/trips/create">
                Add Trip
              </Link>
            </Button>
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
