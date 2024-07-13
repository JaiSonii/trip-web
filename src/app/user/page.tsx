'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const UserPage = () => {
  const router = useRouter()
  router.replace('/login')
  return (
    <div>UserPage</div>
  )
}

export default UserPage