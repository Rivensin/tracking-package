'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import Image from 'next/image'

const fetcher = (url :string) => fetch(url).then(res => res.json())
const Trackmap = dynamic(() => import('../../../components/core/Trackmap'),{ssr: false})

function Client() {
  const {id} = useParams()
  const {data,isLoading,error} = useSWR(`/api/clients?id=${id}`,fetcher)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error Loading</div>
  
  return (
    <div>
      <div className='mt-5 px-4'>
        <div className='max-w-md h-full'>
          {data?.data && (
          <Trackmap driverLocation={data?.data?.driverLocation} clientLocation={data?.data?.clientLocation} />
          )}
        </div>
        <div className='max-w-md font-monaSans bg-[#f6f6f6] p-2 mt-4 rounded-md'>
          <div className='bg-white text-xs rounded-md p-2 flex items-center'>
            <div>
              <Image 
              src='/icons/driver.png'
              width={50}
              height={50} 
              alt='driver-logo'
              unoptimized
              />
            </div>
            <div>
              <div>Dlooti</div>
              <div className='text-slate-500/80'>Driver</div>
            </div>
          </div>
          <div className='bg-white text-xs mt-2 rounded-md p-2'>
            <div>Phone</div>
            <div className='text-slate-500/80'>0813-7166-9811</div>
            <div>Status</div>
            <div className='text-slate-500/80 blinking-polyline-div'>{data?.data.status}</div>
          </div>
        </div>
      </div>    
    </div>
  )
}

export default Client