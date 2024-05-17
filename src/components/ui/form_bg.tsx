import React from 'react';

const FormBg = () => {
  return (
    <div className="hidden md:flex md:fixed md:inset-0 md:h-screen md:flex-row">
      <div className="bg-dark_blue w-1/2 h-full"></div>
      <div className="bg-dark_gray w-1/2 h-full"></div>
    </div>
  );
};

export { FormBg };