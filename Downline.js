import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { AppState } from "../App";

const Teams = () => {
  const useAppState = useContext(AppState);
  const [data, setData] = useState([
    {
      sno: 0,
      id: 0,
      Address: "0",
      started: 0,
      Level: 0,
      Status: "",
      Direct: 0,
      referrer: 0
    },
  ]);
  const [layer, setLayer] = useState(1);

  useEffect(() => {
    async function getData() {
      if (!useAppState.staticContract) {
          useAppState.navigate('/');
          return;
      }
      let _team = await useAppState.staticContract.getMatrixUsers(
        useAppState.id, layer - 1
      );
      //console.log('_team:',_team);
      setData([]);
      for (let i = 0; i < _team.length; i++) {
        let isUserUnblocked = true;
        setData((prev) => [
          ...prev,
          {
            sno: i + 1,
            id: Number(_team[i].id),
            Address: _team[i].account,
            started: Number(_team[i].start),
            Level: Number(_team[i].level),
            Status: isUserUnblocked,
            Direct: Number(_team[i].directTeam),
            referrer: Number(_team[i].referrer)
          },
        ]);
      }
    }
    getData();
  }, [useAppState.walletAddress, useAppState.change, layer]);

  return (
    <>
    <img src='bgimg.png' className='fixed hidden md:block right-0 h-full w-full top-0 z-0 opacity-30' />
    <img src='bgmobimg.png' className='fixed h-full w-full left-0 md:top-0 block md:hidden top-0 z-0  opacity-30' />
    
    <div className="pb-4 text-black dark:text-white transition-colors duration-1000 min-h-screen relative">
      <Header />
      <div className="flex justify-center w-full px-4 mt-6">
        <div className="w-full md:w-3/4">
          <Navigation />
        </div>
      </div>

      <div className="w-full flex justify-center p-4">
        <div className="mt-4 md:w-3/4 w-full">
            <div className='flex overflow-x-auto'>
              <p onClick={() => setLayer(1)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 1 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-0`}>1</p>
              <p onClick={() => setLayer(2)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 2 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>2</p>
              <p onClick={() => setLayer(3)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 3 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>3</p>
              <p onClick={() => setLayer(4)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 4 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>4</p>
              <p onClick={() => setLayer(5)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 5 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>5</p>
              <p onClick={() => setLayer(6)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 6 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>6</p>
              <p onClick={() => setLayer(7)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 7 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>7</p>
              <p onClick={() => setLayer(8)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 8 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>8</p>
              <p onClick={() => setLayer(9)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 9 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>9</p>
              <p onClick={() => setLayer(10)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 10 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>10</p>
              <p onClick={() => setLayer(11)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 11 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>11</p>
              <p onClick={() => setLayer(12)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 12 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>12</p>
              <p onClick={() => setLayer(13)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 13 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>13</p>
              <p onClick={() => setLayer(14)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 14 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>14</p>
              <p onClick={() => setLayer(15)} className={`cursor-pointer font-medium px-4 py-2 rounded-sm ${layer == 15 ? "bg-blue-500" : "bg-gray-700 bg-opacity-45"} ml-2`}>15</p>
            </div>

          <div className="overflow-auto h-[26rem] mt-4 w-full rounded-lg dark:text-white text-gray-800">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-[#8080821a] sticky top-0">
                <tr>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">SNo.</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">ID</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">Address</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">Sponser ID</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">Activation Date</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">Level</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">Direct Team</th>
                </tr>
              </thead>
              <tbody>
              {data.map((e, i) => {
                return (
                  <tr key={i} className="">
                    <td className="text-center justify-center border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] py-3 px-2">
                        {e.sno}
                    </td>

                    <td className="text-center py-3 px-2 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)]">
                      {e.id}
                    </td>
                    <td className="text-center py-3 px-2 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)]">
                      {e.Address.slice(0, 7)}...{e.Address.slice(37)}
                    </td>
                    <td className="text-center py-3 px-2 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)]">
                      {e.referrer}
                    </td>
                    <td className="text-center py-3 px-2 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)]">
                      {useAppState.getUTCTime(e.started * 1000)}
                    </td>
                    <td className="text-center py-3 px-2 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)]">{useAppState.ranks[e.Level - 1]}</td>
                    <td className="text-center py-3 px-2 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)]">{e.Direct}</td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Teams;
