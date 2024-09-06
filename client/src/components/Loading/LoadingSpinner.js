import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center h-full z-10 space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    <div className="text-blue-500 font-semibold">Sending Notification</div>
  </div>
);

export default LoadingSpinner;
