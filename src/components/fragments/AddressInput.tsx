'use client'
import { useEffect, useRef } from 'react'

type Props = {
  onPlaceSelect : 
    ( place: {
      name: string
      lat: number
      lng: number
      address: string
    }) => void
  defaultValue: string
  disabled?: boolean
}

function AddressInput({onPlaceSelect} : Props) { 
  const inputRef = useRef<HTMLInputElement>(null)
 
  useEffect(() => {
    if(!window.google || !inputRef.current) return

    const autoComplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: {country: 'id'},
      fields: ['formatted_address', 'geometry', 'name'],
    })

    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace()
      
      if(!place.geometry?.location) return

      onPlaceSelect({
        name: place.name || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address || '',
      })
    })
  },[onPlaceSelect])
    
  return (
  <input
    ref={inputRef}
    placeholder="Masukkan tujuan delivery"
    className={`pl-2 w-full border rounded mb-4 mr-2 h-10 font-roboto font-light}`}
  />            
  )
}

export default AddressInput