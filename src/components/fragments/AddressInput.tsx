'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
    onPlaceSelect : 
      (place: {
      name: string
      lat: number
      lng: number
      address: string
      }) => void
    disabled : boolean
    }

function AddressInput({onPlaceSelect, disabled=false} : Props) {

  const inputRef = useRef<HTMLInputElement>(null)
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null > (null)
  
  const startNewSession = () => {
    const token = new google.maps.places.AutocompleteSessionToken()
    setSessionToken(token)
    return token
  }

  useEffect(() => {
    
    if(!window.google || !inputRef.current) return
    
    const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment', 'geocode'],
      componentRestrictions: {country: 'id'},
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(0.45, 101.35),
        new window.google.maps.LatLng(0.60, 101.55)
      ),
      strictBounds: true,
      fields: ['place_id', 'geometry', 'name', 'formatted_address', 'types']
    })
    
    inputRef.current.addEventListener('focus', () => {
      if(!sessionToken){
      const token = startNewSession()
      autoComplete.setOptions(
        {sessionToken: token } as google.maps.places.AutocompleteOptions & {sessionToken?: google.maps.places.AutocompleteSessionToken})
      }
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

      setSessionToken(null)
    })  
  },[sessionToken,onPlaceSelect])

  return (
    <div>
      <input 
        type='text'
        ref={inputRef}
        placeholder='Masukkan tujuan delivery'
        className={`pl-2 w-full border rounded mb-4 mr-2 h-10 font-roboto font-light ${disabled ? 'bg-slate-300' : 'bg-white'}`}
        disabled = {disabled}
      />        
    </div>
  )
}

export default AddressInput