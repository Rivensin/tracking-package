'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import loading from './loading'

const fetcher = (url :string) => fetch(url).then(res => res.json())
const Trackmap = dynamic(() => import('../../../components/core/Trackmap'),{
  ssr: false,
  loading:() => (
    <div className='h-[470px] xl:h-[550px] max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl bg-slate-300 duration-300 transition-all ease-out animate-pulse'></div>
  )
})

function Client() {
  const {id} = useParams()
  const {data,isLoading,error} = useSWR(`/api/clients?id=${id}`,fetcher)
  if (isLoading) return loading()
  if (error) return <div>Error Loading</div>
  
  console.log(data?.data)

  return (
    <div className='mt-5 px-4 mb-10'>
      <div className='max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto h-full'>
        {data?.data && (
        <Trackmap driverLocation={data?.data?.driverLocation} clientLocation={data?.data?.clientLocation} />
        )}
      </div>
      <div className='max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto font-monaSans bg-[#f6f6f6] p-2 mt-4 rounded-md'>
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
          <div>Tanggal</div>
          <div className='text-slate-500/80'>
            <span className='mr-2'>{new Date(data?.data.tanggal).toLocaleDateString()}</span>
            <span>{new Date(data?.data.tanggal).toLocaleTimeString()}</span>
          </div>
          <div>Contact</div>
          <div className='text-slate-500/80'>0813-7166-9811</div>
          <div>Status</div>
          <div className={data?.data.status === 'Sudah Sampai' ? 'text-green-500/80 font-semibold' : `text-slate-500/80 blinking-polyline-div`}>{data?.data.status}</div>
        </div>
      </div>
    </div>    
  )
}

export default Client