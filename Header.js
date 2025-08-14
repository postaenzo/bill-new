import React, { useContext } from "react";
import { AppState } from "../App";
import { TailSpin } from 'react-loader-spinner';
import { Link } from "react-router-dom";

const Header = () => {
    const useAppState = useContext(AppState);

  return (
    <header className="sticky top-0 w-full z-50">
      <nav className="bg-white border-gray-200 shadow-md py-2.5 dark:bg-[#181a1e]">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <Link to={'/'} className="flex items-center">
            <img
              src="logo.png"
              className="h-16 mr-3"
              alt="Billionaire"
            />
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
              {/* <span className="text-[#FFE900]">BNB</span>Ride */}
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
              {
                useAppState.loading
                ? 
                  <div className="w-full flex justify-center">
                      <TailSpin height={32} />
                  </div>
                : 
                  <button
                    onClick={() => useAppState.disconnectwallet()}
                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none dark:focus:ring-red-400"
                  >
                    Disconnect
                  </button>
              }
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
