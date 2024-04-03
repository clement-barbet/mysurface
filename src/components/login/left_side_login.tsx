import React from 'react';

const LeftSideLogin = () => {
  return (
    <div className="bg-mid_blue w-full md:w-1/2 h-full flex flex-column items-center justify-center py-10 md:py-0">
      <div className="rounded-lg w-4/5">
        <img src="/logo.svg" alt="mysurface_logo" className="mx-auto mb-10" id="logo" />
        <h1 className="text-6xl text-light_gray font-fjalla text-center mb-5">MySurface</h1>
        <hr className="w-1/2 mx-auto mb-5 border-2 border-light_gray" />
        <p className="text-light_gray font-glory text-center font-light text-xl w-4/5 lg:w-3/5 mx-auto">
          Connect, Collaborate, Visualize: Your Team, Your Surface.
        </p>
      </div>
    </div>
  );
};

export { LeftSideLogin };