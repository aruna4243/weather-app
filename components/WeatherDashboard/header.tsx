"use client";
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function Header() {
   const { setTheme, resolvedTheme } = useTheme();
  return (
    <div className={`px-2 `}>

   
    <header className={` w-full ${resolvedTheme === 'dark' ? 'bg-[#424242] text-[#f5f5f5] border-none' : 'bg-[#ECEFF1]  text-black '}  p-4 rounded-none md:rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6`}>
      <Image src="/logo.svg" alt="User" width={100} height={80} />
      <h2 className="text-3xl font-semibold">Weather Forecast App</h2>
      <div className="flex items-center gap-4">
        <p className='font-bold text-lg'>Welcome User!</p>
        <button
           onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className= {`p-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-[#212121]' : 'bg-white'}`}
          aria-label="Toggle Dark Mode"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button>
      </div>
    </header>
    </div>
  );
}
