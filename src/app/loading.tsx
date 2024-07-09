import Image from "next/image"
import notfound from '@/assets/not-found.webp'

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-100 p-4">
          <Image src={notfound} alt="Not Found" width={100} height={100} className="mx-auto rounded" />
          
      </div>
    )
  }