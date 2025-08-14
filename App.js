import { useState, createContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import Billionaire from './artifacts/contracts/Billionaire.sol/Billionaire.json';
import BillionaireStorage from './artifacts/contracts/Billionaire.sol/BillionaireStorage.json';
import { message } from 'antd';
import Teams from './components/Teams';
import BinaryTree from './components/BinaryTree';
import Downline from './components/Downline';
import Test from './components/Test';

import { BrowserProvider, Contract, ethers } from 'ethers';
import { createAppKit,useAppKit,useAppKitProvider, useAppKitAccount,useDisconnect } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

import { opBNB } from '@reown/appkit/networks';
import {opBNBTestnet} from '@reown/appkit/networks';

/*import { bscTestnet } from '@reown/appkit/networks';
const projectId ='5a38f77861b7ce8119ac054303e8c397'; //billionaire.run
const contractAddress = "0x1887Cb59F5ab9Cff4943147838C0791596AD12ab"; // tesnet bsc
const contractStorageAddress = "0x45406912a492658AcB729f8EEDa051391999fbA5";  //testnet bsc
const networks = [bscTestnet];
const metadata = {
  name: 'Billionaire',
  description: "Let's build your future together!",
  url: 'https://www.billionaire.run', // origin must match your domain & subdomain
  icons: ['https://www.billionaire.run/logo.png']
}*/

const projectId ='16855a7e4cb34f83282204ef5c44999c'; //billionaireai.club

//const projectId ='5a38f77861b7ce8119ac054303e8c397'; //billionaire.run
//const projectId = 'c1d370d834beb0c0f88806012363b014';  //billionaire100.com
//const contractAddress = "0x8aFfF2b4B14D3629A98F109DAC9162f6094F789F";  // BSC
//const contractStorageAddress = "0x42f3F6Fa5C350145951CA344E92F892Cd70477A9";  // BSC

//const contractAddress = "0xCfDE7106C59cCaFEa49CE92AA18Bd91376b34364";  // OPBNB
//const contractStorageAddress = "0x3Bbc93E529Fa391600d2Daa472B407b608622236";  // OPBNB

const contractAddress = "0x23F93eE0fFdce042935D3CaE126A075284D4775C";  // OPBNB-testnet
const contractStorageAddress = "0x1d621337122aF5B73852843E43E4a97685031Deb";  // OPBNB-testnet
//  0x62aE59E349Ee5176a22F305191b641f33282A490


const networks = [opBNB];
const metadata = {
  name: 'Billionaire',
  description: "Let's build your future together!",
  url: 'https://www.billionaireai.club', // origin must match your domain & subdomain
  icons: ['https://www.billionaireai.club/logo.png']
}

const ranks = ["Associate", "Coordinator", "Executive", "Specialist", "Administrator", "Supervisor","Leader", "Manager", "Commander", "Director",   "Governor", "Chairman", "President", "Millionaire", "Billionaire"];


//5a38f77861b7ce8119ac054303e8c397
//const networks = [bscTestnet];

createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId
})

const AppState = createContext();


function App() {
  const navigate = useNavigate();

  // State hooks
  const [theme, setTheme] = useState('dark');
  const [walletAddress, setWalletAddress] = useState('');
  const [id, setId] = useState(0);
  const [shown, setShown] = useState(false);
  const [bal, setBal] = useState(0);
  const [bal2, setBal2] = useState(0);
  const [bal3, setBal3] = useState(0);
  const [levels, setLevels] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [percent, setPercent] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState(0);
  const [staticContract, setStaticContract] = useState();
  const [staticContractStorage, setStaticContractStorage] = useState();
  const [ref, setRef] = useState('');
  const [termsConditions, setTermsConditions] = useState(false);

  let provider, signer;

  const modal = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155')
  const { disconnect } = useDisconnect();

  const disconnectwallet =  () => {
     disconnect();
     setTermsConditions(false);
     navigate('/');
  }

  // useEffect(() => {
  //   console.log('Is Connected:', isConnected);
  //   console.log('Wallet Address:', address);
  // }, [isConnected, address]);
  
  useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const refValue = queryParams.get("ref");

      if (refValue) {
          console.log(`Ref parameter found: ${refValue}`);
          if (validateRef(refValue)) {
              //console.log("Ref is valid. Proceeding with login...");
              setRef(refValue);
              //Login(); // Call the login function with the valid refValue
          } else {
              console.error("Invalid ref value:", refValue);
              message.error("Invalid referral ID provided.");
          }
      }
  }, []);

  useEffect(() => {
      if (ref) {
          //console.log("State updated with ref:", ref);
          Login(); // Call Login using the updated state
      }
  }, [ref]);

  const validateRef = (ref) => {
      // Ensure "ref" is a non-empty numeric string and within a specific range (example)
      const isNumeric = /^\d+$/.test(ref); // Regex to check if ref is numeric
      const isValidLength = ref.length > 0 && ref.length <= 10; // Example: Length check
      return isNumeric && isValidLength;
  };

  // Get Ethereum provider and signer
  const getProvider = async () => {
    if (!isConnected) throw Error('User disconnected')
    provider = new BrowserProvider(walletProvider);
    signer = await provider.getSigner();
  };

  // Get Contract instances
  const getContract = async () => {
    await getProvider();
    // return new ethers.Contract(contractAddress, Billionaire.abi, signer);
    return new Contract(contractAddress, Billionaire.abi, signer);
  };

  const getContractStorage = async () => {
    await getProvider();
    // return new ethers.Contract(contractAddress, Billionaire.abi, signer);
    return new Contract(contractStorageAddress, BillionaireStorage.abi, signer);
  };

  

  // Handle Theme Toggle
  const toggle = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Fetch user wallet address and contract data
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Fetch contract levels, user id and balances
  useEffect(() => {
    const fetchLevelsAndBalances = async () => {
      try {
        if (isConnected) {
          await getProvider();
          const contract = await getContract();
          const contractStorage = await getContractStorage();
              
          // Fetch the levels and percents
          const _lvl = await contract.getLevels();
          
          // console.log("Levels response:", _lvl); // Check the output
          setLevels([0])
          for(let i=0; i<_lvl[0].length; i++) {
            setLevels((prev) => [...prev, Number(ethers.formatEther(_lvl[0][i]))]);
          }
          setPercent([0]);
          for(let i=0; i<_lvl[1].length; i++) {
            setPercent((prev) => [...prev, Number(_lvl[1][i])]);
          }

          // Fetch user balances and id
          //const userId = await contract.id(walletAddress);
          const userId = await contractStorage.id(walletAddress);
          
          setId(Number(userId));

          const _bal = await provider.getBalance(walletAddress);
        
          setBal(ethers.formatEther(_bal));
       
          setLoaded(true);
          
        }else{
          console.log('Please install MetaMask to interact with the contract.');
          message.error("Please install MetaMask to interact with the contract.");
        }
    
        
      } catch (error) {
        console.error("Error fetching contract data:", error);
        message.error("Failed to fetch contract data. Please check your contract and connection.");
        
      }
    };
    
  
    if (isConnected) {
      fetchLevelsAndBalances();
    }

  }, [walletAddress, change]);

  const TermCondition = async () => {
    setTermsConditions(true);
  }
   
  // Login function
  const Login = async () => {
    try {
      if (!isConnected) {
        try {
          await modal.open();  // qua fa la connessione ....
        } catch (err) {
          message.error("Error opening wallet modal");
          console.error("Error opening wallet modal:", err);
        }
      }

      if (isConnected){
        if (address) {
          console.log("Wallet Address: ", address);
          //message.success("Wallet Address: ", address);
        } else {
          console.error("Address not found. Ensure wallet is connected.");
          message.error("Address not found. Ensure wallet is connected.");
        }

        setWalletAddress(address);

        const contract = await getContract();
        const contractStorage = await getContractStorage();
        setStaticContract(contract);
        setStaticContractStorage(contractStorage);

        if(termsConditions){
          //const userId = await contract.id(address);
          const userId = await contractStorage.id(address);
          setId(Number(userId));
          
            if (userId == 0) {
              console.log('User Not Registered');
              message.error("User Not Registered");
              if (!ref || ref.trim() === "") {
                  message.error("Referred ID Missing");
                  return;
              }
          
              try {
                setLoading(true);
                console.log("Attempting registration...");
                message.error("Attempting registration...");
                
                // Convert BNB amount to wei (for value, not gas price)
                /*const bnbAmount = 0.09; // BNB amount (transaction value)
                const weiAmount = ethers.parseUnits(bnbAmount.toString(), "ether");
                console.log("Transaction value in wei:", weiAmount.toString()); // Outputs: "430000000000000"
                */
                const _lvl = await contract.getLevels();
                const weiAmount = _lvl[0][0]; //Number(ethers.formatEther(_lvl[0][0]));
                console.log("bnb valore:", weiAmount.toString());
              



            
                // Transaction execution
                const tx = await contract.register(ref, address, {
                    gasLimit: 9000000, // Add buffer to avoid edge case failures
                    value: weiAmount, // Add BNB amount to the transaction if required
                });
            
                console.log("Transaction sent. TX Hash:", tx.hash);
            
                // Wait for transaction confirmation
                const receipt = await tx.wait();
                console.log("Transaction successful. Receipt:", receipt);
            
                // Fetch User ID and update state
                console.log("Fetching User ID...");
                const userId = await contractStorage.id(address);
                setId(Number(userId));
                message.success("Sucessfully Registered");
                message.success("Redirecting to dashboard...");
                console.log("Redirecting to dashboard...");
                setLoading(false);
                navigate("/dashboard");
              } catch (error) {
                  setLoading(false);
                  console.error("An error occurred during registration:", error);
              
                  // Show appropriate error message
                  if (error.code === "INSUFFICIENT_FUNDS") {
                      message.error("Insufficient funds for gas or transaction value.");
                  } else if (error.code === "CALL_EXCEPTION") {
                      message.error("Transaction failed. Please check the Referrer id in the link");
                  }
                  else {
                      message.error("An error occurred. Please try again later.");
                  }
              }
          
            } else {
                //console.log('User already registered. Redirecting to dashboard...');
                navigate('/dashboard');
            }
        }

      }
 
    } catch (error) {
      message.error("Install Web3 Wallet");
    }
  };

  // Format Time
  const formatTime = (time) => {
    const sec = Math.floor((time / 1000) % 60);
    const min = Math.floor((time / 60000) % 60);
    const hr = Math.floor((time / 3600000) % 24);
    const days = Math.floor(time / 86400000);
    return `${days.toString().padStart(2, '0')} Days, ${hr.toString().padStart(2, '0')} : ${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
  };

  const convert = (val) => {
    return Number(ethers.formatEther(val));
  }

  // Get UTC Time
  const getUTCTime = (ms) => {
    const now = new Date(ms);
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} UTC`;
  };
  

  return (
    <AppState.Provider value={{
      formatTime,
      getUTCTime,
      convert,
      loaded,
      loading,
      setLoading,
      bal,
      bal2,
      bal3,
      id,
      navigate,
      percent,
      levels,
      ranks,
      toggle,
      getContract,
      setStaticContract,
      setStaticContractStorage,
      shown, 
      setShown, 
      theme,
      Login,
      walletAddress,
      change,
      setChange,
      staticContract,
      staticContractStorage,
      contractAddress,
      contractStorageAddress,
      disconnectwallet,
      isConnected,
      termsConditions,
      TermCondition
    }}>
      <div className={theme}>
        <div className="App">
          <Routes>
            <Route path='*' element={<Homepage />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/team' element={<Teams />} />
            <Route path='/matrix' element={<BinaryTree />} />
            <Route path='/downline' element={<Downline />} />
            <Route path='/test' element={<Test />} />
          </Routes>
        </div>
      </div>
    </AppState.Provider>
  );
}

export default App;
export { AppState };
