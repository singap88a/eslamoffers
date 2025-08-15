"use client";
import React, { useEffect, useState } from "react";

const getTimeLeft = () => {
  const now = new Date();
  const nextReset = new Date();
  nextReset.setHours(0, 0, 0, 0);
  if (now >= nextReset) {
    nextReset.setDate(nextReset.getDate() + 1);
  }
  const diff = nextReset - now;
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds };
};

const CountdownOfferBox = () => {
  // Initialize with empty values to prevent hydration mismatch
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set initial time and mark as client-side rendered
    setTimeLeft(getTimeLeft());
    setIsClient(true);
    
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg   mx-auto" style={{background: 'linear-gradient(135deg, #14b8a6 30%, #fff 70%)'}}>
      <div className="p-4">
        <div className="text-white text-xl font-bold text-center mb-4">اغتنم العرض قبل</div>
        <div className="flex justify-center gap-3 mb-6">
          <div className="bg-black rounded-xl flex flex-col items-center justify-center w-24 h-24">
            <span className="text-4xl font-bold text-white">{isClient ? String(timeLeft.hours).padStart(2, '0') : "00"}</span>
            <span className="text-lg text-white mt-1">ساعة</span>
          </div>
          <div className="bg-black rounded-xl flex flex-col items-center justify-center w-24 h-24">
            <span className="text-4xl font-bold text-white">{isClient ? String(timeLeft.minutes).padStart(2, '0') : "00"}</span>
            <span className="text-lg text-white mt-1">دقيقة</span>
          </div>
          <div className="bg-black rounded-xl flex flex-col items-center justify-center w-24 h-24">
            <span className="text-4xl font-bold text-white">{isClient ? String(timeLeft.seconds).padStart(2, '0') : "00"}</span>
            <span className="text-lg text-white mt-1">ثانية</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img src="/logo4.png" alt="Eslam Offers Logo" className="w-58 mb-2" />
      
        </div>
      </div>
    </div>
  );
};

export default CountdownOfferBox;