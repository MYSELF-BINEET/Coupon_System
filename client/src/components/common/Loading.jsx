import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 w-24 h-24 bg-blue-400 rounded-full opacity-30 blur-md"></div>
        {/* Multiple spinning rings */}
        <div className="w-20 h-20 border-4 rounded-full animate-spin border-t-blue-600 border-r-transparent border-b-indigo-600 border-l-transparent"></div>
        <div 
          className="absolute inset-0 w-20 h-20 border-4 rounded-full animate-spin border-t-transparent border-r-indigo-500 border-b-transparent border-l-blue-500" 
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
      </div>
    </div>
  );
};

export default Loading;