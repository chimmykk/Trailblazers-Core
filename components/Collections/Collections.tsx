"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import TopCollections from './Top-collections';
import { ethers } from 'ethers';
import axios from 'axios';

interface Profile {
  contractAddress: string;
  imageUri: string;
  name: string;
}

interface Collection {
  id: number;
  user_id: number;
  type: string;
  name: string;
  description: string | null;
  symbol: string;
  royalties: number;
  chain_id: number;
  address: string;
  permalink: string;
  created_at: string;
  updated_at: string;
}

const Collections = () => {
  const [view, setView] = useState('newest');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [permalinks, setPermalinks] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const ipfsToIpfsIo = (ipfsUri: string) => ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/');

  const fetchDataForAddress = async (address: string, provider: ethers.Provider) => {
    try {
      const abi = [
        'function name() view returns (string)',
        'function tokenURI(uint256 tokenId) view returns (string)'
      ];
      const contract = new ethers.Contract(address, abi, provider);
      const name = await contract.name();
      const tokenURI = await contract.tokenURI(0);
      const metadataUrl = ipfsToIpfsIo(tokenURI);
      const metadataResponse = await axios.get(metadataUrl);
      const metadata = metadataResponse.data;

      let imageUri = metadata.image;
      if (imageUri && imageUri.startsWith('ipfs://')) {
        imageUri = ipfsToIpfsIo(imageUri);
      }

      return {
        contractAddress: address,
        name,
        imageUri
      };
    } catch (error) {
      console.error(`Error fetching data for contract address ${address}:`, error);
      return null;
    }
  };

  const fetchErc1155DataFallback = async (address: string, provider: ethers.Provider) => {
    try {
      const erc1155Abi = [
        'function uri(uint256 id) view returns (string)',
        'function name() view returns (string)'
      ];
      const contract = new ethers.Contract(address, erc1155Abi, provider);
      const name = await contract.name();
      const uri = await contract.uri(0);
      const metadataUrl = ipfsToIpfsIo(uri);
      const metadataResponse = await axios.get(metadataUrl);
      const metadata = metadataResponse.data;

      let imageUri = metadata.image;
      if (imageUri && imageUri.startsWith('ipfs://')) {
        imageUri = ipfsToIpfsIo(imageUri);
      }

      return {
        contractAddress: address,
        name,
        imageUri
      };
    } catch (error) {
      console.error(`Error fetching ERC1155 data for address ${address}:`, error);
      return {
        contractAddress: address,
        name: 'Unknown',
        imageUri: null
      };
    }
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        // Initialize provider
        const provider = new ethers.JsonRpcProvider('https://rpc.mainnet.taiko.xyz');

        // Fetch collections data
        const collectionResponse = await fetch('https://app.mintpad.co/api/gettaikocollection');
        if (!collectionResponse.ok) throw new Error('Failed to fetch collection data');
        const collectionData: Collection[] = await collectionResponse.json();
        setCollections(collectionData);

        // Create a map for quick lookup of permalinks
        const permalinkMap: { [key: string]: string } = {};

        // Fetch contract data and permalinks for each collection
        const profilesData = await Promise.all(
          collectionData.map(async (collection) => {
            // Fetch contract data
            let data = await fetchDataForAddress(collection.address, provider);
            if (!data || !data.name) {
              data = await fetchErc1155DataFallback(collection.address, provider);
            }

            // Fetch permalink
            try {
              const permalinkResponse = await fetch(
                `https://app.mintpad.co/api/getpermalink/address/${collection.address}`
              );
              if (permalinkResponse.ok) {
                const permalinkData = await permalinkResponse.json();
                permalinkMap[collection.address.toLowerCase()] = permalinkData.permalink;
              }
            } catch (error) {
              console.error(`Failed to fetch permalink for ${collection.address}`);
            }

            return data;
          })
        );

        const validProfiles = profilesData.filter((profile): profile is Profile => 
          profile !== null && profile.name !== 'Unknown'
        );

        setProfiles(validProfiles);
        setPermalinks(permalinkMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, []);

  const handleMintClick = (contractAddress: string) => {
    const permalink = permalinks[contractAddress.toLowerCase()];
    if (permalink) {
      window.open(`https://on.mintpad.co/${permalink}`, '_blank', 'noopener,noreferrer');
    } else {
      console.error(`No permalink found for contract address: ${contractAddress}`);
    }
  };

  return (
    <div id='collections' className="py-16 px-4 xl:px-40 relative">
      <div className='flex flex-col lg:flex-row items-center justify-between'>
        <div className='text-center lg:text-left'>
          <h1 className="text-[#B65DCF] text-5xl font-bold">Collections</h1>
          <h1 className="text-2xl lg:text-3xl font-medium mt-4 font-sans">Compete to earn the most points!</h1>
        </div>
        <div className='flex gap-4 mt-4 w-full lg:w-fit'>
          <button
            className={`px-8 py-3 flex-shrink-0 cursor-pointer rounded-lg ${view === 'newest' ? 'button-gradient' : 'bg-black text-white border border-[#168BFB]'}`}
            onClick={() => setView('newest')}
          >
            Newest
          </button>
          <button
            className={`px-6 py-3 flex-1 cursor-pointer rounded-lg ${view === 'top' ? 'button-gradient' : 'bg-black text-white border border-[#168BFB]'}`}
            onClick={() => setView('top')}
          >
            Top Collections
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B65DCF]"></div>
        </div>
      ) : (
        view === 'newest' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mt-12">
            {profiles.map(profile => (
              <div key={profile.contractAddress} className="relative flex flex-col justify-between gap-2 items-start text-white bg-[#151515] rounded-xl p-2 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-[#FFC876] before:via-[#79FFF7] before:to-[#FF98E2] before:rounded-xl before:content-[''] before:-m-[0.5px]">
                <div>
                  {profile.imageUri?.endsWith('.mp4') ? (
                    <video
                      width="500"
                      height="500"
                      className="rounded-xl"
                      autoPlay
                      loop
                      muted
                    >
                      <source src={profile.imageUri} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={profile.imageUri?.startsWith('http') ? profile.imageUri : `/${profile.imageUri}`}
                      width={500}
                      height={500}
                      alt="Profile"
                      className="w-[500px] h-[250px] rounded-xl"
                    />
                  )}
                </div>
                <div className='w-full flex flex-col gap-4'>
                  <div>
                    <div className="">{profile.name}</div>
                    <div className="text-xs font-mono mt-2 text-gray-400"></div>
                  </div>
                  <button
                    className='px-8 py-2 cursor-pointer button-gradient rounded-full'
                    onClick={() => handleMintClick(profile.contractAddress)}
                  >
                    MINT
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <TopCollections />
          </div>
        )
      )}
    </div>
  );
};

export default Collections;