'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import AddressInput from '../components/fragments/AddressInput'

function DriverTracking() {

  const Trackmap = dynamic(() => import('../components/core/Trackmap'),{ssr: false})
  
  //Map Input Search
  const [clientLocation,setClientLocation] = useState<{name: string, lat: number, lng: number, address: string} | null> (null)
  const [driverLocation,setDriverLocation] = useState<{name: string, lat: number, lng: number, address: string} | null > (null)

  const setDriverPosition = () => {
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(
        async(position) => {
          const {latitude, longitude} = position.coords
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_API_KEY}`)
          
          const data = await res.json()

          if (data.status !== 'OK' || !data.results || !data.results.length) {
            console.warn('No geocoding result found');
            return;
          }
          const firstResult = data?.results?.[0]
          const name = firstResult?.address_components?.[0]?.long_name || 'current location'
          const address = firstResult?.formatted_address || ''

          const newLocation = {name: name, lat: latitude, lng: longitude, address: address}

          if (!driverLocation || Math.abs(driverLocation.lat - latitude) > 0.0001 || Math.abs(driverLocation.lng - longitude) > 0.0001){
            setDriverLocation(newLocation)
          }

          await fetch('/api/driver-location',{
            method: 'POST',
            headers: {
              'content-type' : 'application/json',
            },
            body: JSON.stringify({lat: latitude, lng: longitude})    
          })
        },
        (error) => console.error('geolocation error :', {
          code: error.code,
          message: error.message  
        }), 
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000}
      )
    }
  }
  setDriverPosition()
  const trackLocation = () => setInterval(setDriverPosition,5000)
  
  return (
    <div>
      <AddressInput onPlaceSelect={setClientLocation}/>
      {clientLocation && ( <Trackmap driverLocation={driverLocation} clientLocation={clientLocation} /> )}
    </div>
  )
}

export default DriverTracking