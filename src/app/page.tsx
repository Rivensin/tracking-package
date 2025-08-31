'use client'
import useSWR from "swr";
import Link from "next/link";

export default function Home() {
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const {data,error,isLoading} = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/tracking`,fetcher)

  if(isLoading) return <div>Loading</div>
  if(error) return <div>Error Loading</div>

  return (
    <div className="px-4">
      <div className="mt-4 text-2xl font-roboto">Delivery List</div>
      <div className="mb-4 text-slate-500 italic font-roboto font-light ">Track delivery status & driver location</div>
      <div className="flex justify-center items-center bg-slate-300 py-4 text-center font-sans font-semibold rounded-sm">
        <div className="w-1/3">Tanggal</div>
        <div className="w-1/3">Tujuan</div>
        <div className="w-1/3">Status</div>  
      </div>
      {data?.data?.length > 0 && (
        data?.data?.map((delivery: any) => (
        <div 
          key={delivery.id} 
          className={`flex justify-center items-center py-4 text-center font-sans font-medium ${delivery.status === 'Sedang Mengantar' ? 'bg-red-500/60' : 'bg-green-500/60'}`}>
            <div className="w-1/3">
              {new Date(delivery.tanggal).toLocaleString('en-GB')}
            </div>
            <div className="w-1/3">
              {delivery.clientLocation.name}
            </div>
            <div className="w-1/3">
              {delivery.status === 'Sedang Mengantar' ? (
                <Link href={`/clients/${delivery.id}`} className="underline text-[#5E50D2] hover:opacity-60 transition-all duration-500 ease-out">{delivery.status}</Link>) 
                : 
                delivery.status}
            </div>
        </div>
        ))
      )}
    </div>
  );
}
