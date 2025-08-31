'use client'
import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import AddressInput from '../../components/fragments/AddressInput'

const Trackmap = dynamic(() => import('../../components/core/Trackmap'),{ssr: false})

function DriverTracking() {
  const [isDelivery,setIsDelivery] = useState(false)
  const [tripId, setTripId] = useState<string | null> (null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null> (null)
  //Map Input Search
  const [clientLocation,setClientLocation] = useState<{name: string, lat: number, lng: number, address: string} | null> (null)
  const [driverLocation,setDriverLocation] = useState<{name: string, lat: number, lng: number, address: string} | null> (null)

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

          if(clientLocation && (Math.abs(latitude - clientLocation.lat) < 0.0005 || Math.abs(longitude - clientLocation.lng) < 0.0005)){
            setDriverLocation(newLocation)

            await fetch(`api/tracking?id=${tripId}`, {
              method : 'POST',
              headers : {
                'content-type' : 'application/json'
              },
              body: JSON.stringify({
                lat: newLocation.lat,
                lng: newLocation.lng,
                status: 'Selesai'
              })
            }) 

            setIsDelivery(false)
            if(intervalRef.current){
              clearInterval(intervalRef.current)
            }
            localStorage.removeItem('trackingSession')
            setClientLocation(null)
            setDriverPosition()
          } 

          if(!driverLocation || (Math.abs(driverLocation.lat - latitude) > 0.001 || Math.abs(driverLocation.lng - longitude) > 0.001)){
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
    const load= JSON.parse(localStorage.getItem('trackingSession') ?? 'null') 

    if(load){
      setIsDelivery(true)
      setTripId(load.id)
      setDriverLocation(load.driverLocation)
      setClientLocation(load.clientLocation)
      intervalRef.current = intervalRef.current = setInterval(() => {
        setDriverPosition()
      },5000)
    } else {
      setDriverPosition()  // run once after mount
    }
  }, [])

  const startDelivery = async() => {
    if(isDelivery && intervalRef.current){
      setIsDelivery(false)
      localStorage.removeItem('trackingSession')
      clearInterval(intervalRef.current)
      intervalRef.current = null

      return await fetch(`api/tracking?id=${tripId}`,{
        method: 'DELETE'
      })
    }

    setIsDelivery(true)

    const req = await fetch('/api/tracking',{
      method: 'POST',
      headers: {'content-type' : 'application/json'},
      body: JSON.stringify({driverLocation,clientLocation})    
    })

    const data = await req.json()

    if(data.success){
      setTripId(data.id)

      intervalRef.current = setInterval(() => {
        setDriverPosition()
      },5000)

      localStorage.setItem('trackingSession', JSON.stringify({
        id: data.id,
        clientLocation,
        driverLocation,
        startedAt: Date.now()
      }))
    } else {
      setIsDelivery(false)
    }
  }
  
  return (
    <div>
      <div className='flex justify-center items-center mt-4 px-4'>
        <div className='w-3/4 mr-2'>
          <AddressInput onPlaceSelect={setClientLocation} disabled={isDelivery ? true : false} defaultValue={clientLocation?.address || ''}/>
        </div>
        <button
          className={`w-1/4 h-10 hover:opacity-80 duration-500 text-white rounded mb-4 text-sm font-roboto font-light ${clientLocation ? 'bg-blue-500' : 'pointer-events-none bg-slate-500/60'} ${isDelivery && clientLocation ? 'bg-red-500' : ''}`}
          onClick={() => {startDelivery()}}>
          {isDelivery ? 'Batal' : 'Start'}
        </button>  
      </div>
    
    <Trackmap driverLocation={driverLocation} clientLocation={clientLocation} />
        
    </div>
  )
}

export default DriverTracking