
import { useState } from "react";
import { CirclePlus, CircleX } from "lucide-react";
import Link from "next/link";

const faqItems = [
  {
    question: "How do I earn points?",
    answer: (
      <>
        A user can earn points from being a creator, a collector, or both.
        <br /><br />
        <strong>Example 1:</strong> Charis creates 1 NFT collection and gets 10 unique transactions on her NFT she now has 10 points.
        <br /><br />
        <strong>Example 2:</strong> Woods mints 5 NFTs in 1 transaction and earns 1 point. Points are generated per unique transactions not per NFTs minted.
        <br /><br />
        <strong>Example 3:</strong> John creates 2 NFT collections and gets a total of 20 unique transactions as well as mints 3 NFTs from 3 separate collections. This earns him 23 points.
        <br /><br />
        Points are always generated per transaction, not per mint.
      </>
    ),
  },
  {
    question: "How do I see my ranking?",
    answer: (
      <>
        To see your ranking on the leaderboard please go to the leaderboard section and input your wallet address. You will then see how many points you have and your global ranking.
      </>
    ),
  },
  {
    question: "How do I make NFTs on Mintpad?",
    answer: (
      <>
        To start creating NFTs click the “Create Now” button in the top right corner or go to <Link href="https://mintpad.co" target="_blank" className="text-blue-500">Mintpad.co</Link> and sign up! If you need additional help feel free to reach out in Discord or visit our Docs section - <Link href="https://docs.mintpad.co" target="_blank" className="text-blue-500">https://docs.mintpad.co</Link>
        <br /><br />
        Please make sure you also have Taiko mainnet added to your Metamask wallet.
      </>
    ),
  },
  {
    question: "What wallets are supported?",
    answer: (
      <>
        Metamask is the only wallet we support.
      </>
    ),
  },
  {
    question: "How do I bridge money to Taiko?",
    answer: (
      <>
        Always make sure you use official bridges provided by Taiko. You can refer to that here - <Link href="https://bridge.taiko.xyz" target="_blank" className="text-blue-500">https://bridge.taiko.xyz</Link>
      </>
    ),
  },
  {
    question: "Where do I see my NFTs after I mint them?",
    answer: (
      <>
        To view your NFTs after you have minted them please visit OKX, sign in with the wallet you minted with and you will be able to see your NFTs or edit your collection page. <Link href="https://www.okx.com/web3" target="_blank" className="text-blue-500">https://www.okx.com/web3</Link>
      </>
    ),
  },
  {
    question: "What do the points do?",
    answer: (
  <>
  By earning more points and climbing the leaderboard you will be competing for the Mintpad prize pool. This will be distributed to the top winners. 
      <br />
      Additional prizes from Mintpad partners are being added. 
      <br />
      Please check Discord for the latest updates on prize availability for each ranking.


     
    </>
    
      
    ),
  },
  {
    question: "Is there a transaction fee?",
    answer: (
      <>
        There is a $1 transaction fee for every transaction on Mintpad. This is per transaction not per NFT minted.
      </>
    ),
  },
  {
    question: "Where do I find extra help?",
    answer: (
      <>
        You can visit our Discord - <Link href="https://discord.com/invite/DmRjDSfcxC" target="_blank" className="text-blue-500">https://discord.com/invite/DmRjDSfcxC</Link>
        <br />
        Send us an email - <Link href="mailto:support@mintpad.co" target="_blank" className="text-blue-500">support@mintpad.co</Link>
        <br />
        Refer to our documentation - <Link href="https://docs.mintpad.co" target="_blank" className="text-blue-500">https://docs.mintpad.co</Link>
      </>
    ),
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 px-4 xl:px-40 relative" id="faq">
      <div className="flex flex-col items-center justify-between">
        <div className="text-center w-full">
          <h1 className="text-[#B65DCF] text-5xl font-bold">FAQ</h1>

        </div>
        <div className="w-full mt-8 lg:px-40">
          {faqItems.map((item, index) => (
            <div key={index} className="relative p-[1px] rounded-2xl mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFC876] via-[#79FFF7] to-[#FF98E2] rounded-2xl"></div>
              <div className="relative bg-black rounded-2xl">
                <div
                  className="flex flex-col rounded-2xl p-4 px-8 justify-between  relative cursor-pointer"
                  onClick={() => toggleAnswer(index)}
                >
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-xl font-medium">{item.question}</h1>
                    <p className="text-lg">
                      {openIndex === index ? <CircleX color="gray"/> : <CirclePlus />}
                    </p>
                  </div>
                  <div
                    className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                      openIndex === index ? 'max-h-[500px]' : 'max-h-0'
                    }`}
                  >
                    <div className="px-4 py-4 text-left text-white">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
