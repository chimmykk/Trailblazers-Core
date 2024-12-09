import { ethers } from 'ethers';
import axios from 'axios';

const erc721Abi = [
  'function name() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)'
];

const erc1155Abi = [
  'function uri(uint256 id) view returns (string)',
  'function name() view returns (string)'
];

const provider = new ethers.JsonRpcProvider('https://rpc.mainnet.taiko.xyz');

// Helper function to convert IPFS URL
const ipfsToIpfsIo = (url) => url.replace('ipfs://', 'https://ipfs.io/ipfs/');

// Fetch ERC721 data
const fetchErc721Data = async (address) => {
  try {
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
const fetchErc1155Data = async (address) => {
  try {
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
const fetchDataForAddress = async (address) => {
  let data = await fetchErc721Data(address);
  if (!data) {
    data = await fetchErc1155Data(address);
  }
  return data;
};

// API handler function
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET method
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  try {
    // Fetch addresses and permalinks from /api/fetchhouse
    const houseResponse = await fetch('https://app.mintpad.co/api/topcollection');
    if (!houseResponse.ok) {
      throw new Error(`Error fetching house data: ${houseResponse.statusText}`);
    }
    const houseData = await houseResponse.json();

    // Fetch ERC721/ERC1155 data for each house address
    const collectionData = await Promise.all(
      houseData.map(async (item) => {
        const contractData = await fetchDataForAddress(item.house);
        if (contractData) {
          return {
            ...contractData,
            totalmint: item.total_mint, // Use total_mint from the API response
            rank: item.rank // Use rank from the API response
          };
        }
        return null;
      })
    );

    // Filter out null values and sort by totalmint in descending order
    const sortedCollectionData = collectionData.filter(data => data !== null)
      .sort((a, b) => b.totalmint - a.totalmint);

    // Assign ranks based on sorted order
    const rankedCollectionData = sortedCollectionData.map((data, index) => ({
      ...data,
      rank: index + 1
    }));

    res.status(200).json(rankedCollectionData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
