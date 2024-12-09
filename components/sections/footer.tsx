import Image from "next/image";
import Link from "next/link";

export default function Footer(){
    return(
        <footer className="py-4 px-8">
            <div className="border-t hidden lg:flex items-center justify-between border-[#2b2b2b] py-6">
                <h1 className="text-gray-500">© 2024 Mintpad</h1>
                <div className="flex  items-center gap-8">

                    <div className="flex gap-12 text-sm  text-gray-500">
                        <Link href={'https://mintpad.co/terms-of-use/'} className="hover:text-white">TERMS</Link>
                        <Link href={'https://mintpad.co/privacy-policy/'} className="hover:text-white">PRIVACY</Link>
                        <Link href={'https://mintpad.co/'} className="hover:text-white">CONTACT</Link>
            
                    </div>

                    <Link href={'https://discord.gg/ffCxWYFc'} className=" bg-[#14131D] w-fit p-4 rounded-full">
                        <Image src={'/discord.svg'} width={25} height={25} alt="tiktok" className="" />
                    </Link>
                    <Link href={'https://x.com/mintpadco'} className=" bg-[#14131D] w-fit p-4 rounded-full">
                        <Image src={'/twitter.svg'} width={25} height={25} alt="tiktok" className="" />
                    </Link>
                
                </div>
            </div>
            {/* smaller screens */}
            <div className=" lg:hidden flex flex-col justify-center items-center gap-12 border-t py-4 border-[#4e4e4e]">
                <div className="flex justify-center items-center gap-8">

                    <Link href={'https://discord.gg/ffCxWYFc'} className=" bg-[#14131D] w-fit p-4 rounded-full">
                        <Image src={'/discord.svg'} width={25} height={25} alt="tiktok" className="" />
                    </Link>
                    <Link href={'https://x.com/mintpadco'} className=" bg-[#14131D] w-fit p-4 rounded-full">
                        <Image src={'/twitter.svg'} width={25} height={25} alt="tiktok" className="" />
                    </Link>

                </div>
                <div className="flex gap-12 text-sm  text-gray-500">
                        <Link href={'https://mintpad.co/terms-of-use/'} className="hover:text-white">TERMS</Link>
                        <Link href={'https://mintpad.co/privacy-policy/'} className="hover:text-white">PRIVACY</Link>
                        <Link href={'https://mintpad.co/'} className="hover:text-white">CONTACT</Link>
            
                </div>
                <h1 className="text-gray-500">© 2024 Mintpad</h1>

            </div>
        </footer>
    )
}