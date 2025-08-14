import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppState } from '../App'
import {useTimer} from 'react-timer-hook'

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp});

  return <p><span>{days} Days, </span><span>{hours.toString().padStart(2, '0')}</span>:<span>{minutes.toString().padStart(2, '0')}</span>:<span>{seconds.toString().padStart(2, '0')}</span></p>
}

const UserInfo = () => {
    const useAppState = useContext(AppState);
    const intervalRef = useRef();
    const [user, setUser] = useState({
      start: 0,
      level: 0,
      unblocked: true,
      directTeam: 0,
      directRequired: 0,
      directTime: 0,
      referrer: ""
    })
    const [time, setTime] = useState(0);
    const [showTimer, setShowTimer] = useState(false);

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        if(Number(user.start) > 0) {
          setTime(Date.now() - Number(user.start));
        } else {
          setTime(0);
        }
      }, 10);
      return () => clearInterval(intervalRef.current);
    }, [user.start]);

    useEffect(() => {
      async function getData() {
        if (!useAppState.staticContract) {
            return;
        }
        setShowTimer(false);

        let _user = await useAppState.staticContractStorage.userInfo(useAppState.id);
        //console.log('_user:',_user)
        setUser({
          start: Number(_user.start) * 1000,
          level: Number(_user.level),
          directTeam: Number(_user.directTeam),
          directRequired: 2,
          referrer: Number(_user.referrer)
        })
        setShowTimer(true);
      }
      getData();
    },[useAppState.walletAddress, useAppState.change, useAppState.id])

  return (
    <div className='w-full transition-colors duration-1000 flex flex-col md:flex-row justify-between bg-opacity-40 dark:bg-opacity-40 bg-white dark:bg-[#1e2026] shadow-lg p-3 rounded-sm'>
      
      <div className='flex justify-start w-full md:w-1/2'>
        <div className='flex flex-col items-start'>
          <span className='flex justify-center items-center text-sm font-medium mt-3'>User ID </span>
          <span className='flex justify-center items-center text-sm font-medium mt-3'>My Rank </span>
          <span className='flex justify-center items-center text-sm font-medium mt-3'>Referred By</span>
        </div>
        <div className='flex flex-col items-start ml-3'>
          <span className={`bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800`}>{<span>{useAppState.id}</span>}</span>
          <span className={`bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800`}>{<span>{useAppState.ranks[user.level - 1]}</span>}</span>
          <span className={`bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800`}>{user.referrer == "17534" ? "Default Refer" : <span>{user.referrer}</span>}</span>
        </div>
      </div>

      <div className='flex justify-start w-full md:w-1/2'>
        <div className='flex flex-col items-start'>
          <span className='flex justify-center items-center text-sm font-medium mt-3'>Wallet Address </span>
          <span className='flex justify-center items-center text-sm font-medium mt-3'>My Wallet Fund </span>
          {showTimer ? <span className='flex justify-center items-center text-sm font-medium mt-3'>Activation Date</span> : null}
        </div>
        <div className='flex flex-col items-start ml-3'>
          <span className={`bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800`}>{<span>{useAppState.walletAddress.slice(0,9)}...{useAppState.walletAddress.slice(36)}</span>}</span>
          <span className={`bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800`}>{<span>{Number(useAppState.bal).toFixed(5)}  TBNB</span>}</span>
          {/* {showTimer ? <span className='bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800'>{useAppState.formatTime(time)}</span> : null} */}
          <span className='bg-gray-200 mt-3 text-sm font-medium rounded-xl px-3 text-gray-800'>{useAppState.getUTCTime(user.start)}</span>
        </div>
      </div>


    </div>
  )
}

export default UserInfo