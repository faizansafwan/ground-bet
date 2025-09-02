"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const fullText = "Al Azhar College Sports Complex";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100); // adjust typing speed here
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide text-gray-800 cursor-pointer">
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-600 to-red-800 bg-clip-text text-transparent">
            {displayedText}
          </span>
        </h1>
      </div>
    </header>
  );
}
