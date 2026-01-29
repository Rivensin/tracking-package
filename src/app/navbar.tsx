'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

function Navbar() { 
  const pathname = usePathname()
  const router = useRouter()
  return (
    <header className='w-full flex items-center bg-whiteNav border-2 border-slate-200 mb-5 bg-white'>
      <div>
        {pathname.includes('clients') ? 
          (
            <button onClick={() => router.back()}>
              <Image 
                src='/icons/icon-removebg-preview.png' 
                alt='dlooti-logo'
                unoptimized
                className='w-32 h-24 ml-2 4xl:ml-32'
                width={150}
                height={100}
                priority
              />
            </button>
          )
          : 
          (
            <Link href='/'>
              <Image 
                src='/icons/icon-removebg-preview.png' 
                alt='dlooti-logo'
                unoptimized
                className='w-32 h-24 ml-2 4xl:ml-32'
                width={150}
                height={100}
                priority
              />
            </Link>
          ) 
        }
      </div>
      <button className='font-roboto text-[#5E50D2] text-lg' onClick={() => router.back()}>
        Dlooti Tracking Delivery
      </button>
    </header>
  ) 
}

export default Navbar