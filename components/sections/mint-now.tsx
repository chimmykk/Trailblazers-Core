import Image from "next/image";
import Link from "next/link";
import "@fontsource/space-grotesk"; // Defaults to weight 400
import "@fontsource/space-grotesk/400.css"; // Specify weight

export default function MintNow() {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-12 relative bg-Img py-12 px-12 xl:px-40">
      {/* Left */}
      <div className="flex flex-col text-center lg:text-left gap-8">
        {/* Image for smaller screens */}
        <div className="lg:hidden">
          <Image src="/mintpadtaiko.gif" width={550} height={508} alt="Mintpad Taiko GIF" />
        </div>

        <div>
          <h1 className="text-[#EC25A1] text-3xl font-bold">GET YOUR</h1>
          <h1 className="text-[#E176FF] text-6xl font-bold">MINT PASS!</h1>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
          Collect your MintQuest NFT 
        </h1>

        <p className="text-lg">
          Free claim to Unique PFP Collection <br /> Access to Taiko/Mintpad Mints <br /> Priority Mintpad Support
        </p>

        {/* Mint Now button */}
        <div className="flex gap-3 items-center justify-center lg:justify-start text-white">
          <Link href="https://on.mintpad.co/mintpad-taiko-quest">
            <button className="button-gradient px-16 w-full py-4 text-2xl rounded-full font-bold">
              MINT NOW
            </button>
          </Link>
        </div>
      </div>

      {/* Image for larger screens */}
      <div className="hidden lg:block">
        <Image src="/mintpadtaiko.gif" width={550} height={508} alt="Mintpad Taiko GIF" />
      </div>
    </div>
  );
}
