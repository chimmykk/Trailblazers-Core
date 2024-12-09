import { useState } from 'react';
import Image from 'next/image';

interface UserData {
    rank: number; // maps to "rank"
    address: string; // maps to "wallet"
    totalMint: number; // maps to "nfts"
    houses: string[]; // houses as an array of strings
}

export default function CollectorSearch() {
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [userData, setUserData] = useState<UserData | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWalletAddress(event.target.value);
    };

    const handleSubmit = async () => {
        if (!walletAddress) return;

        try {
            // Fetch top collector data
            const response = await fetch('api/fetchtopcollector', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data: UserData[] = await response.json();
                // Ensure address is defined before comparing
                const filteredData = data.find(user => user.address.toLowerCase() === walletAddress.toLowerCase());
                if (filteredData) {
                    setUserData(filteredData);
                } else {
                    setUserData(null);
                    console.error('Wallet address not found');
                }
            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            
            {/* Enter wallet address */}
            <br>
            </br>
            <br></br>
            <div className="flex flex-col lg:flex-row items-center justify-between my-16">
                <div className="hidden lg:block">
                    <Image src={'/see-rank.svg'} width={300} height={100} alt='See Rank' />
                </div>
                
                <div className="lg:hidden mb-8 text-2xl bg-gradient-to-r from-[#B75ECE] to-[#0077FE] bg-clip-text text-transparent">
                    See your Rank
                </div>

                <div className="border h-fit rounded-xl w-full lg:w-[70%] p-1 bg-[#191919] flex flex-col lg:flex-row items-center">
                    <input
                        type="text"
                        value={walletAddress}
                        onChange={handleInputChange}
                        className="bg-transparent flex-grow focus:outline-none px-4 py-3"
                        placeholder="Your wallet address"
                    />
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-3 hidden lg:flex flex-shrink-0 cursor-pointer button-gradient rounded-xl"
                    >
                        See Rank
                    </button>
                </div>
            </div>
            <button
                onClick={handleSubmit}
                className="px-12 py-3 flex w-full justify-center lg:hidden flex-shrink-0 cursor-pointer button-gradient rounded-xl"
            >
                See Rank
            </button>

            {/* Display user data if found */}
            {userData && (
                <div className='w-full mt-8'>
                    <div className='relative p-[1px] lg:-mx-4 rounded-2xl'>
                        <div className='absolute inset-0 bg-gradient-to-r from-[#FFC876] via-[#79FFF7] to-[#FF98E2] rounded-2xl'></div>
                        <div className='flex rounded-2xl p-2 lg:p-4 justify-between items-center relative bg-gradient-to-r from-[#693676] to-[#044895]'>
                            <div className='flex items-center gap-4'>
                                <div className='relative p-0.5 rounded-full inline-block'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-[#FFC876] via-[#79FFF7] to-[#FF98E2] rounded-full'></div>
                                    <div className='relative bg-black rounded-full px-4 py-2'>
                                        <h1 className='lg:text-xl font-medium'>{userData.rank}</h1>
                                    </div>
                                </div>
                                <h1 className='lg:text-xl font-medium'>{userData.address}</h1>
                            </div>
                            <p className='lg:text-lg'><span className='text-gray-400'>Total Mints: </span>{userData.totalMint}</p>
                        </div>
                        <h1 className="absolute bg-green-600 px-4 py-2 rounded-lg -top-6 -right-5 rotate-12">This is you</h1>
                    </div>

                    {/* Render houses */}
                    <div className='mt-4'>
                        {userData.houses.map((house, index) => (
                            <div key={index} className='bg-gray-800 p-4 rounded-lg mb-2'>
                                <h2 className='font-semibold'>Contract: {house}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
