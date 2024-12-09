


import { Rocket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TopCreators = () => {
  const profiles = [
    { rank: 1, name: 'Keepitreal', totalMints: "100 ETH", imageUrl: '/creator-pic-example.svg' },
    { rank: 2, name: 'GravityOne', totalMints: "56 ETH", imageUrl: '/creator-pic-example2.svg' },
    { rank: 3, name: 'Charlie', totalMints: "24 ETH", imageUrl: '/creator-pic-example.svg' },
    { rank: 4, name: 'David', totalMints: "19.5 ETH", imageUrl: '/creator-pic-example2.svg' },
    { rank: 5, name: 'Eve', totalMints: 900, imageUrl: '/creator-pic-example.svg' },
    { rank: 6, name: 'Frank', totalMints: 850, imageUrl: '/creator-pic-example2.svg' },
    { rank: 7, name: 'Grace', totalMints: 800, imageUrl: '/creator-pic-example.svg' },
    { rank: 8, name: 'Hank', totalMints: 750, imageUrl: '/creator-pic-example2.svg' },
    { rank: 9, name: 'Ivy', totalMints: 700, imageUrl: '/creator-pic-example.svg' },
    { rank: 10, name: 'Jack', totalMints: 650, imageUrl: '/creator-pic-example2.svg' },
  ];

  const gradientColors = {
    start: '#FFC876',
    mid1: '#79FFF7',
    mid2: '#9F53FF',
    end: '#FF98E2',
  };

  return (
    <div className="py-16 px-12 xl:px-40 relative">
      <div className="z-50 h-32 -mt-32 left-0 absolute w-full gradient-background"></div>
      <div className=' flex items-center justify-between'>
        <div>
            <h1 className="text-[#fff] text-4xl font-bold">Top Creators</h1>
            <h1 className="text-2xl font-light mt-4 font-sans">Checkout Top Rated Creators on the NFT Marketplace</h1>
        </div>
        <Link href={'/'} className='border flex items-center px-12 py-4 gap-4 border-[#8B50D7] rounded-2xl'>
            <Rocket color='#8B50D7'/>
            <h1>View Rankings</h1>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mt-12">
        {/* Rank 2 to 11 */}
        {profiles.map(profile => (
          <div key={profile.rank} className="border border-[#4f4f4f] rounded-xl py-8 flex bg-[#151515] flex-col justify-center gap-2 items-center text-white relative">
            <div className="absolute top-4 left-4 bg-[#232229] text-[#858584] w-8 h-8 flex items-center justify-center rounded-full text-base">{profile.rank}</div>
            <Image src={profile.imageUrl} width={500} height={500} alt="Profile" className="w-28 h-28 rounded-full" />
            <div className="text-center py-1">{profile.name}</div>
            <div className="text-center text-xs font-mono"><span className='text-[#636363] text-sm'>Total sales:</span> {profile.totalMints}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCreators;