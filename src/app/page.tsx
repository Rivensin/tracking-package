'use client'
import useSWR from "swr";
import Link from "next/link";
import { TrackingRequest } from "@/lib/firebase/services";
import loading from "./loading";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const fetcher = (url: string) => fetch(url).then(res => res.json())

  const [copyId,setCopyId] = useState<string | null> (null)

  const copyLink = (id: string, link: string) => {
    setCopyId(id)
    window.navigator.clipboard.writeText(link)
  }

  const {data,error,isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/tracking`,fetcher)
  if(error) return <div>Error Loading</div>
  if(isLoading) return loading()

  return (
    <div className="min-h-screen px-4">
      <div>
        <span className="mt-4 text-2xl font-roboto">Delivery List</span>
      </div>
      <div>
        <span className="mb-4 text-slate-500 italic font-roboto font-light">Track delivery status & driver location</span>
      </div>
      <Link href='/tracking'>
        <div className="w-40 my-3 py-3 px-2 font-roboto bg-slate-200 text-center rounded-md hover:shadow-md hover:bg-slate-300 transition-all duration-300 ease-out">Tambah Delivery</div>
      </Link>
      
      <div>
        <div className="flex justify-center items-center bg-slate-200 p-4 text-center font-roboto font-semibold rounded-sm">
          <div className="w-1/4">Tanggal</div>
          <div className="w-1/4">Tujuan</div>
          <div className="w-1/4">Status</div>
          <div className="w-1/4">Share</div>  
        </div>
        {data?.data?.length > 0 && (
          data?.data?.map((delivery: TrackingRequest) => (
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
        )}
      </div>      
    </div>
  );
}
