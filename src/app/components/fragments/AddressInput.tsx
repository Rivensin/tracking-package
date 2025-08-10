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
    }

function AddressInput({onPlaceSelect} : Props) {

  const inputRef = useRef<HTMLInputElement>(null)
  const [isAddress,SetIsAddress] = useState(false)
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
      SetIsAddress(true)
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
    <div className='max-w-md px-4 mx-auto mt-4 flex justify-center items-center'>
      <input 
        type='text'
        ref={inputRef}
        placeholder='masukkan tujuan delivery'
        className='border rounded w-3/4 mb-4 mr-2 h-10 font-roboto font-light'
      />
      <button
        className={`w-1/4 h-10 px-4 bg-blue-500 hover:opacity-80 duration-500 text-white rounded mb-4 text-sm font-roboto font-light ${isAddress ? '' : 'pointer-events-none'}`}>
        {isAddress ? 'Start' : 'Cari'}
      </button>      
    </div>
  )
}

export default AddressInput