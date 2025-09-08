'use client'
import { useRouter } from "next/navigation"

export default function NotFound(){
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center mt-72">
      <h1 className="text-6xl 2xl:text-9xl text-center mb-4">
        ERROR 404
      </h1>
      <h2 className="mb-5 text-xl">
        Page Not Found
      </h2>
      <button onClick={() => router.back()} className="bg-blue-700 text-white p-3 duration-300 ease-out transition-all hover:opacity-80 hover:shadow-lg ">
        Back To Home
      </button>
    </div>
  )
}