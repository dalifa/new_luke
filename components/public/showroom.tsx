"use client"
import { useEffect } from 'react';
import { LogGoogleButton } from '../auth/log-google-button';
import TypewriterComponent from 'typewriter-effect'
import Link from 'next/link';
import { Button } from '../ui/button';
import { Telescope } from 'lucide-react';

const Showroom = () => {
  useEffect(() => {
    const slogan1 = document.getElementById('slogan1');
      if (slogan1) {
        setTimeout(() => {
          slogan1.classList.remove('opacity-0');
        }, 3000);
      }
      const slogan2 = document.getElementById('slogan2');
        if (slogan2) {
          setTimeout(() => {
            slogan2.classList.remove('opacity-0');
          }, 4000); 
      }
      const slogan3 = document.getElementById('slogan3');
        if (slogan3) {
          setTimeout(() => {
            slogan3.classList.remove('opacity-0');
          }, 5000);
      }
  }, []);

  return (
    <div className="flex-col bg-blue-500 flex items-center justify-center min-h-screen text-white text-center">
      <div className='min-w-96'>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="mt-5 transition-opacity duration-1000 opacity-0" id="slogan1">
            <p className="scrolling-text text-3xl md:text-5xl font-black">WE BLESS YOU</p>
            {/* &nbsp; pour mettre l'espace entre 2 mots */}
          </div>
        </div>
        <div className='grid grid-cols-1 mt-14'>
          <span className="text-xl md:text-2xl">
            <TypewriterComponent
              options={{
              strings: [
              "Donnez aux autres",
              "et Dieu vous donnera",
              "( à travers les autres ) Luc 6:38"
            ],
            autoStart: true,
            loop: true,
            deleteSpeed: 100,
            delay:100
          }}
          />
          </span>
        </div>
        <div className='px-3 mt-16 transition-opacity duration-1000 opacity-0' id="slogan2">
          <div className='px-10'>
            <Link href={"/ccm"}>
            <Button size="lg"
              className="w-full border-2 text-blue-500 bg-white hover:bg-blue-300 hover:text-white hover:border-white" 
            >
              <Telescope className="h-5 w-5"/>
              <span className="ml-5 text-lg">Découvrir</span>
            </Button>
            </Link>
          </div>
        </div>
        <div className='px-3 mt-2 transition-opacity duration-1000 opacity-0' id="slogan3">
          <div className='px-10'>
            <LogGoogleButton/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Showroom;
