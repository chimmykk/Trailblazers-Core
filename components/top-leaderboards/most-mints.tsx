import { useEffect, useState } from 'react';
import Image from 'next/image';
import WalletSearch from './wallet-search';

export default function MostMints() {
  interface Profile {
    rank: number;
    wallet: string;
    nfts: string;
    houses: string[];
    avatar: string;
  }

  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch('https://app.mintpad.co/api/getranksmostmint');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const mappedProfiles = data.map((profile: any) => ({
            rank: profile.rank,
            wallet: profile.holder, // Mapping holder to wallet
            nfts: profile.totalMint.toString(), // totalMint to nfts
            houses: profile.houses,
            avatar: '' // Assuming this will be added later
          }));
          setProfiles(mappedProfiles);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    }

    fetchProfiles();
  }, []);

  const handleWalletClick = (wallet: string) => {
    window.open(`https://taikoscan.net/address/${wallet}`, '_blank');
  };

  const formatName = (wallet: string) => {
    return wallet ? wallet.substring(0, 5) + '...' + wallet.substring(wallet.length - 4) : 'Unknown';
  };

  return (
    <main>
      <div className='flex flex-col items-center justify-center'>
        <div className={`flex flex-col mb-12 items-center ${profiles.length === 2 ? 'gap-24' : ''}`}>
          {/* Rank 1 */}
          {profiles.length > 0 && (
            <div className='relative'>
              <Image src={'/rank-1.svg'} width={600} height={100} alt='1' />
              <div className='absolute inset-0 mt-64 ml-3 flex flex-col items-center justify-center text-center'>
                <h1 
                  className='lg:text-2xl font-medium cursor-pointer' 
                  onClick={() => handleWalletClick(profiles[0].wallet)}
                >
                  {formatName(profiles[0].wallet)}
                </h1>
                <p className='text-xs lg:text-xl'><span className='text-gray-600'>Total Mints:</span> {profiles[0].nfts}</p>
              </div>
            </div>
          )}

          <div className='flex gap-40 lg:gap-64 -mt-40 lg:-mt-52'>
            {/* Rank 2 */}
            {profiles.length > 1 && (
              <div>
                <Image src={'/rank-2.svg'} width={150} height={100} alt='2' />
                <div className='flex mt-1 flex-col items-center justify-center text-center'>
                  <h1 
                    className='lg:text-xl font-medium cursor-pointer' 
                    onClick={() => handleWalletClick(profiles[1].wallet)}
                  >
                    {formatName(profiles[1].wallet)}
                  </h1>
                  <p className='text-xs lg:text-lg'><span className='text-gray-600'>Total Mints:</span> {profiles[1].nfts}</p>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {profiles.length > 2 && (
              <div>
                <Image src={'/rank-3.svg'} width={150} height={100} alt='3' />
                <div className='flex mt-1 flex-col items-center justify-center text-center'>
                  <h1 
                    className='lg:text-xl font-medium cursor-pointer' 
                    onClick={() => handleWalletClick(profiles[2].wallet)}
                  >
                    {formatName(profiles[2].wallet)}
                  </h1>
                  <p className='text-xs lg:text-lg'><span className='text-gray-600'>Total Mints:</span> {profiles[2].nfts}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ranks 4 to 10 */}
        {profiles.slice(3, 10).map(profile => (
          <div key={profile.rank} className='w-full mt-8'>
            <div className='relative p-[1px] rounded-2xl'>
              <div className='absolute inset-0 bg-gradient-to-r from-[#FFC876] via-[#79FFF7] to-[#FF98E2] rounded-2xl'></div>
              <div className='flex rounded-2xl px-4 p-2 lg:p-4 justify-between items-center relative bg-black'>
                <div className='flex items-center gap-4'>
                  <div className='relative p-0.5 rounded-full inline-block'>
                    <div className='absolute inset-0 bg-gradient-to-r from-[#FFC876] via-[#79FFF7] to-[#FF98E2] rounded-full'></div>
                    <div className='relative bg-black rounded-full px-4 py-2'>
                      <h1 className='lg:text-xl font-medium'>{profile.rank}</h1>
                    </div>
                  </div>
                  <h1 
                    className='lg:text-xl font-medium cursor-pointer' 
                    onClick={() => handleWalletClick(profile.wallet)}
                  >
                    {formatName(profile.wallet)}
                  </h1>
                </div>
                <p className='text-xs lg:text-lg'><span className='text-gray-600'>Total Mints:</span> {profile.nfts}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <WalletSearch />
    </main>
  );
}
