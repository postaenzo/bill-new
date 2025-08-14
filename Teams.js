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
    },
  ]);

  useEffect(() => {
    async function getData() {
      if (!useAppState.staticContract) {
        useAppState.navigate('/');
        return;
      }

      let _team = await useAppState.staticContract.getDirectTeamUsers(
        useAppState.id
      );
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
          },
        ]);
      }
    }
    getData();
  }, [useAppState.walletAddress, useAppState.change]);

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
          <div className="overflow-auto h-[26rem] w-full rounded-lg dark:text-white text-gray-800">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-[#8080821a] sticky top-0">
                <tr>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">SNo.</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">ID</th>
                  <th className="text-center font-bold py-3 px-2 border-2 border-[rgba(124,240,89,0.16)] bg-[#000000]">Address</th>
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
