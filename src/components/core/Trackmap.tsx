'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: '/icons/driver.png',
  iconSize: [60, 60],       // You can adjust size
  iconAnchor: [20, 40],     // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -40],    // Point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

type MapProps = {
  driverLocation : {
    name: string
    lat: number
    lng: number
    address: string
  } | null,
  clientLocation : {
    name: string
    lat: number
    lng: number
    address: string
  } | null
}

const AutoFitBounds = ({driverLocation, clientLocation} : MapProps) => {
  const map = useMap()
  useEffect(() => {
    if(driverLocation && clientLocation){
      const bounds : [[number,number], [number, number]] = [[driverLocation.lat, driverLocation.lng], [clientLocation.lat, clientLocation.lng]]
      map.fitBounds(bounds, {padding: [50,50]})
    }
  },[driverLocation, clientLocation, map])

  return null
}
function Trackmap({driverLocation, clientLocation} : MapProps) {
  
  return (
    <div className='max-w-md mx-auto mt-2 rounded-md overflow-hidden'>
      <MapContainer 
        center={[0.5071, 101.4478]} 
        zoom={15} 
        className='h-[470px]'>
        <TileLayer
          attribution='Mapdata©OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {driverLocation && clientLocation && (
          <Polyline positions = {[[driverLocation.lat, driverLocation.lng], [clientLocation.lat, clientLocation.lng]]}
          className='blinking-polyline'
          pathOptions = {{color: 'green', weight: 4, opacity: 0.7 }}
          />
          )
        }

        {driverLocation && (
          <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
            <Popup>Driver Location</Popup>
          </Marker>
        )}
        {clientLocation && (
          <Marker position={[clientLocation.lat, clientLocation.lng]} icon={redIcon}>
            <Popup>Client Location</Popup>
          </Marker>
        )}
        <AutoFitBounds driverLocation={driverLocation} clientLocation={clientLocation} />
      </MapContainer>
    </div>
  )
}

export default Trackmap