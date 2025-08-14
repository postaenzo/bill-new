import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import { AppState } from "../App";
import { DownOutlined, LeftOutlined } from "@ant-design/icons";
import { message, Modal } from "antd";
import { TailSpin } from "react-loader-spinner";

const BinaryTree = () => {
  const useAppState = useContext(AppState);
  const [address, setAddress] = useState("");
  const [B1, setB1] = useState("0x0000000000000000000000000000000000000000");
  const [B2, setB2] = useState("0x0000000000000000000000000000000000000000");
  const [C1, setC1] = useState("0x0000000000000000000000000000000000000000");
  const [C2, setC2] = useState("0x0000000000000000000000000000000000000000");
  const [C3, setC3] = useState("0x0000000000000000000000000000000000000000");
  const [C4, setC4] = useState("0x0000000000000000000000000000000000000000");
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [user, setUser] = useState({
    address: "",
    id: "",
    directTeam: "",
    start: 0,
    referrer: "",
    isUnBlocked: false,
    totalTeam: 0,
    rank: ""
  });
  const zeroAddr = "0x0000000000000000000000000000000000000000";
  const [randId, setRandId] = useState("");

  useEffect(() => {
    async function getData() {
      if (!useAppState.staticContract) {
        useAppState.navigate('/');
        return;
      }
      setAddress(useAppState.id);
      setRandId(useAppState.id);
      
      let _binary1 = await useAppState.staticContract.getMatrixDirect(useAppState.id);
      setB1(Number(_binary1[0]));
      setB2(Number(_binary1[1]));

      let _binary2 = await useAppState.staticContract.getMatrixDirect(_binary1[0]);
      setC1(Number(_binary2[0]));
      setC2(Number(_binary2[1]));

      let _binary3 = await useAppState.staticContract.getMatrixDirect(_binary1[1]);
      setC3(Number(_binary3[0]));
      setC4(Number(_binary3[1]));

    }
    getData();
  }, [useAppState.walletAddress, useAppState.change, useAppState.id]);

  const fetchDetails = async (_addr) => {
    setLoading(true);
    try {
      setB1(zeroAddr);
      setB2(zeroAddr);
      setC1(zeroAddr);
      setC2(zeroAddr);
      setC3(zeroAddr);
      setC4(zeroAddr);
      if (_addr == address) {
        let _user = await useAppState.staticContractStorage.userInfo(_addr);
        let upline = _user.upline;
        setAddress(Number(upline));
        //console.log('_addr == address',_addr);
        let _binary1 = await useAppState.staticContract.getMatrixDirect(upline);
        //console.log('_binary1:',_binary1);
        //console.log('_binary1.length:',_binary1.length);
        if(_binary1.length>0){
          setB1(Number(_binary1[0]));
          setB2(Number(_binary1[1]));
        }else{
          setB1(zeroAddr);
          setB2(zeroAddr);    
        }

        let _binary2 = await useAppState.staticContract.getMatrixDirect(_binary1[0]);
        
        //console.log('_binary2:',_binary2);
        if(_binary2.length>0){
          setC1(Number(_binary2[0]));
          setC2(Number(_binary2[1]));
        }else{
          setC1(zeroAddr);
          setC2(zeroAddr);
        }

        let _binary3 = await useAppState.staticContract.getMatrixDirect(_binary1[1]);
        //console.log('_binary3:',_binary3);
        if(_binary3.length>0){
          setC3(Number(_binary3[0]));
          setC4(Number(_binary3[1]));
        }else{
          setC3(zeroAddr);
          setC4(zeroAddr);
        }

      } else {
        
        setAddress(_addr);
        let _binary1 = await useAppState.staticContract.getMatrixDirect(_addr);
        //console.log('_binary1:',_binary1);
        if(_binary1.length>0){
          setB1(Number(_binary1[0]));
          setB2(Number(_binary1[1]));
        }else{
          setB1(zeroAddr);
          setB2(zeroAddr);    
        }

        let _binary2 = await useAppState.staticContract.getMatrixDirect(_binary1[0]);
        //console.log('_binary2:',_binary2);
        if(_binary2.length>0){
          setC1(Number(_binary2[0]));
          setC2(Number(_binary2[1]));
        }else{
          setC1(zeroAddr);
          setC2(zeroAddr);
        }
        let _binary3 = await useAppState.staticContract.getMatrixDirect(_binary1[1]);
        //console.log('_binary3:',_binary3);
        if(_binary3.length>0){
          setC3(Number(_binary3[0]));
          setC4(Number(_binary3[1]));
        }else{
          setC3(zeroAddr);
          setC4(zeroAddr);
        }
      }
    } catch (error) {
      //console.log('errore 2');
      //message.error(error.reason);
    }
    setLoading(false);
  };

  const findUser = async (_addr) => {
    setLoading2(true);
    try {
      setModalOpen(true);
      let _user = await useAppState.staticContractStorage.userInfo(_addr);
      setUser({
        address: _user.account,
        id: _addr,
        directTeam: Number(_user.directTeam),
        start: Number(_user.start),
        rank: useAppState.ranks[Number(_user.level) - 1],
        referrer: Number(_user.referrer),
        isUnBlocked: true,
        totalTeam: Number(_user.totalMatrixTeam)
      });
    } catch (error) {
      message.error(error.reason);
    }
    setLoading2(false);
  };

  const changeAddr = async () => {
    try {
        setLoading(true);
        let isFound = true;
        let upline = {upline: randId}
        for(let i=0; i<20; i++) {
          upline = await useAppState.staticContractStorage.userInfo(upline.upline);
          if(Number(upline.upline) == 0 || Number(upline.upline) == 13536 || Number(upline.id) == 0 || Number(upline.id) == 13536){
            break;
          }
          if(Number(upline.upline) == Number(useAppState.id) || Number(upline.id) == Number(useAppState.id)) {
            isFound = false;
            break;
          }
        }
        if(isFound) {
          message.warning("Invalid Community ID")
          setRandId(address);
          setLoading(false);
          return;
        }
        await fetchDetails(randId);
        setAddress(randId);
        setLoading(false);
    } catch (error) {
      //console.log('errrore');
      message.error(error.message);
    }
  }

  return (
    <>
    <img src='bgimg.png' className='fixed hidden md:block right-0 h-full w-full top-0 z-0 opacity-30' />
    <img src='bgmobimg.png' className='fixed h-full w-full left-0 md:top-0 block md:hidden top-0 z-0  opacity-30' />

    <div className="text-black dark:text-white transition-colors duration-1000 min-h-screen relative">
      <Header />
      
      <div className="flex justify-center w-full px-4 mt-6">
        <div className="w-full md:w-3/4">
          <Navigation />
        </div>
      </div>
      
      {loading ? (
        <div className="mt-14 w-full flex justify-center">
          <TailSpin height={32} />
        </div>
      ) : (
        <div className="flex flex-col items-center mt-2 w-full p-4 overflow-x-auto min-h-screen">
          <Modal
            title={null}
            open={isModalOpen}
            closable={true}
            onCancel={() => setModalOpen(false)}
            okButtonProps={{ className: "hidden" }}
            cancelButtonProps={{ className: "hidden" }}
            styles={{content: {background: "black", padding: 0, borderRadius: "8px"}}}
            wrapClassName="custom-modal"
          >
            {loading2 ? (
              <div className="py-12 px-8 bg-[#1e2026] bg-opacity-60 flex justify-center items-center h-full w-full">
              <TailSpin height={14} />
              </div>
            ) : (
              <div className="flex justify-start blue_blur p-5 bg-[#1e2026] bg-opacity-60 pt-10 overflow-x-auto items-center">
                <div className="flex flex-col justify-center items-start">
                  <p className="text-center w-full text-white whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    ID:
                  </p>
                  <p className="text-center w-full text-white whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Address:
                  </p>
                  <p className="text-center w-full text-white whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Rank:
                  </p>
                  <p className="text-center w-full text-white whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Activation Date:
                  </p>
                  <p className="text-center w-full text-white whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Referred By:
                  </p>
                  <p className="text-center w-full text-white whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Community Size:
                  </p>
                </div>
                <div className="flex w-full ml-5 flex-col justify-center items-start">
                  <p className="w-full text-white whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    {user.id}
                  </p>
                  <p className="w-full text-white whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    {user.address.slice(0, 10)}...{user.address.slice(37)}
                  </p>
                  <p className="w-full text-white whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    {user.rank}
                  </p>
                  <p className="w-full text-white whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                      {useAppState.getUTCTime(user.start * 1000)}
                  </p>
                  <p className="w-full text-white whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    {user.referrer}
                  </p>
                  <p className="w-full text-white whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    {user.totalTeam}
                  </p>
                </div>
              </div>
            )}
          </Modal>

          <h1 className="text-lime-500 font-bold text-2xl">Community</h1>
          <div className="text-teal-500 font-bold flex justify-center items-center">
            <input maxLength={7} className="p-2 px-4 mt-2 bg-gray-700 bg-opacity-45 w-[100px]" value={randId} onChange={(e) => setRandId(e.target.value)} placeholder="ID" />
            <span
              onClick={changeAddr}
              className="py-2 mt-2 px-2 bg-green-500 h-full ml-2 text-white cursor-pointer p-2 rounded-sm text-sm font-medium"
            >
              Search
            </span>
          </div>

          <div className="flex mt-4 flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center cursor-pointer">
              <img
                onClick={() => findUser(address)}
                src="billionaire.png"
                className="h-12"
              />
              <h1
                onClick={() => findUser(address)}
                className="text-teal-500 font-semibold text-xs mt-1"
              >
                {address}
              </h1>
              {address != useAppState.id ? (
                <span
                  onClick={() => fetchDetails(address)}
                  className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                >
                  Back <LeftOutlined />
                </span>
              ) : null}
            </div>
            <div className="border-2 mt-1 w-0 border-blue-500 h-16"></div>
          </div>

          <div className="flex relative justify-between w-2/3 md:w-1/2 border-t-0 border-blue-500 rounded-xl">
            <div className="flex flex-col justify-center items-center">
              <div className="border-2 w-0 border-blue-500 h-16"></div>
              <div className="flex flex-col items-center cursor-pointer">
                
                { B1 == zeroAddr ? (
                  <>
                    <img src="restrict.png" className="h-14" />
                    <h1 className="text-red-500 font-semibold text-xs">
                      (None)
                    </h1>
                    <span className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium">
                      Vacant
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      onClick={() => findUser(B1)}
                      src="billionaire.png"
                      className="h-12"
                    />
                    <h1
                      onClick={() => findUser(B1)}
                      className="text-teal-500 font-semibold text-xs mt-1"
                    >
                      {B1}
                    </h1>
                    <span
                      onClick={() => fetchDetails(B1)}
                      className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                    >
                      Tree <DownOutlined />
                    </span>
                  </>
                )}
              </div>
              <div className="border-2 mt-1 w-0 border-blue-500 h-16"></div>
            </div>

            <div className="absolute top-0 right-[33px] left-[33px] border-t-4 border-blue-500"></div>

            <div className="flex flex-col justify-center items-center">
              <div className="border-2 w-0 border-blue-500 h-16"></div>
              <div className="flex flex-col items-center cursor-pointer">
              
                {B2 == zeroAddr ? (
                  <>
                    <img src="restrict.png" className="h-14" />
                    <h1 className="text-red-500 font-semibold text-xs">
                      (None)
                    </h1>
                    <span className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium">
                      Vacant
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      onClick={() => findUser(B2)}
                      src="billionaire.png"
                      className="h-12"
                    />
                    <h1
                      onClick={() => findUser(B2)}
                      className="text-teal-500 font-semibold text-xs mt-1"
                    >
                      {B2}
                    </h1>
                    <span
                      onClick={() => fetchDetails(B2)}
                      className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                    >
                      Tree <DownOutlined />
                    </span>
                  </>
                )}
              </div>
              <div className="border-2 mt-1 w-0 border-blue-500 h-16"></div>
            </div>
          </div>
          
          {/* Layer 2 */}
          <div className="w-[76%] border-t-4 border-blue-500"></div>
          
          <div className="flex justify-between w-full">

            <div className="flex flex-col justify-between w-1/4 items-center">
              <div className="flex flex-col items-center w-full cursor-pointer">
                <div className="border-2 w-0 border-blue-500 h-16"></div>
                <div className="flex flex-col items-center cursor-pointer">
                
                {C1 == zeroAddr ? (
                  <>
                    <img src="restrict.png" className="h-14" />
                    <h1 className="text-red-500 font-semibold text-xs">
                      (None)
                    </h1>
                    <span className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium">
                      Vacant
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      onClick={() => findUser(C1)}
                      src="billionaire.png"
                      className="h-12"
                    />
                    <h1
                      onClick={() => findUser(C1)}
                      className="text-teal-500 font-semibold text-xs mt-1"
                    >
                      {C1}
                    </h1>
                    <span
                      onClick={() => fetchDetails(C1)}
                      className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                    >
                      Tree <DownOutlined />
                    </span>
                  </>
                )}
              </div>
              </div>
            </div>

            <div className="flex flex-col justify-center w-1/4 items-center">
              <div className="flex flex-col items-center w-full cursor-pointer">
                <div className="border-2 w-0 border-blue-500 h-16"></div>
                <div className="flex flex-col items-center cursor-pointer">
                
                {C2 == zeroAddr ? (
                  <>
                    <img src="restrict.png" className="h-14" />
                    <h1 className="text-red-500 font-semibold text-xs">
                      (None)
                    </h1>
                    <span className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium">
                      Vacant
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      onClick={() => findUser(C2)}
                      src="billionaire.png"
                      className="h-12"
                    />
                    <h1
                      onClick={() => findUser(C2)}
                      className="text-teal-500 font-semibold text-xs mt-1"
                    >
                      {C2}
                    </h1>
                    <span
                      onClick={() => fetchDetails(C2)}
                      className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                    >
                      Tree <DownOutlined />
                    </span>
                  </>
                )}
              </div>
              </div>
            </div>

            <div className="flex flex-col justify-center w-1/4 items-center">
              <div className="flex flex-col items-center w-full cursor-pointer">
                <div className="border-2 w-0 border-blue-500 h-16"></div>
                <div className="flex flex-col items-center cursor-pointer">
                
                {C3 == zeroAddr ? (
                  <>
                    <img src="restrict.png" className="h-14" />
                    <h1 className="text-red-500 font-semibold text-xs">
                      (None)
                    </h1>
                    <span className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium">
                      Vacant
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      onClick={() => findUser(C3)}
                      src="billionaire.png"
                      className="h-12"
                    />
                    <h1
                      onClick={() => findUser(C3)}
                      className="text-teal-500 font-semibold text-xs mt-1"
                    >
                      {C3}
                    </h1>
                    <span
                      onClick={() => fetchDetails(C3)}
                      className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                    >
                      Tree <DownOutlined />
                    </span>
                  </>
                )}
              </div>
              </div>
            </div>

            <div className="flex flex-col justify-center w-1/4 items-center">
              <div className="flex flex-col items-center w-full cursor-pointer">
                <div className="border-2 w-0 border-blue-500 h-16"></div>
                <div className="flex flex-col items-center cursor-pointer">
                
                {C4 == zeroAddr ? (
                  <>
                    <img src="restrict.png" className="h-14" />
                    <h1 className="text-red-500 font-semibold text-xs">
                      (None)
                    </h1>
                    <span className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium">
                      Vacant
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      onClick={() => findUser(C4)}
                      src="billionaire.png"
                      className="h-12"
                    />
                    <h1
                      onClick={() => findUser(C4)}
                      className="text-teal-500 font-semibold text-xs mt-1"
                    >
                      {C4}
                    </h1>
                    <span
                      onClick={() => fetchDetails(C4)}
                      className="py-1 mt-2 px-2 bg-green-500 rounded-sm text-sm font-medium"
                    >
                      Tree <DownOutlined />
                    </span>
                  </>
                )}
              </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
    </>
  );
};

export default BinaryTree;
