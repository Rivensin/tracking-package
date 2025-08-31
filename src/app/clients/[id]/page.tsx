'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { useParams } from 'next/navigation'

const fetcher = (url :string) => fetch(url).then(res => res.json())
const Trackmap = dynamic(() => import('../../../components/core/Trackmap'),{ssr: false})

function Client() {
  const {id} = useParams()
  const {data,isLoading,error} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/clients?id=${id}`,fetcher)
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error Loading</div>
  if (!data?.data) return <div>Loading...</div>
  return (
    <div>
      <div className='flex justify-center items-center mt-4 px-4'>
        <div className='w-full h-[500px]'>
          {data?.data && (
          <Trackmap driverLocation={data?.data?.driverLocation} clientLocation={data?.data?.clientLocation} />
          )}
        </div>
        
      </div>    
    </div>
  )
}

export default Client