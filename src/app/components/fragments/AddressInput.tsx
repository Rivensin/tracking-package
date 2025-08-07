'use client'

import { useEffect, useRef } from 'react'

type Props = {
    onPlaceSelect : (place: {
      name: string
      lat: number
      lng: number
      address: string
    }) => void 
}

function AddressInput({onPlaceSelect} : Props) {

  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    
    if(!window.google || !inputRef.current) return
    
    const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      componentRestrictions: {country: 'id'},
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(0.45, 101.35),
        new window.google.maps.LatLng(0.60, 101.55)
      ),
      strictBounds: true
    })
  
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      if(!place.geometry || !place.geometry.location){
        console.warn('No geometry data available for this place.')
        return
      } 

      onPlaceSelect({
        name: place.name || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || ''
      })
    })
  },[])

  return (
    <div>
      <input 
        type='text'
        ref={inputRef}
        placeholder='masukkan tujuan delivery'
        className='border p-2 rounded w-full'
      />
      <button
        className='"mt-2 px-4 py-2 bg-blue-500 text-white rounded'>
        Search location
      </button>      
    </div>
  )
}

export default AddressInput