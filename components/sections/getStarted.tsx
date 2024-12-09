"use client"
import Image from "next/image"
import Link from "next/link"

export default function GetStarted(){
    return(
        <div className=" border z-50 -mt-[400px] mx-4 lg:mx-12 glass  flex flex-col items-center justify-center">
            <div className="flex flex-col z-50 gap-2 items-center  my-12"> 
              <h1 
                className="text-[#B25ACB] text-3xl font-semibold"
              >
                How to earn points
              </h1>
              <h1 className="text-xl"> Create. Mint. Earn.</h1>
            </div>
            <div className="flex flex-col lg:flex-row items-center ">
              <div className=" w-72 flex flex-col gap-2 items-center text-center justify-center mb-12 lg:mb-0">
                < Image src={'/one.svg'} width={70} height={1000} alt="background" className=" -mb-12" />
                <h1 className="text-lg font-semibold">Create</h1>
                <p className=" text-sm text-[#A3A3A3] leading-6">Make 1155 or 721 collectibles on Mintpad and share them with others to mint. Creators earn points on mint transactions. </p>
                <Link href="https://app.mintpad.co/register"  target="on_blank" className="button-gradient px-6 py-3 rounded-full font-medium my-4">
                  CREATE NOW 
                </Link>
              </div>
              < Image src={'/arrow.svg'} width={70} height={1000} alt="background" className="hidden lg:block  mx-12" />
              <div className=" w-72 flex flex-col gap-2 items-center text-center justify-center mb-12 lg:mb-0">
                < Image src={'/two.svg'} width={100} height={1000} alt="background" className=" -mt-3" />
                <h1 className="text-lg font-semibold">Mint</h1>
                <p className=" text-sm text-[#A3A3A3] leading-6">Start minting NFTs you love. The more transactions the more points you earn with Mintpad. Each unique transaction = 1 Mintpad point.</p>
                <Link href="https://on.mintpad.co/mintpad-taiko-quest" target="on_blank" className="button-gradient px-6 py-3  rounded-full font-medium my-4 mb-1 ">
                  START MINTING 
                  </Link>
                  {/* https://on.mintpad.co/mintpad-taiko-quest */}
              </div>
              < Image src={'/arrow.svg'} width={70} height={1000} alt="background" className="hidden lg:block mx-12" />
              <div className=" w-72 flex flex-col gap-2 items-center text-center justify-center mb-12 lg:mb-0">
                < Image src={'/three.svg'} width={100} height={1000} alt="background" className=" -mb-4" />
                <h1 className="text-lg font-semibold">Earn</h1>
                <p className=" text-sm text-[#A3A3A3] leading-6">Increase your chances of getting more points by creating NFTs people love and by collecting! View your global rank on the leaderboard below!</p>
                <Link href="#leaderboard" className="button-gradient px-6 py-3 rounded-full font-medium my-4 mt-2">
                  LEADERBOARD
                  </Link>
              </div>
            </div>
          </div>
    )
}
