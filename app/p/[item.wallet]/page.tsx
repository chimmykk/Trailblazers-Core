"use client"
import { FormEvent, SetStateAction, useEffect, useState } from 'react';
import { FaTwitter } from 'react-icons/fa';
import Image from 'next/image';
import Web3 from 'web3';
import axios from 'axios';

export default function UpdateProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateField, setUpdateField] = useState('');
    const [twitter, setTwitter] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('/avatar-example.svg');
    const [valueAfterP, setValueAfterP] = useState('');
    const [finalVersion, setFinalVersion] = useState('');
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [username, setUsername] = useState('');
    const [categories, setCategories] = useState('');
    const [isSigned, setIsSigned] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string>('');

    // State to hold NFTs data
    const [nftsData, setNftsData] = useState<any[]>([]);

    useEffect(() => {
        const currentUrl = window.location.href;
        const index = currentUrl.indexOf('p/');
    
        if (index !== -1) {
            const extractedValue = currentUrl.substring(index + 2); // Extract after 'p/'
            const valueWithoutP = extractedValue.replace(/^p\//, ''); // Remove the 'p/' prefix if it exists
            setValueAfterP(valueWithoutP);
    
            if (valueWithoutP.length > 15) {
                const firstFour = valueWithoutP.substring(0, 4);
                const lastFive = valueWithoutP.substring(valueWithoutP.length - 5);
                setFinalVersion(`${firstFour}...${lastFive}`);
            } else {
                setFinalVersion(valueWithoutP);
            }
        }
    }, []);
    

    useEffect(() => {
        if (valueAfterP) {
            fetchNFTsData(valueAfterP);
        }
    }, [valueAfterP]);

    console.log(valueAfterP);
    let first4 = valueAfterP.substring(0, 4);
let last5 = valueAfterP.substring(valueAfterP.length - 5);

let result = first4 + '...' + last5;

console.log(result);
    // Fetch NFTs data from API
    async function fetchNFTsData(valueAfterP: string) {
        try {
            const response = await axios.get(`/api/totalmint/${valueAfterP}`);
            const data = response.data;
            console.log(data);

            // Update state with fetched nftsData
            setNftsData(data.nfts);

            console.log('NFTs Data:', data.nfts);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    }

    const handleOpenModal = (field: SetStateAction<string>) => {
        setUpdateField(field);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formElements = form.elements as typeof form.elements & {
            updateInput: HTMLInputElement;
        };
        const updatedValue = formElements.updateInput.value;
    
        if (updateField === 'twitter') setTwitter(updatedValue);
        if (updateField === 'bio') setBio(updatedValue);
        if (updateField === 'username') setUsername(updatedValue);
        if (updateField === 'profilePicture') {
            setProfilePicture(updatedValue);
            console.log('Base64 Image:', base64Image);
        }
        if (updateField === 'categories') setCategories(updatedValue);
    
        handleCloseModal();
        await handleSaveDetails();
    };
    

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const maxSizeInBytes = 50 * 1024; // 50 Kb limit

        if (file) {
            // Check file size
            if (file.size > maxSizeInBytes) {
                alert('File size exceeds the limit of 50 Kb. Please choose a smaller file.');
                event.target.value = '';
                return;
            }

            setSelectedFile(file);
            const base64 = await getBase64FromFile(file);
            setBase64Image(base64);
            setProfilePicture(base64);
            console.log('Base64 Image:', base64);
        }
    };

    const getBase64FromFile = async (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result as string;
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const connectWallet = async () => {
        if ((window as any).ethereum) {
            const web3 = new Web3((window as any).ethereum);
            try {
                await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                const address = accounts[0];
                setWalletAddress(address);
                setWeb3(web3);
                setIsWalletConnected(true);
            } catch (error) {
                console.error('Failed to connect wallet:', error);
            }
        } else {
            console.error('Please install MetaMask or another Ethereum-compatible wallet');
        }
    };

    const handleSignMessage = async () => {
        // Ensure web3 is available
        if (!web3) {
            console.error("web3 is not initialized");
            return;
        }
    
        // Define the message to be signed
        const message = 'hello test';
    
        // Ensure walletAddress is valid
        if (!walletAddress) {
            console.error("walletAddress is null or undefined");
            alert('Wallet address is not available. Please connect your wallet.');
            return;
        }
    
        try {
            // Attempt to sign the message
            const signature = await web3.eth.personal.sign(message, walletAddress, '');
            console.log('Signature:', signature);
            setIsSigned(true);
            alert('Message signed successfully!');
        } catch (error) {
            // Handle any errors that occur during the signing process
            console.error('Error signing message:', error);
            alert(`Error signing message:`);
        }
    };
    
    const handleSaveDetails = async () => {
        if (!isSigned) {
            alert('Please sign the message first!');
            return;
        }

        try {
            const response = await axios.post('/api/taikocampaign', {
                profilepic: base64Image,
                categories,
                twitter: `https://x.com/${twitter}`, // Suffixing twitter with https://x.com/
                username,
                bio,
                address: valueAfterP,
                opensea: `https://opensea.com/${valueAfterP}`,
                ens: valueAfterP,
                blockscan: `https://blockscan.com/address/${valueAfterP}`,
                
            
            });

            if (response.status === 200) {
                alert('Details saved successfully!');
            } else {
                alert(`Failed to save details: ${response.data.error}`);
            }
        } catch (error) {
            console.error('Error saving details:', error);
            alert('Failed to save details.');
        }
    };

    return (
        <div className='bg-[#252B36] min-h-screen'>
            <div className="flex flex-col lg:flex-row items-center py-40 justify-between lg:justify-center gap-12 lg:gap-64 px-16 lg:px-24">
                {/* Left Section */}
                <div className="flex h-fit items-center">
                    <Image
                        src={profilePicture}
                        alt="Profile"
                        width={200}
                        height={200}
                        className="rounded-full border mr-4"
                    />
                    <div>
                    <h2 className="text-4xl font-bold my-4">
  {result}
</h2>
                        <p className="text-gray-300">{bio}</p>
                        <br></br>
                        <div className="mt-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="profilePictureInput"
                            />
                            <label
                                htmlFor="profilePictureInput"
                                className="bg-[#333945] text-white px-4 py-2 rounded mt-2 cursor-pointer"
                            >
                                Update Profile Picture
                            </label>
                        </div>
                        <button
                            className="bg-[#333945] text-white px-4 py-2 rounded mt-2 cursor-pointer"
                            onClick={() => handleOpenModal('username')}
                        >
                            {username || 'Update Username'}
                        </button>
                        <br></br>
                
                    </div>
                </div>

                {/* Right Section */}
                <div className="text-center">
                    <div className="text-4xl border w-fit px-8 py-4 rounded-2xl text-black bg-white font-semibold">
                        {nftsData}
                        <span className="text-lg text-gray-500 block">
                            NFTs Minted
                        </span>
                    </div>
                    {/* Category Textbox */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center bg-[#333945] text-[#fff] w-fit px-4 py-2 rounded-xl justify-between">
                            <span className="text-lg text-white font-semibold">Categories:</span>
                            <input
                                type="text"
                                className="ml-91 p-2 bg-[#333945] text-white border-none"
                                value={categories}
                                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setCategories(e.target.value)}
                                placeholder="Eg: Artist, Investor"
                            />
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                className="bg-[#333945] text-white px-4 py-2 rounded mt-2 cursor-pointer"
                                onClick={() => handleOpenModal('twitter')}
                            >
                                <FaTwitter className="inline mr-2 w-36" />
                              
                                {twitter}
                            </button>
                           
                         
                        </div>
                   

                        {/* Conditionally render wallet buttons */}
                        {!isWalletConnected && (
                            <button
                                className="bg-[#333945] text-white px-4 py-2 rounded mt-2 cursor-pointer"
                                onClick={connectWallet}
                            >
                                Connect Wallet
                            </button>
                            
                        )}
                       <br></br>
                        {isWalletConnected && !isSigned && (
                            <button
                                className="bg-[#333945] text-white px-4 py-2 rounded mt-2 cursor-pointer"
                                onClick={handleSignMessage}
                            >
                                Sign Wallet
                            </button>
                        )}
                        <button
                            className="bg-[#333945] text-white px-4 py-2 rounded mt-2 cursor-pointer"
                            onClick={handleSaveDetails}
                        >
                            Save Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#333945] p-8 rounded-xl w-96">
            <h2 className="text-2xl font-semibold mb-4">Update {updateField}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(e);
                }}
            >
                <input
                    type="text"
                    name="updateInput"
                    className="w-full rounded-md border border-[#505050] hover:bg-[#3c4151] bg-[#333945] focus:outline-none focus:border-transparent placeholder:text-[#717A8C] placeholder:text-base py-2.5 px-10 shadow-sm sm:text-sm"
                    defaultValue={(() => {
                        switch (updateField) {
                            case 'twitter':
                                return twitter;
                            case 'bio':
                                return bio;
                            case 'username':
                                return username;
                            case 'profilePicture':
                                return profilePicture;
                            case 'categories':
                                return categories;
                            default:
                                return '';
                        }
                    })()}
                />
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleCloseModal}
                        className="bg-gray-300 px-4 py-2 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

