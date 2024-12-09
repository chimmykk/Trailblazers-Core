"use client"

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp,Columns3, Upload } from "lucide-react";
import LeaderboardMetrics from "@/components/leaderboard-metric";
import Search from "@/components/search";
import Filter from "@/components/filter";

export default function Leaderboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>("Top 721 Collection by Unique Transactions");
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <main className="bg-[#252B36] z-50 px-2 sm:px-6 lg:px-12 py-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Filter setSelectedFilter={setSelectedFilter} />
            {/* <Columns /> */}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-2 cursor-pointer">
            <Upload color="#A2A8B4" />
            <h1>Export</h1>
          </div>
        </div>
      </div>
      <h1 className="my-8 text-sm text-gray-400 font-light">{selectedFilter}</h1>
      {/* metrics */}
      <div>
        <LeaderboardMetrics selectedFilter={selectedFilter} searchTerm={searchTerm} />
      </div>
    </main>
  );
}



function Columns() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        className="flex items-center bg-[#333945] rounded-md py-2.5 px-4 shadow-sm cursor-pointer hover:bg-[#3c4151]"
        onClick={toggleDropdown}
      >
        <Columns3 className="h-5 w-5 text-[#717A8C]" />
        <span className="text-[#fff] ml-2">Columns</span>
        <span
          className={`ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-[#717A8C]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#717A8C]" />
          )}
        </span>
      </div>
      {isOpen && (
        <div className="absolute mt-2 bg-[#333945] text-white rounded-md shadow-lg w-full py-2">
          <ul className="space-y-2">
            <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer">
              Artist
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer">
              Collector
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
