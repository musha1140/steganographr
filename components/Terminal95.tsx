import React, { useState, useEffect } from 'react';

interface Terminal95Props {
  text: string;
  typingSpeed?: number;
}

export function Terminal95({ text, typingSpeed = 50 }: Terminal95Props) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [text, typingSpeed]);

  return (
    <div className="bg-[#008080] p-1 rounded-sm shadow-md">
      <div className="bg-[#c0c0c0] p-1 flex justify-between items-center">
        <span className="text-black font-bold text-sm">Terminal</span>
        <div className="flex space-x-1">
          <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-gray-700"></button>
          <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-gray-700"></button>
          <button className="w-4 h-4 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-gray-700 font-bold text-xs flex items-center justify-center">x</button>
        </div>
      </div>
      <div className="bg-black p-2 font-mono text-green-500 whitespace-pre-wrap">
        {displayedText}
        <span className="animate-blink">_</span>
      </div>
    </div>
  );
}

