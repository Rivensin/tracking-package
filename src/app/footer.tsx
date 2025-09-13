'use client'
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="overflow-hidden mt-auto">
      <div className="bg-purpleBg lg:pb-10 lg:flex lg:items-center lg:justify-evenly px-4">
        <div className="flex flex-col flex-wrap justify-center">
          <Image 
            src='/icons/icon-removebg-preview.png' 
            alt='dlooti-logo'
            unoptimized
            priority
            className='-ml-6 w-40 h-36'
            width={150}
            height={100}
          />
          <div className="text-white font-semibold text-md lg:max-w-md">
            DLOOTI is a boutique bakery — all handcrafted with care and attention to detail. Every treat is made to deliver comfort and unforgettable flavor in every bite.
          </div>
        </div>
        
        <div className="mt-4 pb-4 flex">
          <div className="mr-24">
            <div className="text-[#f84d78] text-xl font-semibold mt-4">Contact</div>
            <div className="flex flex-row lg:flex-col mt-2 text-white">
              <div className="group text-md mb-4 mr-6 lg:mr-0">
                <Link href='https://www.instagram.com/dlooti_/'>
                  <div className="flex items-center">
                    <Image
                      src='/icons/instagram.png' 
                      alt='dlooti-logo'
                      unoptimized
                      priority
                      className="mr-2 group-hover:opacity-60 duration-700 transition-all ease-out"
                      width={30}
                      height={30}>
                    </Image>
                    <span className="font-semibold group-hover:text-black duration-700 transition-all ease-out">dlooti_</span>
                  </div>
                </Link>
              </div>
              <div className="group text-md mb-4 mr-6 lg:mr-0">
                <Link href='https://wa.me/+6281374956263'>
                  <div className="flex items-center">
                    <Image
                      src='/icons/whatsapp.png' 
                      alt='dlooti-logo'
                      unoptimized
                      priority
                      className="mr-2 group-hover:opacity-60 duration-700 transition-all ease-out"
                      width={30}
                      height={30}>
                    </Image>
                    <span className="font-semibold group-hover:text-black duration-700 transition-all ease-out">dlooti</span>
                  </div>
                </Link>
              </div>
              <div className="group text-md mb-2 mr-6 lg:mr-0">
                <Link href='https://www.tiktok.com/@dlooti'>
                  <div className="flex items-center">
                    <Image
                      src='/icons/tiktok.png' 
                      alt='dlooti-logo'
                      unoptimized
                      priority
                      className="mr-2 group-hover:opacity-60 duration-700 transition-all ease-out"
                      width={30}
                      height={30}>
                    </Image>
                    <span className="font-semibold group-hover:text-black duration-700 transition-all ease-out">dlooti</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
