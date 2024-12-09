

"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Planets() {
  const pathname = usePathname()

  return (
    <div className={` hidden lg:block absolute w-full h-full z-0 ${pathname == '/' ? 'block' : 'hidden'}`}>
      {/* Container for rotating planets */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-[70%] rotate-animation h-full">
            <Image src={'/planet1.svg'} width={20} height={100} alt="background" className="z-0 absolute top-[26%] rotate-animation left-[25%] " />
            <Image src={'/planet2.svg'} width={20} height={100} alt="background" className="z-0 absolute top-[80%] rotate-animation right-[21%] " />
        </div>
      </div>
    </div>
  )
}
