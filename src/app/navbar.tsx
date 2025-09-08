'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function Navbar() { 
  const pathname = usePathname()
  return (
    <header className='w-full flex items-center bg-whiteNav border-2 border-slate-200 mb-5'>
      <div>
        {pathname.includes('clients') ? 
          (
            <Image 
              src='/icons/icon-removebg-preview.png' 
              alt='dlooti-logo'
              unoptimized
              className='w-32 h-24 ml-2 4xl:ml-32'
              width={150}
              height={100}
              priority
            />
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
      <div className='font-roboto text-[#5E50D2] text-lg'>
        Dlooti Tracking Delivery
      </div>
    </header>
  ) 
}

export default Navbar