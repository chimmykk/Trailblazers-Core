
"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Eclipse(){

    const pathname = usePathname()

    return(
        <div className={` ${pathname == '/' ? 'block' : 'hidden'} absolute w-full h-full opacity-100 z-10 `}>
            <Image src={'/eclipse.svg'} width={2000} height={1500} alt="background w-full" />
             
        </div>
    )
}