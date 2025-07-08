"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const TopModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  // offer modal that shows on the homepage after 1 hour of last visit
  // This modal will be shown only on the homepage and will not be shown again for 1 hour after it is closed
  // It will be shown only once per hour
  useEffect(() => {
    if (pathname === "/") {
      const modalLastShown = localStorage.getItem("topModalLastShown");

      const now = new Date().getTime();

      if (!modalLastShown) {
        // Never shown before
        setIsVisible(true);
        localStorage.setItem("topModalLastShown", now.toString());
      } else {
        const lastShownTime = parseInt(modalLastShown, 10);

        // Check if 1 hour has passed
        const oneHour = 60 * 60 * 1000;
        // const oneHour = 10 * 1000;
        if (now - lastShownTime >= oneHour) {
          setIsVisible(true);
          localStorage.setItem("topModalLastShown", now.toString());
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // or 50000ms as you had before
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 cursor-pointer flex justify-center items-center z-50">
      <div className="relative flex items-start mt-10">
        {/* Modal */}
        <div className="bg-brand rounded-lg shadow-lg max-w-md w-[400px] h-auto overflow-hidden">
          <Image
            width={400}
            height={400}
            src={"/assets/offer-1.jpeg"}
            alt="Promo 4"
          />
        </div>

        {/* Close Button */}
        <button
          className="ml-2 mt-1 bg-white text-orange-500 font-bold rounded-full h-6 w-6"
          onClick={() => setIsVisible(false)}
        >
          <span className="text-center animate-pulse">X</span>
        </button>
      </div>
    </div>
  );
};

export default TopModal;
