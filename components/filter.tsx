import { ChevronDown, ChevronUp, ListFilter } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Filter({ setSelectedFilter }: { setSelectedFilter: (filter: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const handleSelect = (filter: string) => {
      setSelectedFilter(filter);
      setIsOpen(false);
    };
  
    return (
      <div className="relative" ref={ref}>
        <div
          className="flex w-fit items-center bg-[#333945] rounded-md py-2.5 px-4 shadow-sm cursor-pointer hover:bg-[#3c4151]"
          onClick={toggleDropdown}
        >
          <ListFilter className="h-5 w-5  text-[#717A8C]" />
          <span className="text-[#fff] ml-20">Filter</span>
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
          <div className="absolute mt-2 bg-[#333945] text-white rounded-md shadow-lg lg:w-[220%] py-2 px-4 max-h-60 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-base font-light border-b border-[#636363] text-gray-400 pb-2">Creators</h3>
              <ul className="space-y-2">
                <li
                  className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleSelect("Top 721 Collection by Unique Transactions")}
                >
                  Top 721 Collection by Unique Transactions
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleSelect("Top 1155 Collections by Unique Transactions")}
                >
                  Top 1155 Collections by Unique Transactions
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleSelect("Top Creator Overall with most Unique Transactions")}
                >
                  Top Creator Overall with most Unique Transactions
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleSelect("Top Collection by Unique Holders")}
                >
                  Top Collection by Unique Holders
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-light text-gray-400 border-b border-[#636363] pb-2">Collectors</h3>
              <ul className="space-y-2">
                <li
                  className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleSelect("Top Collectors with most Unique Transactions")}
                >
                  Top Collectors with most Unique Transactions
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }