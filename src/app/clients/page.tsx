'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import Trackmap from '../components/core/Trackmap'

const Map = dynamic(() => import('../components/core/Trackmap'), {ssr: false})

function ClientSide() {
  const [location, setLocation] = useState({lat:0, lng: 0})

  useEffect(() => {
    const interval = setInterval(
      async() => {
        const res = await fetch('api/tracking')
        const data = await res.json()
        setLocation(data)
      }
    ,3000)

    return () => clearInterval(interval)
  },[])

  return (
    <></>
    //<Trackmap driverLocation={location} clientLocation={location}/>
  )
}

export default ClientSide