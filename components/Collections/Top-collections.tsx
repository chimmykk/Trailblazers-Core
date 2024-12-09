"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from 'ethers';
import axios from 'axios';

interface Collection {
  contractAddress: string;
  rank: number;
  name: string;
  totalmint: number;
  imageUri: string;
  tokenURI: string | null;
  permalink: string;
}

interface HouseData {
  house: string;
  total_mint: number;
  rank: number;
}

export default function TopCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to convert IPFS URL
  const ipfsToIpfsIo = (url: string) => url.replace('ipfs://', 'https://ipfs.io/ipfs/');

  // Fetch ERC721 data
  const fetchErc721Data = async (address: string, provider: ethers.Provider) => {
    try {
      const erc721Abi = [
        'function name() view returns (string)',
        'function tokenURI(uint256 tokenId) view returns (string)'
      ];
      
      const contract = new ethers.Contract(address, erc721Abi, provider);
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
        tokenURI,
        imageUri
      };
    } catch (error) {
      console.error(`Error fetching ERC721 data for contract address ${address}:`, error);
      return null;
    }
  };

  // Fetch ERC1155 data
  const fetchErc1155Data = async (address: string, provider: ethers.Provider) => {
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
        tokenURI: uri,
        imageUri
      };
    } catch (error) {
      console.error(`Error fetching ERC1155 data for contract address ${address}:`, error);
      return null;
    }
  };

  // Fetch data for address (try ERC721 first, then ERC1155)
  const fetchDataForAddress = async (address: string, provider: ethers.Provider) => {
    let data = await fetchErc721Data(address, provider);
    if (!data) {
      data = await fetchErc1155Data(address, provider);
    }
    return data;
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Initialize provider
        const provider = new ethers.JsonRpcProvider('https://rpc.mainnet.taiko.xyz');

        // Fetch house data
        const houseResponse = await fetch('https://app.mintpad.co/api/topcollection');
        if (!houseResponse.ok) {
          throw new Error(`Error fetching house data: ${houseResponse.statusText}`);
        }
        const houseData: HouseData[] = await houseResponse.json();

        // Fetch contract data and permalinks for each house
        const collectionsData = await Promise.all(
          houseData.map(async (item) => {
            try {
              // Fetch contract data
              const contractData = await fetchDataForAddress(item.house, provider);
              
              // Fetch permalink
              const permalinkResponse = await fetch(
                `https://app.mintpad.co/api/getpermalink/address/${item.house}`
              );
              const permalinkData = await permalinkResponse.json();

              if (contractData) {
                return {
                  ...contractData,
                  totalmint: item.total_mint,
                  rank: item.rank,
                  permalink: permalinkData.permalink
                };
              }
              return null;
            } catch (error) {
              console.error(`Error processing collection ${item.house}:`, error);
              return null;
            }
          })
        );

        // Filter out null values and sort by totalmint
        const validCollections = collectionsData
          .filter((data): data is Collection => data !== null)
          .sort((a, b) => b.totalmint - a.totalmint)
          .map((data, index) => ({
            ...data,
            rank: index + 1
          }));

        setCollections(validCollections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <main className="my-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B65DCF]"></div>
      </main>
    );
  }

  return (
    <main className="my-8">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-[#808a9d] font-mono font-light text-sm border-b border-[#595959]">
            <tr>
              <th scope="col" className="px-4 py-3 text-left tracking-wider">RANK</th>
              <th scope="col" className="px-2 py-3 text-left tracking-wider w-full">COLLECTION</th>
              <th scope="col" className="px-12 py-3 text-right tracking-wider">Points</th>
              <th scope="col" className="px-12 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.contractAddress}>
                <td className="px-6 py-4 w-[100px] text-[#fff] text-2xl text-right font-semibold">
                  {collection.rank}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm font-medium w-full">
                  <div className="flex items-center gap-4">
                    {collection.imageUri?.endsWith('.mp4') ? (
                      <video
                        width={70}
                        height={70}
                        autoPlay
                        loop
                        muted
                        className="rounded-lg"
                      >
                        <source src={collection.imageUri} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        width={70}
                        height={70}
                        src={collection.imageUri || '/default-image.svg'}
                        alt="Collection Image"
                        className="rounded-lg"
                      />
                    )}
                    <h1 className="text-2xl">{collection.name}</h1>
                  </div>
                </td>
                <td className="px-12 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <h1>{collection.totalmint}</h1>
                </td>
                <td className="px-12 py-4 text-sm font-medium text-right">
                  <a
                    href={`https://on.mintpad.co/${collection.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-2 cursor-pointer button-gradient rounded-full text-white"
                  >
                    MINT
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
