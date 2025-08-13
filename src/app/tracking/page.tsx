'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import AddressInput from '../components/fragments/AddressInput'

function DriverTracking() {

  const Trackmap = dynamic(() => import('../components/core/Trackmap'),{ssr: false})
  
  //Map Input Search
  const [clientLocation,setClientLocation] = useState<{name: string, lat: number, lng: number, address: string} | null> (null)
  const [driverLocation,setDriverLocation] = useState<{name: string, lat: number, lng: number, address: string} | null > (null)
  const [isDelivery,setIsDelivery] = useState(false)
  const [tripId, setTripId] = useState<string | null> (null)

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

          if(!driverLocation || Math.abs(driverLocation.lat - latitude) > 0.0001 || Math.abs(driverLocation.lng - longitude) > 0.0001){
            setDriverLocation(newLocation)

            if(tripId){
              await fetch(`api/tracking?id=${tripId}`, {
              method : 'POST',
              headers : {
                'content-type' : 'application/json'
              },
              body: JSON.stringify({
                lat: newLocation.lat,
                lng: newLocation.lng,
              })
            })
            }   
          }
        },
        (error) => console.error('geolocation error :', {
          code: error.code,
          message: error.message  
        }), 
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000}
      )
    }
  }

  useEffect(() => {
    setDriverPosition()  // run once after mount
  }, [])

  const startDelivery = async() => {
    if(isDelivery){
      setIsDelivery(false)
      return await fetch(`api/tracking?id=${tripId}`,{
        method: 'DELETE'
      })
    }

    setIsDelivery(true)
    const req = await fetch('/api/tracking',{
      method: 'POST',
      headers: {
        'content-type' : 'application/json',
      },
      body: JSON.stringify({driverLocation,clientLocation})    
    })

    const data = await req.json()

    if(data.success){
      setTripId(data.id)
    } else {
      setIsDelivery(false)
    }
    
    setInterval(() => {
      setDriverPosition()
    },5000)
    
  }
  
  console.log(driverLocation)
  console.log(clientLocation)
  console.log(tripId)
  return (
    <div>
      <div className='flex justify-center items-center mt-4 px-4'>
        <div className='w-3/4 mr-2'>
          <AddressInput onPlaceSelect={setClientLocation} disabled={isDelivery ? true : false}/>
        </div>
        <button
          className={`w-1/4 h-10 hover:opacity-80 duration-500 text-white rounded mb-4 text-sm font-roboto font-light ${clientLocation ? 'bg-blue-500' : 'pointer-events-none bg-slate-500/60'} ${isDelivery && clientLocation ? 'bg-red-500' : ''}`}
          onClick={() => {startDelivery()}}>
          {isDelivery ? 'Batal' : 'Start'}
        </button>  
      </div>

      {clientLocation && ( <Trackmap driverLocation={driverLocation} clientLocation={clientLocation} />)}
        
    </div>
  )
}

export default DriverTracking