import Image from "next/image"
import notfound from '@/assets/not-found.webp'

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="flex items-center min-h-screen justify-center  p-4">
          <Image src={notfound} alt="Not Found" width={100} height={100} className="mx-auto rounded" />
          
      </div>
    )
  }