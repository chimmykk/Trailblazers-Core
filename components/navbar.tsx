

'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Briefcase, ChevronDown, MessageSquare, X } from 'lucide-react';

export default function Navbar2() {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [showMenu]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'GET STARTED', href: '#getstarted' },
    { name: 'LEADEROARD', href: '#leaderboard' },
    {name: 'EXPLORE MINTS', href: '#collections'},
    { name: 'FAQ', href: '#faq' },
    { name: 'MY RANK', href: '#leaderboard' },
  ];

  const handleScrollToSection = (event: any, href: string) => {
    // Check if the href is a valid CSS selector (internal section link)
    if (href.startsWith('#')) {
      event.preventDefault();
      const section = document.querySelector(href);
      if (section) {
        const top = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    }
  };

  const isActive = (href: string) => {
    if (href === '#getstarted' && pathname === '/') return true;
    if (href.startsWith('#') && pathname?.includes(href.replace('#', '/'))) return true;
    return pathname === href;
  };

  return (
    <div className={`fixed top-0 left-0 righ-0 w-screen z-50 nav-bg`} style={{ fontFamily: 'Space Grotesk' }}>
      {/* Larger screen navigation */}
      <nav className={` px-2 sm:px-6 lg:px-12 z-50 hidden md:flex py-3 items-center justify-between border-b border-[#292929] ${pathname == '/leaderboard' || pathname === '/p/sem.eth' ? 'bg-[#252B36] border-b border-[#303030]' : ''}`}>
      <Link href={'/'} className='z-50'>
        <Image src={'/logo.svg'} width={100} height={100} alt='logo' className=' cursor-pointer z-50'/>
      </Link>
        <div className={`items-center p-2 z-50 rounded-full text-white text-sm space-x-10 hidden md:flex md:space-x-10 lg:space-x-20`}> 
        {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              onClick={(e) => handleScrollToSection(e, item.href)} 
              className={`cursor-pointer ${item.name === 'EXPLORE MINTS' ? 'text-gradient' : isActive(item.href) ? 'text-white' : 'text-gray-500'}`}>

              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-3 text-white z-50 items-center">
          <button className='px-8 py-2 cursor-pointer button-gradient rounded-full'>
            <Link href='https://app.mintpad.co/register' target='_blank' rel='noopener noreferrer'>
              CREATE NOW
            </Link>
          </button>
        </div>
      </nav>

      {/* Smaller screens navigation */}
      <nav style={{ backdropFilter: 'blur(6.7px)' }} className="shadow-md z-50 flex w-full md:hidden justify-between items-center sticky py-4 top-0 px-4">
  <div className="flex-1 flex justify-center">
    <Link href={'/'}>
      <Image src={'/logo.svg'} width={150} height={100} alt='logo' className='cursor-pointer' />
    </Link>
  </div>
  <div onClick={() => setShowMenu(true)} className="p-1">
    {/* Hamburger Icon */}
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  </div>
</nav>


      {showMenu && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex">
          <div style={{ backdropFilter: 'blur(5.7px)' }} className=" bg-opacity-60 absolute top-0 left-0 right-0 bottom-0"></div>
          <button onClick={() => setShowMenu(false)} className="absolute top-4 right-4 rounded-full p-1 bg-white duration-300 text-black hover:bg-[#bebcbc]">
            <X size={23} />
          </button>
          <div className="bg-[#282828] rounded-lg p-4 text-white text-[20px] w-full mx-4 mt-14 z-10 h-fit">
            {navItems.map((item, index) => (
              <Link key={index} className="block py-4 border-b border-[#474747] text-sm" onClick={() => {handleScrollToSection(event, item.href); setShowMenu(false)}} href={item.href}>
                {item.name}
              </Link>
            ))}
            <div className="text-center py-3">
              <button
                className="text-white button-gradient  text-sm py-2  px-6 w-full rounded-lg hover:brightness-110"
              >
                CREATE NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
