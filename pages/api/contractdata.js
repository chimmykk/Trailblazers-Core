import axios from 'axios';
import { ethers } from 'ethers';

// This is used to display the collection
const ipfsToIpfsIo = (ipfsUri) => ipfsUri.replace('ipfs://', 'https://ipfs.io/ipfs/');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Fetch collections from the API
        const collectionResponse = await axios.get('https://app.mintpad.co/api/gettaikocollection');
        const collections = collectionResponse.data;

        if (!Array.isArray(collections) || collections.length === 0) {
            return res.status(404).json({ message: 'No collections found' });
        }

        const abi = [
            'function name() view returns (string)',
            'function tokenURI(uint256 tokenId) view returns (string)'
        ];
        const erc1155Abi = [
            'function uri(uint256 id) view returns (string)',
            'function name() view returns (string)'
        ];
        const provider = new ethers.JsonRpcProvider('https://rpc.mainnet.taiko.xyz');

        const fetchDataForAddress = async (address) => {
            try {
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
                    tokenURI,
                    imageUri
                };
            } catch (error) {
                console.error(`Error fetching data for contract address ${address}:`, error);
                return null;
            }
        };

        const fetchErc1155DataFallback = async (address) => {
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
                console.error(`Error fetching ERC1155 data for address ${address}:`, error);
                return {
                    contractAddress: address,
                    name: 'Unknown',
                    tokenURI: null,
                    imageUri: null
                };
            }
        };

        const results = await Promise.all(
            collections.map(async (collection) => {
                const data = await fetchDataForAddress(collection.address);
                if (!data || !data.name || !data.tokenURI) {
                    console.warn(`Fallback fetch for address ${collection.address}`);
                    return await fetchErc1155DataFallback(collection.address);
                }
                return data;
            })
        );

        const successfulResults = results.filter(result => result && result.name && result.tokenURI);

        res.json(successfulResults);
    } catch (error) {
        console.error('Error fetching contract data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
