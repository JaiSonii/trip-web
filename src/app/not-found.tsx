'use client' // Error components must be Client Components
import Link from 'next/link'
import { useEffect } from 'react'
import Image from 'next/image'
import notfound from '../assets/not-found.webp'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-100 p-4">
      <div className="max-w-md text-center p-8 bg-white shadow-2xl rounded-lg">
        <Image src={notfound} alt="Not Found" width={480} height={360} className="mx-auto rounded" />
        <h1 className="text-5xl font-bold text-gray-800 mt-6">404</h1>
        <p className="text-lg text-gray-600 mt-2">Oops! The page you're looking for doesn't exist.</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 hover:text-white transition duration-200 shadow-lg">
    
            Go Home
          
        </Link>
      </div>
    </div>
  )
}
