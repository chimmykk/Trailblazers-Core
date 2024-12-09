"use client"

import { Star } from "lucide-react";
import Image from "next/image";

const sellers = [
    { id: 1, username: "@dicar", amount: "$232,102", imgSrc: '/seller-example.svg' },
    { id: 2, username: "@john", amount: "$150,000", imgSrc: '/seller-example2.svg' },
    { id: 3, username: "@jane", amount: "$120,500", imgSrc: '/seller-example3.svg' },
    { id: 1, username: "@dicar", amount: "$232,102", imgSrc: '/seller-example.svg' },
    { id: 2, username: "@john", amount: "$150,000", imgSrc: '/seller-example2.svg' },
    { id: 3, username: "@jane", amount: "$120,500", imgSrc: '/seller-example3.svg' },
    { id: 1, username: "@dicar", amount: "$232,102", imgSrc: '/seller-example.svg' },
    { id: 2, username: "@john", amount: "$150,000", imgSrc: '/seller-example2.svg' },
    { id: 3, username: "@jane", amount: "$120,500", imgSrc: '/seller-example3.svg' },
    { id: 1, username: "@dicar", amount: "$232,102", imgSrc: '/seller-example.svg' },
    { id: 2, username: "@john", amount: "$150,000", imgSrc: '/seller-example2.svg' },
    { id: 3, username: "@jane", amount: "$120,500", imgSrc: '/seller-example3.svg' },
    { id: 1, username: "@dicar", amount: "$232,102", imgSrc: '/seller-example.svg' },
    { id: 2, username: "@john", amount: "$150,000", imgSrc: '/seller-example2.svg' },
    { id: 3, username: "@jane", amount: "$120,500", imgSrc: '/seller-example3.svg' },
    // Add more sellers as needed
];

export default function TopSellers() {
    return (
        <main className="pb-16 px-12 xl:px-40">
            <div>
                <div className="flex items-center mb-4 z-50 gap-2">
                    <Star fill="gold" color="gold" className="border-none" />
                    <h1 className="text-2xl text-[#5FC59D]">Top Sellers</h1>
                </div>
                <div className="custom-scrollbar overflow-x-auto pb-6">
                    <div className="flex gap-24 items-center">
                        {sellers.map((seller) => (
                            <div key={seller.id} className="flex gap-4 items-center">
                                <Image src={seller.imgSrc} width={60} height={60} alt="seller" />
                                <div>
                                    <h1 className="flex items-center gap-1">
                                        {seller.username}
                                        <Image src={'/icon-verified.svg'} width={15} height={15} alt="verified" />
                                    </h1>
                                    <p className="text-xs text-[#5FC59D]">{seller.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #53BFD9; /* cyan color for the thumb */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background-color: #161A42; /* dark cyan color for the track */
                }
            `}</style>
        </main>
    )
}