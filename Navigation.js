import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {
    const location = useLocation();

  return (    
    <div className='flex items-center justify-between w-full overflow-x-auto'>
        <Link to={'/dashboard'} className='md:w-1/4 min-w-[110px]'><div className={`${location.pathname == '/dashboard' ? "bg-[#FFE900] text-black" : "bg-gray-200 text-black"} w-full text-center shadow-md p-3 font-semibold text-sm rounded-lg  hover:bg-[#FFE900] hover:text-black`}>Dashboard</div></Link>
        <Link to={'/team'} className='md:w-1/4 min-w-[110px] ml-4'><div className={`${location.pathname == '/team' ? "bg-[#FFE900] text-black" : "bg-gray-200 text-black"} w-full text-center shadow-md p-3 font-semibold text-sm rounded-lg  hover:bg-[#FFE900] hover:text-black`}>Referrals</div></Link>  
        <Link to={'/matrix'} className='md:w-1/4 min-w-[110px] ml-4'><div className={`${location.pathname == '/matrix' ? "bg-[#FFE900] text-black" : "bg-gray-200 text-black"} w-full text-center shadow-md p-3 font-semibold text-sm rounded-lg  hover:bg-[#FFE900] hover:text-black`}>Community</div></Link>  
        <Link to={'/downline'} className='md:w-1/4 min-w-[110px] ml-4'><div className={`${location.pathname == '/downline' ? "bg-[#FFE900] text-black" : "bg-gray-200 text-black"} w-full text-center shadow-md p-3 font-semibold text-sm rounded-lg  hover:bg-[#FFE900] hover:text-black`}>Organization</div></Link>  
    </div>
  )
}

export default Navigation