
"use client";
import React, { useState } from 'react';
import MostMints from '@/components/top-leaderboards/most-mints';
import MostHolders from '@/components/top-leaderboards/most-holders';
import MostTransfers from '@/components/top-leaderboards/most-transfers';

const ProfileMetrics = () => {
  const [currentCategory, setCurrentCategory] = useState('mostTransfers'); 

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
  };

  return (
    <div className="py-16 px-6 xl:px-80 bg-black relative">
      <div className='flex flex-col justify-center items-center'>
        <h1 className="text-[#E176FF] text-4xl font-bold">TOP OF THE TOPS </h1>
        <h1 className="text-2xl font-semibold mt-2 text-center lg:text-left">Check out the rankings</h1>
      </div>

      <div className="hidden lg:flex items-center justify-center gap-4 mt-12">
        <button onClick={() => handleCategoryChange('mostMints')} className={`flex text-white z-50 items-center px-8 py-3 cursor-pointer ${currentCategory === 'mostMints' ? 'button-gradient' : 'border border-[#2E71F2]'} rounded-full`}>Most Points</button>
        <button onClick={() => handleCategoryChange('mostHolders')} className={`flex text-white z-50 items-center px-8 py-3 cursor-pointer ${currentCategory === 'mostHolders' ? 'button-gradient' : 'border border-[#2E71F2]'} rounded-full`}>Top Creators</button>
        <button onClick={() => handleCategoryChange('mostTransfers')} className={`flex text-white z-50 items-center px-8 py-3 cursor-pointer ${currentCategory === 'mostTransfers' ? 'button-gradient' : 'border border-[#2E71F2]'} rounded-full`}>Top Collectors</button>
      </div>

      <div className="flex lg:hidden items-center justify-center gap-2 md:gap-4 mt-12 w-full">
  <button
    onClick={() => handleCategoryChange('mostMints')}
    className={`flex-1 text-white z-50 items-center text-xs justify-center px-4 py-2 cursor-pointer ${currentCategory === 'mostMints' ? 'button-gradient' : 'border border-[#2E71F2]'} rounded-full text-center whitespace-nowrap`}
  >
    Most Points
  </button>
  <button
    onClick={() => handleCategoryChange('mostHolders')}
    className={`flex-1 text-white z-50 items-center text-xs justify-center px-4 py-2 cursor-pointer ${currentCategory === 'mostHolders' ? 'button-gradient' : 'border border-[#2E71F2]'} rounded-full text-center whitespace-nowrap`}
  >
    Top Creators
  </button>
  <button
    onClick={() => handleCategoryChange('mostTransfers')}
    className={`flex-1 text-white z-50 items-center text-xs justify-center px-4 py-2 cursor-pointer ${currentCategory === 'mostTransfers' ? 'button-gradient' : 'border border-[#2E71F2]'} rounded-full text-center whitespace-nowrap`}
  >
    Top Collectors
  </button>
</div>


      <div>
        {currentCategory === 'mostMints' && <MostMints />}
        {currentCategory === 'mostHolders' && <MostHolders />}
        {currentCategory === 'mostTransfers' && <MostTransfers />}

      </div>
    </div>
  );
};

export default ProfileMetrics;

