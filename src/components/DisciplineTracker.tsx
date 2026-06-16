import React, { useState, useEffect } from 'react';
import { Trophy, Octagon } from 'lucide-react';
import { cn } from '../lib/utils';

export function DisciplineTracker() {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [isBusted, setIsBusted] = useState(false);

  useEffect(() => {
    // Check local storage and reset if it's a new day or lock expired
    const checkState = () => {
      const now = Date.now();
      const storedLockTime = localStorage.getItem('disciplineLockTime');

      if (storedLockTime) {
        const lockValue = parseInt(storedLockTime, 10);
        // Check if 6 hours (6 * 60 * 60 * 1000 ms) have passed
        if (now - lockValue >= 6 * 60 * 60 * 1000) {
          localStorage.removeItem('disciplineLockTime');
          localStorage.setItem('disciplineLosses', '0');
          // Reset losses to 0 after 6 hours to unlock
          setLosses(0);
          setIsBusted(false);
        } else {
          setIsBusted(true);
        }
      } else {
        setIsBusted(false);
      }

      const today = new Date().toLocaleDateString();
      const storedDate = localStorage.getItem('disciplineDate');
      
      if (storedDate !== today) {
        localStorage.setItem('disciplineDate', today);
        // Only reset daily stats if we are not currently locked out
        if (!localStorage.getItem('disciplineLockTime')) {
          localStorage.setItem('disciplineWins', '0');
          localStorage.setItem('disciplineLosses', '0');
          setWins(0);
          setLosses(0);
        } else {
          setWins(Number(localStorage.getItem('disciplineWins')) || 0);
          setLosses(Number(localStorage.getItem('disciplineLosses')) || 0);
        }
      } else {
        setWins(Number(localStorage.getItem('disciplineWins')) || 0);
        setLosses(Number(localStorage.getItem('disciplineLosses')) || 0);
      }
    };

    checkState();
    
    // Check periodically in case page is left open
    const interval = setInterval(checkState, 10000); // Check every 10 seconds for faster unlock detection
    return () => clearInterval(interval);
  }, []);

  const handleWin = () => {
    const newWins = wins + 1;
    setWins(newWins);
    localStorage.setItem('disciplineWins', newWins.toString());
  };

  const handleLoss = () => {
    const newLosses = losses + 1;
    setLosses(newLosses);
    localStorage.setItem('disciplineLosses', newLosses.toString());
    
    if (newLosses >= 2) {
      const now = Date.now();
      localStorage.setItem('disciplineLockTime', now.toString());
      setIsBusted(true);
    }
  };

  // Render the component
  return (
    <>
      <div className="p-3 shrink-0 border-t border-neutral-800 bg-[#0a0a0a]">
        <div className="border border-neutral-700/50 rounded-lg p-4 shadow-sm bg-neutral-900">
          <div className="text-sm font-semibold text-neutral-200 mb-3 text-center">
            Manual Discipline Tracker
          </div>
          
          <div className="text-[13px] font-medium text-neutral-400 text-center mb-4">
            Daily Log | Wins: {wins} &nbsp; Losses: {losses}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleWin}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium py-2 rounded transition-colors border border-green-500/20"
            >
              +1 Win
            </button>
            <button 
              onClick={handleLoss}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium py-2 rounded transition-colors border border-red-500/20"
            >
              +1 Loss
            </button>
          </div>
        </div>
      </div>

      {isBusted && (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center p-8">
          <div className="max-w-3xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-red-600 mb-8 leading-[1.4] tracking-wide shadow-black drop-shadow-lg break-words whitespace-pre-wrap">
              ምህረቱ ዛሬ 2 ጊዜ ተሸንፈሃል፥ ያሳለፍከውን አስብ፥ ህግህን አክብር፥ እናትህ ያንተን ስኬት እየጠበቀች ነው! እስከ ነገ ፌታ በል፥ እስከ ነገ ወደ ቻርቱ አትመለስ፥ የግድ አንተ ስኬታማ ለመሆን ይሄንን ህግ ማክበር አለብህ! ቻርቱ ነገ ጠዋት 12 ሰዓት ላይ ይከፈታል።
            </h1>
          </div>
        </div>
      )}
    </>
  );
}
