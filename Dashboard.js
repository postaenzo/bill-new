import React, { useContext, useEffect, useState } from 'react'

import { AppState } from '../App'
import Header from './Header';
import Register from './Register';
import UserInfo from './UserInfo';
import Socials from './Socials';
import Navigation from './Navigation';
import CopyToClipboard from 'react-copy-to-clipboard';
import { message } from 'antd';
import { TailSpin } from 'react-loader-spinner';
import { CopyFilled, LikeFilled } from '@ant-design/icons';
import { ethers } from 'ethers';
import { useTimer } from 'react-timer-hook';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function MyTimer({ expiryTimestamp }) {
  // Convert expiryTimestamp to a Date object
  const expiryDate = new Date(expiryTimestamp);
  
  // Set expiry timestamp (e.g., 10 minutes from now)
  // let expiryDate = new Date().getTime() + 600000;
  // expiryDate = new Date(expiryDate);

  // Log for debugging purposes
  // console.log('expiryTimestamp:', expiryTimestamp);
  // console.log('expiryDate:', expiryDate);

  // Destructure the timer values
  const { seconds, minutes, hours } = useTimer({ expiryTimestamp: expiryDate });

  return (
    <p>
      <span>{hours.toString().padStart(2, '0')}</span>:
      <span>{minutes.toString().padStart(2, '0')}</span>:
      <span>{seconds.toString().padStart(2, '0')}</span>
    </p>
  );
}

function MyTimerDay({ expiryTimestamp }) {
  const expiryDate = new Date(expiryTimestamp);

  // Estraiamo anche i giorni dal timer
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: expiryDate });

  return (
    <p>
      <span>{days.toString().padStart(2, '0')}</span>d :
      <span>{hours.toString().padStart(2, '0')}</span>h :
      <span>{minutes.toString().padStart(2, '0')}</span>m :
      <span>{seconds.toString().padStart(2, '0')}</span>s
    </p>
  );
}

const Dashboard = () => {

  const useAppState = useContext(AppState);

  const [user, setUser] = useState({
    level: 0,
    income: 0,
    matrixTeam: 0,
    directTeam: 0,
    royaltyIncome: 0,
    referralIncome: 0,
    levelIncome: 0
  })

  const [bonuses, setBonuses] = useState({
    generationBonusIncome: 0,
    extraLeg: 0,
    totLyfestyleInocome: 0,
  })


  const [generBonusIncome, setGenBonInc] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0]);


  const [lvl, setLvl] = useState({
    lvl: 0,
    total: 0
  })
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false,
    "9": false,
    "10": false,
  })
  const [income, setIncome] = useState([{
    from: "",
    time: 0,
    amount: 0,
    layer: 0,
    level: 0
  }])
  const [packageWid, setPackageWid] = useState(0);
  const [showRoyalty, setShowRoyalty] = useState(false);
  const [showLeadership, setShowLeadership] = useState(false);
  const [roayltyTime, setRoyaltyTime] = useState(0);
  const [leadershipTime, setLeadershipTime] = useState(0);
  const [royalty, setRoyalty] = useState([0,0,0,0]);
  const [leadershipAmount, setLeadershipAmount] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

  const [royaltyUsers, setRoyaltyUsers] = useState([[0], [0], [0],[0]]);
  const [leadershipUsers, setLeadershipUsers] = useState([[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]);

  const [totalRoyaltyUsers, setTotalRoyaltyUsers] = useState([0, 0, 0,0]);
  const [totalLeadershipUsers, setTotalLeadershipUsers] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  
  const [lvlIncome, setLvlIncome] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0]);


  async function getDataAll() {
    if (!useAppState.staticContract) {
        useAppState.navigate('/');
        return;
    }
    let _user = await useAppState.staticContractStorage.userInfo(useAppState.id);
    setUser({
      level: Number(_user.level),
      income: useAppState.convert(_user.totalIncome),
      matrixTeam: Number(_user.totalMatrixTeam),
      directTeam: Number(_user.directTeam),
      royaltyIncome: useAppState.convert(_user.royaltyIncome,),
      referralIncome: useAppState.convert(_user.referralIncome,),
      levelIncome: useAppState.convert(_user.levelIncome)
    })

    let _bouses = await useAppState.staticContractStorage.earnInfo(useAppState.id);
    setBonuses({
      generationBonusIncome: useAppState.convert(_bouses.generationBonusIncome),
      extraLeg: Number(_bouses.extraLeg),
      totLyfestyleInocome: useAppState.convert(_bouses.totLyfestyleInocome)

    })  

    setPackageWid(parseInt(((Number(user.level) * 100) / 12)))

    setSelected({
      "0": false,
      "1": false,
      "2": false,
      "3": false,
      "4": false,
      "5": false,
      "6": false,
      "7": false,
      "8": false,
      "9": false,
      "10": false,
    });

    setLvl({
      lvl: 0,
      total: 0
    })

    let _royaltyTime = await useAppState.staticContract.getRoyaltyTime();
    setRoyaltyTime(Number(_royaltyTime));
    setShowRoyalty(true);

    let _leadershipTime = await useAppState.staticContract.getLeadershipTime();
    setLeadershipTime(Number(_leadershipTime));
    setShowLeadership(true);

    let _royalty = await useAppState.staticContract.royalty(0);
    let _royalty1 = await useAppState.staticContract.royalty(1);
    let _royalty2 = await useAppState.staticContract.royalty(2);
    let _royalty3 = await useAppState.staticContract.royalty(3);
    setRoyalty([useAppState.convert(_royalty), useAppState.convert(_royalty1), useAppState.convert(_royalty2),useAppState.convert(_royalty3)]);

    let _leadershipAmount0 = await useAppState.staticContract.leadershipPool(0);
    
    let _leadershipAmount1 = await useAppState.staticContract.leadershipPool(1);
    let _leadershipAmount2 = await useAppState.staticContract.leadershipPool(2);
    let _leadershipAmount3 = await useAppState.staticContract.leadershipPool(3);
    let _leadershipAmount4 = await useAppState.staticContract.leadershipPool(4);
    let _leadershipAmount5 = await useAppState.staticContract.leadershipPool(5);
    let _leadershipAmount6 = await useAppState.staticContract.leadershipPool(6);
    let _leadershipAmount7 = await useAppState.staticContract.leadershipPool(7);
    let _leadershipAmount8 = await useAppState.staticContract.leadershipPool(8);
    let _leadershipAmount9 = await useAppState.staticContract.leadershipPool(9);
    let _leadershipAmount10 = await useAppState.staticContract.leadershipPool(10);
    let _leadershipAmount11 = await useAppState.staticContract.leadershipPool(11);
    let _leadershipAmount12 = await useAppState.staticContract.leadershipPool(12);
    let _leadershipAmount13 = await useAppState.staticContract.leadershipPool(13);
    let _leadershipAmount14 = await useAppState.staticContract.leadershipPool(14);
    
    setLeadershipAmount([useAppState.convert(_leadershipAmount0),useAppState.convert(_leadershipAmount1),useAppState.convert(_leadershipAmount2),useAppState.convert(_leadershipAmount3),useAppState.convert(_leadershipAmount4),useAppState.convert(_leadershipAmount5),useAppState.convert(_leadershipAmount6),useAppState.convert(_leadershipAmount7),useAppState.convert(_leadershipAmount8),useAppState.convert(_leadershipAmount9),useAppState.convert(_leadershipAmount10),useAppState.convert(_leadershipAmount11),useAppState.convert(_leadershipAmount12),useAppState.convert(_leadershipAmount13),useAppState.convert(_leadershipAmount14)]);

    setLvlIncome([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0]);
    let _lvlIn = [];
    let _lvlIncome = await useAppState.staticContract.getLevelIncome(useAppState.id);
    _lvlIncome.forEach((e) => {
      _lvlIn.push(useAppState.convert(e));
    })
    setLvlIncome(_lvlIn);
    
    setIncome([]);
    let _income = await useAppState.staticContract.getIncome(useAppState.id);
    //console.log('useAppState.id',useAppState.id);
    //console.log('_income',_income);
    if(_income.length > 0) {
      
      for(let i=_income.length-1; i>=0; i--) {
        let lvlTmp = 0;
        if(Number(_income[i].layer)>0){
          let usrtmp =  await useAppState.staticContractStorage.userInfo(Number(_income[i].id));
          lvlTmp = usrtmp.level
          
        }
        setIncome((prev) => [...prev, {
          from: Number(_income[i].id),
          time: Number(_income[i].time) * 1000,
          amount: useAppState.convert(_income[i].amount),
          layer: Number(_income[i].layer),
          //level: useAppState.levels.indexOf(Number(useAppState.convert(_income[i].amount))) + 1
          level:  Number(lvlTmp)
        }])
      }
    }

    
    //let royalty = [[], [], [],[]];
    let _royaltyUsers = await useAppState.staticContract.getRoyaltyUsers(0);
    let _royaltyUsers1 = await useAppState.staticContract.getRoyaltyUsers(1);
    let _royaltyUsers2 = await useAppState.staticContract.getRoyaltyUsers(2);
    let _royaltyUsers3 = await useAppState.staticContract.getRoyaltyUsers(3);
    
    setTotalRoyaltyUsers([_royaltyUsers.length, _royaltyUsers1.length, _royaltyUsers2.length,_royaltyUsers3.length]);
    setRoyaltyUsers([_royaltyUsers, _royaltyUsers1, _royaltyUsers2,_royaltyUsers3]);
    
    let _leadershipUsers0 = await useAppState.staticContract.getLeadershipUsers(0);
    let _leadershipUsers1 = await useAppState.staticContract.getLeadershipUsers(1);
    let _leadershipUsers2 = await useAppState.staticContract.getLeadershipUsers(2);
    let _leadershipUsers3 = await useAppState.staticContract.getLeadershipUsers(3);
    let _leadershipUsers4 = await useAppState.staticContract.getLeadershipUsers(4);
    let _leadershipUsers5 = await useAppState.staticContract.getLeadershipUsers(5);
    let _leadershipUsers6 = await useAppState.staticContract.getLeadershipUsers(6);
    let _leadershipUsers7 = await useAppState.staticContract.getLeadershipUsers(7);
    let _leadershipUsers8 = await useAppState.staticContract.getLeadershipUsers(8);
    let _leadershipUsers9 = await useAppState.staticContract.getLeadershipUsers(9);
    let _leadershipUsers10 = await useAppState.staticContract.getLeadershipUsers(10);
    let _leadershipUsers11 = await useAppState.staticContract.getLeadershipUsers(11);
    let _leadershipUsers12 = await useAppState.staticContract.getLeadershipUsers(12);
    let _leadershipUsers13 = await useAppState.staticContract.getLeadershipUsers(13);
    let _leadershipUsers14 = await useAppState.staticContract.getLeadershipUsers(14);
   
    setTotalLeadershipUsers([_leadershipUsers0.length, _leadershipUsers1.length, _leadershipUsers2.length, _leadershipUsers3.length, _leadershipUsers4.length, _leadershipUsers5.length, _leadershipUsers6.length, _leadershipUsers7.length, _leadershipUsers8.length, _leadershipUsers9.length, _leadershipUsers10.length, _leadershipUsers11.length, _leadershipUsers12.length, _leadershipUsers13.length, _leadershipUsers14.length]);
    setLeadershipUsers([_leadershipUsers0, _leadershipUsers1, _leadershipUsers2, _leadershipUsers3, _leadershipUsers4, _leadershipUsers5, _leadershipUsers6, _leadershipUsers7, _leadershipUsers8, _leadershipUsers9, _leadershipUsers10, _leadershipUsers11, _leadershipUsers12, _leadershipUsers13, _leadershipUsers14]);
   
  }
  useEffect(() => {
    
    getDataAll();
  },[useAppState.walletAddress, useAppState.change, useAppState.id])

  useEffect(() => {
    async function getData() {
      if(user.level > 0 && !useAppState.shown) {
        let _act = await useAppState.staticContract.getRecentActivities(3);
        // console.log('_act: ',_act);
        NotificationManager.removeAll();
        for(let i=0; i<_act.length; i++) {
          setTimeout(() => {
            NotificationManager.info(`ID: ${Number(_act[i].id)} just got upgraded to ${useAppState.ranks[Number(_act[i].level)-1]}`, null, 2500)
            if(i == _act.length - 1) useAppState.setShown(true);
          }, i * 3300);
        }
      }
    }
    getData();
  },[user.level])

  const upgrade = async () => {
    setLoading(true);
    useAppState.setLoading(true);
    try {
      let contract = await useAppState.getContract();
      console.log("bnb valore:",(lvl.total.toFixed(5)).toString());
      
      console.log( "bnb valore2:",lvl.total);
      const weiAmount = ethers.parseUnits(lvl.total.toString(), "ether");
      console.log("Transaction value in wei:", weiAmount.toString());

      let tx = await contract.upgrade(useAppState.id, lvl.lvl,{
        gasLimit: 6000000,
        value: ethers.parseEther(lvl.total.toString())
      });
      await tx.wait();
      setLvl({
        lvl: 0,
        total: 0
      })
      useAppState.setChange(useAppState.change + 1);
      message.success("Sucessfully Upgraded");
    } catch (error) {
      message.error(error.reason);
      console.log(error.message)
    }
    setLoading(false);
    useAppState.setLoading(false);

  }

  const distributeRoyalty= async () => {
    setLoading(true);
    useAppState.setLoading(true);
    try {
      let contract = await useAppState.getContract();
      let tx = await contract.distributeRoyalty();
      await tx.wait();
      getDataAll();
      message.success("Royalty Distributed");
    } catch (error) {
      message.error(error.reason);
      console.log(error.message)
    }
    setLoading(false);
    useAppState.setLoading(false);
  }

  const distributeLyfestyle= async () => {
    setLoading(true);
    useAppState.setLoading(true);
    try {
      let contract = await useAppState.getContract();
      let tx = await contract.distributeLyfestyle();
      await tx.wait();
      getDataAll();
      message.success("Leadership Bonus Distributed");
    } catch (error) {
      message.error(error.reason);
      console.log(error.message)
    }
    setLoading(false);
    useAppState.setLoading(false);
  }



  const select = (amt, i) => {
    if(selected[i - 1] == true || i == user.level + 1) {
      setLvl((prev) => ({lvl: prev.lvl + 1, total: prev.total + amt})); 
      setSelected((prev) => ({...prev, [i]: true}));
    }
  }
  
  const deSelect = (amt, i) => {
    if(selected[i + 1] == false || i == useAppState.levels.length - 1) {
      setLvl((prev) => ({lvl: prev.lvl - 1, total: prev.total - amt})); 
      setSelected((prev) => ({...prev, [i]: false}));
    }
  } 

  return (
    <>
      <img
        src="bgimg.png"
        className="fixed hidden md:block right-0 top-0 z-0 opacity-30 w-full h-full"
      />
      <img
        src="bgmobimg.png"
        className="fixed w-full left-0 md:top-0 block md:hidden top-0 z-0  opacity-30"
      />

      <NotificationContainer />

      <div className="pb-4 text-black dark:text-white transition-colors duration-1000 min-h-screen relative">
        <Header />

        <div className="flex justify-center w-full px-4 mt-6">
          <div className="w-full md:w-3/4">
            <Navigation />
          </div>
        </div>

        <Register />

        <div className="flex justify-center px-4 md:p-0 mt-6">
          <div className="md:w-3/4 w-full">
            <div>
              <UserInfo />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center px-4 md:p-0 mt-6">
            <h1 className="md:w-3/4 w-full flex justify-start overflow-x-auto font-bold text-2xl text-green-500">Packages</h1>
          <div className="md:w-3/4 w-full flex justify-start gap-x-4 overflow-x-auto">
            {
            useAppState.levels.map((e, i) => {
              //let amt = e + (e * useAppState.percent[i]) / 100;
              //let amt = Number(e) + (Number(e) * useAppState.percent[i]) / 100;
              return (
                <div
                  key={i}
                  onClick={() => {
                    selected[i] ? deSelect(e, i) : select(e, i);
                  }}
                  className={`${i > 0 ? "" : "hidden"} ${
                    user.level >= i ? "hidden" : null
                  } flex-col cursor-pointer blue_blur p-4 mt-4 font-bold text-black dark:text-white min-w-32 min-h-32 flex justify-center items-center rounded-full bg-white dark:bg-[#1e2026] shadow-lg`}
                >
                  <p className="text-gray-800 dark:text-[#FFE900] mt-1">
                    {e.toFixed(5)}
                  </p>
                  <p className="bg-gray-200 rounded-full text-gray-800 min-w-8 flex justify-center items-center text-sm p-1 mt-1">
                    {useAppState.ranks[i - 1]}{" "}
                    {selected[i] ? <span className="ml-1">✅</span> : null}
                  </p>
                  <img src="bnb.png" className="h-8 mt-1" />
                </div>
              );
            })}
          </div>
        </div>

        {lvl.lvl > 0 ? (
          <div className="flex justify-center px-4 md:p-0 mt-8">
            <div className="md:w-3/4 w-full">
              <button
                onClick={upgrade}
                className="w-full flex justify-center items-center cursor-pointer bg-green-500 rounded-sm text-sm font-bold py-3 px-3 text-white"
              >
                {loading ? (
                  <TailSpin height={15} color="white" />
                ) : (
                  <span>Upgrade {lvl.total.toFixed(5)} BNB</span>
                )}
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex justify-center px-4 md:p-0 mt-6">
          <div className="md:w-3/4 w-full">
            <div className="w-full flex justify-between items-center bg-whtie dark:bg-[#1e2026] dark:bg-opacity-40 rounded-lg shadow-lg p-4">
              <div className="overflow-x-auto overflow-y-hidden">
                <h1 className="text-lg font-bold mb-4 text-white">Referral Link</h1>
                <div className='flex justify-between items-center text-2xl'>
                  <CopyToClipboard
                    onCopy={() => message.success("Copied!")}
                    text={`https://www.billionaireai.club/?ref=17613${useAppState.id}`}
                  >
                    <span className="max-w-full cursor-pointer text-sm font-medium overflow-x-auto bg-blue-500 rounded-sm px-3 py-2 text-white whitespace-nowrap">
                      {`https://www.billionaireai.club/?ref=${useAppState.id}`}
                    </span>
                  </CopyToClipboard>
                  <CopyToClipboard
                      onCopy={() => message.success("Copied!")}
                      text={`https://www.billionaireai.club/?ref=${useAppState.id}`}
                    >
                    <CopyFilled className="ml-2 cursor-pointer" />
                  </CopyToClipboard>
                </div>
              </div> 
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 md:p-0 mt-8">
          <div className="md:w-3/4 w-full">
            <div className="flex flex-col md:flex-row justify-between text-white">
              <div className="flex justify-between w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Total Income
                  </p>
                  <p className='text-xl font-bold'>{user.income} BNB</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
              <div className="flex justify-between ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Referral Income
                  </p>
                  <p className='text-xl font-bold'>{user.referralIncome} BNB</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 md:p-0 mt-4">
          <div className="md:w-3/4 w-full">
            <div className="flex flex-col md:flex-row justify-between text-white">
              <div className="flex justify-between w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Level Income
                  </p>
                  <p className='text-xl font-bold'>{user.levelIncome.toFixed(10)} BNB</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
              <div className="flex justify-between ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Royalty Income
                  </p>
                  <p className='text-xl font-bold'>{user.royaltyIncome} BNB</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 md:p-0 mt-4">
          <div className="md:w-3/4 w-full">
            <div className="flex flex-col md:flex-row justify-between text-white">
              <div className="flex justify-between w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Generation Bonus
                  </p>
                  <p className='text-xl font-bold'>{bonuses.generationBonusIncome.toFixed(10)} BNB</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
              <div className="flex justify-between ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Leadership Bonus 
                  </p>
                  <p className='text-xl font-bold'>{bonuses.totLyfestyleInocome.toFixed(10)} BNB</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 md:p-0 mt-4">
          <div className="md:w-3/4 w-full">
            <div className="flex flex-col md:flex-row justify-between text-white">
              <div className="flex justify-between w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    My Community Size
                  </p>
                  <p className='text-xl font-bold'>{user.matrixTeam}</p>
                </div>
                <img src="matrix.png" className="h-12" />
              </div>
              <div className="flex justify-between ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Direct Referrals
                  </p>
                  <p className='text-xl font-bold'>{user.directTeam}</p>
                </div>
                <img src="leader.png" className="h-12" />
              </div>
            </div>
          </div>
        </div>


        <div className="flex justify-center px-4 md:p-0 mt-4">
          <div className="md:w-3/4 w-full">
            <div className="flex flex-col md:flex-row justify-between text-white">
              <div className="flex justify-between w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                <div>
                  <p className="text-lg font-bold text-[#FFE900]">
                    Power Legs 
                  </p>
                  <p className='text-xl font-bold'>{bonuses.extraLeg}</p>
                </div>
                <img src="bnb.png" className="h-12" />
              </div>
              <div className="flex justify-between ml-0 md:ml-4 mt-4 md:mt-0 w-full md:w-1/2 bg-[#1e2026] bg-opacity-40 p-4 shadow-lg rounded-sm font-bold text-lg">
                
              </div>
            </div>
          </div>
        </div>


        {/* Lvl Income */}
        <div className="flex justify-center px-4 md:p-0 mt-8">
            <div className="md:w-3/4 w-full">
              <h1 className="font-bold text-2xl px-2">
                Level <span className="text-green-500">Income</span>
              </h1>
              <div className="overflow-auto flex justify-between w-full mt-2 p-2 rounded-sm">
                <div className="whitespace-nowrap ml-0 md:ml-0 w-1/2">
                  <p className="text-center text-lime-500 whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Rank
                  </p>
                  {useAppState.ranks.map((e, i) => {
                    return (
                      <p
                        key={i}
                        className="flex align-middle justify-center gap-2 text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-3"
                      >
                        <span className='min-w-[105px] text-left text-[15px]'>{e}</span>
                        { user.level > i ? 
                          <svg className='min-w-[20px]' xmlns="http://www.w3.org/2000/svg" width={20} fill="#22c55e" viewBox="0 0 576 512"><path className="fa-secondary" d="M432 64c-44.2 0-80 35.8-80 80v48H288V144C288 64.5 352.5 0 432 0s144 64.5 144 144v48c0 17.7-14.3 32-32 32s-32-14.3-32-32V144c0-44.2-35.8-80-80-80z"/><path className="fa-primary" d="M64 192c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H64zM256 384H192c-17.7 0-32-14.3-32-32s14.3-32 32-32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>
                        : <svg className='min-w-[17px]' xmlns="http://www.w3.org/2000/svg" width={17} fill="#ef4444" viewBox="0 0 448 512"><path className="fa-secondary" d="M224 64c-44.2 0-80 35.8-80 80v48H80V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48H304V144c0-44.2-35.8-80-80-80z"/><path className="fa-primary" d="M64 192c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H64zM256 320v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32s32 14.3 32 32z"/></svg>
                        }
                      </p>
                    );
                  })}
                </div>

                <div className="whitespace-nowrap ml-4 w-1/2">
                  <p className="text-center text-lime-500 whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-2 px-4">
                    Amount
                  </p>
                  {lvlIncome.map((e, i) => {
                    return (
                      <p
                        key={i}
                        className="text-[15px] text-center whitespace-nowrap border-2 border-[rgba(89,222,240,0.16)] text-white bg-[rgba(89,222,240,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                      >
                        {e} <span className="text-[#FFE900]">BNB</span>
                      </p>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>

        {income.length > 0 ? (
          <div className="flex justify-center px-4 md:p-0 mt-8">
            <div className="md:w-3/4 w-full">
              <h1 className="font-bold text-2xl px-2 mb-2 ">
                Recent <span className="text-green-500">Income</span>
              </h1>
              <div className="overflow-auto h-52">

                <table className="table-auto w-full p-2 rounded-sm">
                  <thead className='sticky top-0'>
                    <tr>
                      <th className='px-1 py-0.5'>
                        <p className="text-center text-[#f0c259] whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[#000000] rounded-lg font-semibold p-1 px-4">
                          From
                        </p>
                      </th>
                      <th className='px-1 py-0.5'>
                        <p className="text-center text-[#f0c259] whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[#000000] rounded-lg font-semibold p-1 px-4">
                          Amount
                        </p>
                      </th>
                      <th className='px-1 py-0.5'>
                        <p className="text-center text-[#f0c259] whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[#000000] rounded-lg font-semibold p-1 px-4">
                          Rank Level
                        </p>
                      </th>
                      <th className='px-1 py-0.5'>
                        <p className="text-center text-[#f0c259] whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[#000000] rounded-lg font-semibold p-1 px-4">
                          Layer
                        </p>
                      </th>
                      <th className='px-1 py-0.5'>
                        <p className="text-center text-[#f0c259] whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] bg-[#000000] rounded-lg font-semibold p-1 px-4">
                          Time
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='px-1 py-0.5'>
                        {income.map((e, i) => {
                          return (
                            <p
                              key={i}
                              className="text-center whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-1 px-4"
                            >
                              {e.from}
                            </p>
                          );
                        })}
                      </td>
                      <td className='px-1 py-0.5'>
                        {income.map((e, i) => {
                          return (
                            <p
                              key={i}
                              className="text-center whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-1 px-4"
                            >
                              {e.amount} <span className="text-[#f0c259]">BNB</span>
                            </p>
                          );
                        })}
                      </td>
                      <td className='px-1 py-0.5'>
                        {income.map((e, i) => {
                          return (
                            <p
                              key={i}
                              className="text-center whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-1 px-4"
                            >
                              {e.level == 0
                                ? "Royalty"
                                : `${useAppState.ranks[e.level-1]}`}
                                
                            </p>
                          );
                        })}
                      </td>
                      <td className='px-1 py-0.5'>
                        {income.map((e, i) => {
                          return (
                            <p
                              key={i}
                              className="text-center whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-1 px-4"
                            >
                              {`Layer ${e.layer}`}
                            </p>
                          );
                        })}
                      </td>
                      <td className='px-1 py-0.5'>
                        {income.map((e, i) => {
                          return (
                            <p
                              key={i}
                              className="text-center whitespace-nowrap border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] rounded-lg font-semibold p-1 mt-1 px-4"
                            >
                              {useAppState.getUTCTime(e.time)}
                            </p>
                          );
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        ) : null}



 {/* Leadership */}
        <div className="flex justify-center px-4 md:p-0 mt-6">
          <div className="md:w-3/4 w-full">
            <div className="w-full flex flex-col justify-center items-center bg-white dark:bg-[#1e2026] dark:bg-opacity-40 rounded-lg shadow-lg p-4">
              <p className="border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] py-3 px-6 font-bold text-xl flex flex-col justify-center">
                <span className='w-full text-center'>Leadership Bonus</span> 
                <span className='w-full text-center'>Countdown</span>
              </p>
              {showLeadership ? (
                <div className="text-2xl mt-2 font-mono px-3 rounded-sm text-white font-bold">
                  {<MyTimerDay key={leadershipTime} expiryTimestamp={leadershipTime * 1000} />}
                </div>
              ) : null}

            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-4">
              <button
                onClick={distributeLyfestyle}
                className="text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-6 lg:px-8 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-[#f7f7f8] dark:text-black dark:hover:bg-white focus:outline-none dark:focus:ring-gray-300"
              >
                {loading ? (
                  <TailSpin height={15} color="green" />
                ) : (
                  <span className='w-full text-center font-bold'>Distribute Leadership Bonus</span>
                )}
              </button>
            </div>

            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 md:p-0 mt-4">
          <div className="md:w-3/4 w-full">
            <div className="flex justify-start items-center overflow-x-auto w-full">
              <div className="flex justify-center w-full">
                <div
                  className={`overflow-auto max-h-40 flex gap-x-4 items-start w-full px-2 rounded-sm`}
                >
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">

                      <span>{useAppState.ranks[1]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[1]}</span></span> <span className='font-bold'>{leadershipAmount[1].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[1].map((e, i) => {
                      return (
                        <p
                          key={i}
                          
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[2]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[2]}</span></span> <span className='font-bold'>{leadershipAmount[2].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[2].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>

                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[3]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[3]}</span></span> <span className='font-bold'>{leadershipAmount[3].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[3].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[4]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[4]}</span></span> <span className='font-bold'>{leadershipAmount[4].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[4].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
        
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[5]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[5]}</span></span> <span className='font-bold'>{leadershipAmount[5].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[5].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[6]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[6]}</span></span> <span className='font-bold'>{leadershipAmount[6].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[6].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[7]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[7]}</span></span> <span className='font-bold'>{leadershipAmount[7].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[7].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[8]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[8]}</span></span> <span className='font-bold'>{leadershipAmount[8].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[8].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[9]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[9]}</span></span> <span className='font-bold'>{leadershipAmount[9].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[9].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[10]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[10]}</span></span> <span className='font-bold'>{leadershipAmount[10].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[10].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[11]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[11]}</span></span> <span className='font-bold'>{leadershipAmount[11].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[11].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[12]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[12]}</span></span> <span className='font-bold'>{leadershipAmount[12].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[12].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[13]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[13]}</span></span> <span className='font-bold'>{leadershipAmount[13].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[13].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
                   <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>{useAppState.ranks[14]} <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalLeadershipUsers[14]}</span></span> <span className='font-bold'>{leadershipAmount[14].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {leadershipUsers[14].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>
          

                </div>
              </div>
            </div>
          </div>
        </div>




        {/* Royalty */}
        <div className="flex justify-center px-4 md:p-0 mt-6">
          <div className="md:w-3/4 w-full">
            <div className="w-full flex flex-col justify-center items-center bg-white dark:bg-[#1e2026] dark:bg-opacity-40 rounded-lg shadow-lg p-4">
              <p className="border-2 border-[rgba(124,240,89,0.16)] bg-[rgba(124,240,89,0.14)] py-3 px-6 font-bold text-xl flex flex-col justify-center">
                <span className='w-full text-center'>Daily Royalty</span> 
                <span className='w-full text-center'>Countdown</span>
              </p>
              {showRoyalty ? (
                <div className="text-2xl mt-2 font-mono px-3 rounded-sm text-white font-bold">
                  {<MyTimer key={roayltyTime} expiryTimestamp={roayltyTime * 1000} />}
                </div>
              ) : null}

            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-4">
              <button
                onClick={distributeRoyalty}
                className="text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-6 lg:px-8 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 dark:bg-[#f7f7f8] dark:text-black dark:hover:bg-white focus:outline-none dark:focus:ring-gray-300"
              >
                {loading ? (
                  <TailSpin height={15} color="green" />
                ) : (
                  <span className='w-full text-center font-bold'>Distribute Royalty</span>
                )}
              </button>
            </div>

            </div>
          </div>
        </div>

        <div className="flex justify-center px-4 md:p-0 mt-4">
          <div className="md:w-3/4 w-full">
            <div className="flex justify-start items-center overflow-x-auto w-full">
              <div className="flex justify-center w-full">
                <div
                  className={`overflow-auto max-h-40 flex justify-between items-start w-full px-2 rounded-sm`}
                >
                  <div className="whitespace-nowrap md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>Chairman <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalRoyaltyUsers[0]}</span></span> <span className='font-bold'>{royalty[0].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {royaltyUsers[0].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>

                  <div className="whitespace-nowrap ml-4 md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>President <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalRoyaltyUsers[1]}</span></span> <span className='font-bold'>{royalty[1].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {royaltyUsers[1].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>

                  <div className="whitespace-nowrap ml-4 md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>Millionaire <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalRoyaltyUsers[2]}</span></span> <span className='font-bold'>{royalty[2].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {royaltyUsers[2].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>

                  <div className="whitespace-nowrap ml-4 md:ml-0">
                    <p className="flex flex-col justify-center items-center whitespace-nowrap py-1 px-3 border-2 border-[rgba(240,194,89,.16)] text-white bg-[rgba(240,194,89,.14)] font-medium">
                      <span>Billionaire <span className='bg-white px-3 text-xs font-bold text-gray-800 ml-1'>{totalRoyaltyUsers[3]}</span></span> <span className='font-bold'>{royalty[3].toFixed(10)} <span className='text-[#f0c259]'>BNB</span></span>
                    </p>
                    {royaltyUsers[3].map((e, i) => {
                      return (
                        <p
                          key={i}
                          className="whitespace-nowrap border-2 border-[rgba(124,240,89,0.16)] text-white bg-[rgba(124,240,89,0.14)] rounded-lg font-semibold p-1 mt-2 px-4"
                        >
                          {e.toString()}
                        </p>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>







        <div className="flex justify-center px-4 md:p-0 mt-10 mb-4">
          <div className="md:w-3/4 w-full">
            <div className='mb-7'>
              <Socials />
            </div>
            <div className='w-full flex flex-col justify-center items-center'>
              <h4 className='font-bold'>Billionaire Contract opbnb.bscscan.com</h4>
              <a className='text-yellow-400 underline' href={`https://opbnb.bscscan.com/address/${useAppState.contractAddress}`} target='_blank'>{useAppState.contractAddress.slice(0,9)}...{useAppState.contractAddress.slice(36)}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard
