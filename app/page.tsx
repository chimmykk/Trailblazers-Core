"use client";

import GetStarted from "@/components/sections/getStarted";
import MintNow from "@/components/sections/mint-now";
import MintpadLine from "@/components/mintpad-line";
import ProfileMetrics from "@/components/profileMetrics";
import RocketLaunch from "@/components/rocket-launch";
import Image from "next/image";
import TopCreators from "@/components/top-creators";
import TopSellers from "@/components/top-sellers";
import Link from "next/link";
import { CircleArrowDown } from "lucide-react";
import { useRef } from "react";
import Collections from "@/components/Collections/Collections";
import Faq from "@/components/Faq";
import { Analytics } from "@vercel/analytics/react"
export default function Home() {
  const scrollToSection = () => {
    window.scrollBy({
      top: window.innerHeight, // Scroll down by one viewport height
      behavior: "smooth",
    });
  };

  return (
    <main className="w-screen py-24" style={{ fontFamily: 'Space Grotesk' }}>
      <Analytics></Analytics>
      <div className="w-full">
        <div className="z-10 mt-16 flex justify-center">
          <div className="mb-44">
            <Image src={'/tail.svg'} width={1000} height={1000} alt="bblazeers" className="w-[300px] lg:w-[440px] h-[230px]"/>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 my-4">
              <button className='px-6 flex-1 py-3 w-full lg:w-fit z-20 cursor-pointer button-gradient rounded-full'>
                <Link href='https://mintpad.co/' target='_blank' rel='noopener noreferrer'>
                  CREATE NOW
                </Link>
              </button>
              <button className='px-6 py-3 w-full lg:w-fit flex-1 z-20 cursor-pointer bg-black text-[#168BFB] border border-[#168BFB] rounded-full'>
                <Link href='#collections' >
                  MINT NOW
                </Link>
              </button>
              <div className="flex lg:hidden justify-center animate-move-up-down opacity-70 z-50 cursor-pointer ">
                <CircleArrowDown size={40} color="gray" onClick={scrollToSection} className="cursor-pointer z-50" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-1 z-10 ">
            <Image src={'/blazers-flex.png'} width={1500} height={1500} alt="background" />
          </div>
          <div className="absolute top-40 z-10 h-full w-full object-cover">
            <Image src={'/galaxy.svg'} width={2000} height={1000} alt="background" className="h-full w-full object-fill" />
          </div>
        </div>
        <div className="hidden lg:flex justify-center animate-move-up-down opacity-70 z-50 cursor-pointer absolute left-[48.5%] bottom-60">
          <CircleArrowDown size={40} color="gray" onClick={scrollToSection} className="cursor-pointer z-50" />
        </div>
      </div>
      <div className="">
        <div className="z-10">
          <RocketLaunch />
        </div>
        <div id="getstarted">
          <GetStarted />
        </div>
      </div>
      <MintpadLine />
      <MintNow />
      <div id="leaderboard">
        <ProfileMetrics />
      </div>
      <Collections />

      {/* Partner Logos Section */}

 {/* Partner Logos Section */}
 <div className="flex flex-col items-center">
    <div className="text-white text-6xl font-bold mb-2">Partners</div>
    <div className="flex flex-wrap justify-center gap-16 my-16">
      <Image src="/brigade.PNG" alt="Brigade" width={100} height={100} />
      <Image src="/eisen.png" alt="Eisen" width={100} height={100} />
      <Image src="/stupidmonkey.png" alt="Stupid Monkey" width={100} height={100} />
      <Image src="/cybercrew.png" alt="Cyber Crew" width={100} height={100} />
      <Image src="/looperlands.jpg" alt="Looper Lands" width={100} height={100} />
      <Image src="/wod.png" alt="WOD" width={170} height={100} />
    </div>
  </div>

  <Faq />
</main>
  );
}
