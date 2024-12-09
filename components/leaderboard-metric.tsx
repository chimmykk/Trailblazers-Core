import { useState, useEffect, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";


interface LeaderboardData {
  rank: number;
  wallet: string;
  username: string;
  rankScore: number;
  nfts: string;
  labels?: string[];
  avatar?: string;
  opensea?: string;
  twitter?: string;
  blockscan?: string;
  profile?: {
    data?: string;
  };
  activity: string;
}

export default function LeaderboardMetrics({ selectedFilter, searchTerm }: { selectedFilter: string; searchTerm: string }) {
  const [data, setData] = useState<LeaderboardData[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = '';
        switch (selectedFilter) {
          case "Top 721 Collection by Unique Transactions":
          case "Top 1155 Collections by Unique Transactions":
            apiUrl = 'http://localhost:3000/api/getdetails';
            break;
          default:
            throw new Error('Invalid filter selected');
        }

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        const modifiedData = result.map((item: LeaderboardData) => {
          if (item.profile && item.profile.data) {
            const asciiValues = item.profile.data;
            const buffer = Buffer.from(asciiValues, 'base64'); 
            const decodedString = buffer.toString('utf-8'); 

            console.log('Decoded String:', decodedString); 

            return {
              ...item,
              profile: {
                ...item.profile,
                data: decodedString 
              },
              labels: Array.isArray(item.labels) ? item.labels : [item.labels] // Convert string labels to an array
            };
          }
          return {
            ...item,
            labels: Array.isArray(item.labels) ? item.labels : [item.labels] // Convert string labels to an array
          };
        });
        setData(modifiedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter]);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    setFilteredData(
      data.filter(item =>
        (item.username?.toLowerCase().includes(lowercasedSearchTerm) ||
         item.wallet?.toLowerCase().includes(lowercasedSearchTerm))
      )
    );
  }, [data, searchTerm]);

  const getValueOrDefault = (value: string | undefined, defaultValue: string = 'Not Available') => {
    return value || defaultValue;
  };

  const getColor = (label: string) => {
    // Dummy function; replace with actual implementation if needed
    return 'text-green-500';
  };

  return (
    <main className="min-h-screen my-8">
      <div className="overflow-x-auto">
        {loading && <p className="text-center text-sm font-medium text-[#717A8C]">Loading...</p>}
        {error && <p className="text-center text-sm font-medium text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full">
            <thead className="bg-[#252B36] text-[#717A8C] text-sm">
              <tr>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">#</th>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">Username/Wallet</th>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">Rank</th>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">Labels</th>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">NFTs Minted</th>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">Activity</th>
                <th scope="col" className="px-2 py-3 text-left tracking-wider">Contacts</th>
              </tr>
            </thead>
            <tbody className="bg-[#252B36]">
              {filteredData.length > 0 ? filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="px-2 py-4 whitespace-nowrap text-[#717A8C] text-sm font-medium">{item.rank}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      {item.profile && item.profile.data ? (
                        <Image src={`${item.profile.data}`} height={35} width={35} alt="avatar" />
                      ) : (
                        <Image src={`${item.avatar}`} height={35} width={35} alt="avatar" />
                      )}
                      <Link href={`/p/${item.wallet}`}>
                        {getValueOrDefault(item.username || item.wallet)}
                      </Link>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                    <h1 className="border w-fit py-1 px-2 rounded-xl border-[#32D74B] text-[#32D74B] font-medium bg-[#274539]">
                      {item.rankScore}
                    </h1>
                  </td>
                  <td className="px-2 py-4 w-[300px] text-sm font-medium">
                    <h1>
                      {(Array.isArray(item.labels) ? item.labels : [item.labels]).map((label, idx) => (
                        <span key={idx}>
                          <span className={`text-xl font-bold mr-1 ${getColor(label ?? '')}`}>·</span>{label}
                        </span>
                      ))}
                    </h1>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                    {getValueOrDefault(item.nfts)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium max-w-[50px]">
                    {item.activity ? (
                      <a href={item.activity} target="_blank" rel="noopener noreferrer">
                        <span>Click here</span>
                      </a>
                    ) : (
                      <span>Not Available</span>
                    )}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium max-w-[50px]">
                    <div>
                      {item.twitter ? (
                        <Link href={`https://twitter.com/${item.twitter}`} target="_blank" rel="noopener noreferrer">
                          <TwitterIcon />
                        </Link>
                      ) : (
                        <span>Not Available</span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-2 py-4 text-center text-sm font-medium text-[#717A8C]">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
