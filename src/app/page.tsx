'use client'
import useSWR from "swr";
import loading from "./loading";
import Link from "next/link";
import Image from "next/image";
import { TrackingRequest } from "@/lib/firebase/services";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Home() {
  const [copyId,setCopyId] = useState<string | null> (null)
  const [filterTrack,setFilterTrack] = useState<TrackingRequest[] | null>(null)
  const [isFiltered,setIsFiltered] = useState<string | null>(null)
  
  const copyLink = (id: string, link: string) => {
    setCopyId(id)
    
    toast.promise(
    window.navigator.clipboard.writeText(link),{
        loading: 'Saving...',
        success: <b>Link copied successfully!</b>,
        error: <b>Link cannot be copied!.</b>,
      }
    );
  }

  const filterStatus = (status: string) => {
    toast.promise(
      new Promise<void>(resolve => {
        setIsFiltered(status)
        setFilterTrack(track.filter((delivery : TrackingRequest) => delivery.status.includes(status)))
        resolve()
      }),{
        loading: 'Filtering...',
        success: <b>Filtering status successfully!</b>,
        error: <b>Filtering cannot be done!.</b>,
      }
    );
  }
  
  const {data,error,isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/tracking`,fetcher)
  if(error) return <div>Error Loading</div>
  if(isLoading) return loading()

  const track = data?.data

  return (
    <div className="min-h-screen px-4">
      <Toaster />
      <div>
        <span className="mt-4 text-2xl font-roboto">Delivery List</span>
      </div>
      <div>
        <span className="mb-4 text-slate-500 italic font-roboto font-light">Track delivery status & driver location</span>
      </div>
      <div className="flex items-center justify-between">
        <Link href='/tracking'>
          <div className="button-page bg-slate-200 hover:bg-slate-300">Tambah Delivery</div>
        </Link>
        <div className="ml-4 flex items-center">
          <div className="mr-4 font-semibold">Filtered By :</div>
            <button 
              className={`button-page ${isFiltered === 'Sedang Mengantar' ? 'bg-red-800 text-white hover:bg-red-800/80' : 'bg-slate-200 hover:bg-slate-300'}`} 
              onClick={() => filterStatus('Sedang Mengantar')}>
              Sedang Mengantar
            </button>
            <button 
              className={`ml-2 button-page ${isFiltered === 'Sudah Sampai' ? 'bg-green-800 text-white hover:bg-green-800/80' : 'bg-slate-200 hover:bg-slate-300'}`} 
              onClick={() => filterStatus('Sudah Sampai')}>
              Sudah Sampai
            </button>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center bg-slate-200 p-4 text-center font-roboto font-semibold rounded-sm">
          <div className="w-1/4">Tanggal</div>
          <div className="w-1/4">Tujuan</div>
          <div className="w-1/4">Status</div>
          <div className="w-1/4">Share</div>  
        </div>

        {track.length > 0 && filterTrack === null ? (
          track.map((delivery: TrackingRequest) => (
          <div 
            key={delivery.id} 
            className={`flex justify-center items-center p-4 text-center font-roboto font-light ${delivery.status === 'Sedang Mengantar' ? 'bg-red-500/60' : 'bg-green-500/60'}`}>
              <div className="w-1/4">
                {new Date(delivery.tanggal).toLocaleString('en-GB')}
              </div>
              <div className="w-1/4">
                {delivery.clientLocation.name}
              </div>
              <div className="w-1/4">
                {delivery.status === 'Sedang Mengantar' ? (
                  <Link href={`/clients/${delivery.id}`} className="underline text-[#5E50D2] hover:opacity-60 transition-all duration-500 ease-out">{delivery.status}</Link>) 
                  : 
                  delivery.status}
              </div>
              <div className="w-1/4 flex justify-center">
                <button onClick={ () => copyLink(delivery.id,`${process.env.NEXT_PUBLIC_API_URL}/clients/${delivery.id}`)}>
                  <Image 
                    src={delivery.id === copyId ? '/icons/copy-done.png' : '/icons/copy.png'}
                    alt='copy'
                    className="md:w-24 md:h-24 hover:opacity-50 transition-all duration-500 ease-out"
                    width={80}
                    height={80}
                    unoptimized
                    >
                  </Image>
                </button>
              </div>
          </div>
          ))
        ) : null}

        {filterTrack?.map((delivery : TrackingRequest) => (
          <div 
            key={delivery.id} 
            className={`flex justify-center items-center p-4 text-center font-roboto font-light ${delivery.status === 'Sedang Mengantar' ? 'bg-red-500/60' : 'bg-green-500/60'}`}>
              <div className="w-1/4">
                {new Date(delivery.tanggal).toLocaleString('en-GB')}
              </div>
              <div className="w-1/4">
                {delivery.clientLocation.name}
              </div>
              <div className="w-1/4">
                {delivery.status === 'Sedang Mengantar' ? (
                  <Link href={`/clients/${delivery.id}`} className="underline text-[#5E50D2] hover:opacity-60 transition-all duration-500 ease-out">{delivery.status}</Link>) 
                  : 
                  delivery.status}
              </div>
              <div className="w-1/4 flex justify-center">
                <button onClick={ () => copyLink(delivery.id,`${process.env.NEXT_PUBLIC_API_URL}/clients/${delivery.id}`)}>
                  <Image 
                    src={delivery.id === copyId ? '/icons/copy-done.png' : '/icons/copy.png'}
                    alt='copy'
                    className="md:w-24 md:h-24 hover:opacity-50 transition-all duration-500 ease-out"
                    width={80}
                    height={80}
                    unoptimized
                    >
                  </Image>
                </button>
              </div>
          </div>
        ))} 

        {isFiltered !== null &&  
        (
          <div 
            className="button-page bg-red-800 text-white hover:bg-red-800/80 cursor-pointer" 
            onClick={() => 
              toast.promise(
                new Promise<void>((resolve) => {
                  setFilterTrack(null)
                  setIsFiltered(null)
                  resolve()
                }),{
                loading: 'Clearing Filter...',
                success: <b>Clearing filter successfully!</b>,
                error: <b>Clearing filter cannot be copied!.</b>,
              })
            }>
            Clear Filter
          </div>
        )}
        
      </div>      
    </div>
  );
}
