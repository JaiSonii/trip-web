'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image' // Import the Image component for optimized images
import { FaTruckMoving } from "react-icons/fa";
const MainLayout = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: '/parties', label: 'Parties' },
    { href: '/trips', label: 'Trips' },
    { href: '/drivers', label: 'Drivers' },
    { href: '/trucks', label: 'Trucks' },
    { href: '/suppliers', label: 'Suppliers'}
  ];

  return (
    <div className="h-screen w-1/6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      <div className="flex items-center justify-center p-4">
        <FaTruckMoving size={40}/>
        <span className="ml-3 text-2xl font-bold">Mo Verse Demo Project</span>
      </div>
      <ul className="list-none p-0 m-0">
        {menuItems.map((item) => (
          <li key={item.href} className="mb-2">
            <Link href={item.href} passHref>
              <div className={`flex items-center p-4 text-lg font-semibold transition duration-300 ease-in-out rounded-md ${pathname === item.href ? 'bg-gray-600 text-gray-300' : 'hover:bg-gray-700 hover:text-gray-300'}`}>
                {item.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MainLayout
