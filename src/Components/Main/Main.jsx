import React, {useState, useEffect} from "react";
import "./main.css"
import { ethers } from 'ethers';
import Web3 from "web3";
import ContractAbi from "../../contracts/weth.json";

const Main = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [error, setError] = useState("");
    const [net, setNet] = useState(0)
    
    const checkWalletConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Metamask not detected");
            return;
        } else {
            console.log("Wallet exists")
        }
        const accounts = await ethereum.request({method: "eth_accounts"});
        const networkId = await ethereum.request({
            method: "net_version",
          });
          if (networkId !== 4) {
              console.log("Wrong chain");
              return
          } else {
              console.log("Correct chain")
          }
        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found account");
            setCurrentAccount(account);
        } else {
            console.log("No authorised account");
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;
    
        if (!ethereum) {
          alert("Please install Metamask!");
        }
    
        try {
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
          const networkId = await ethereum.request({
            method: "net_version",
          });
          setNet(networkId)
          if (networkId != 4) {
              setError("You are on the wrong chain, please change to Rinkeby Testnet");
              console.log("bruh", networkId)
              return;
          }
          console.log("Found an account! Address: ", accounts[0]);
          setCurrentAccount(accounts[0]);
          setError("")
        } catch (err) {
          console.log(err)
          
        }
      }
    
      const connectWalletButton = () => {
        return (
          <button onClick={connectWalletHandler} className='btn'>
            Connect Wallet
          </button>
        )
      }

      const hasError = () => {
          return (
              <>
                <button onClick={connectWalletHandler} className='btn'>
                    Connect Wallet
                </button>
                <p color="red">{error}</p>
              </>
          )
      }

      const interact = () => {
        const web3 = new Web3(window.ethereum);
        const contract = web3.eth.Contract(ContractAbi, "0xc778417E063141139Fce010982780140Aa0cD5Ab");
        let a = contract.methods.name().call();
        console.log(a);
      }

      const connected = () => {
          return (
              <>
              <div className="btnCont">
              <Disconnect />
              <Delegate />
              </div>
              
              <p>Connected as : {currentAccount}</p>
              </>
          )
      }
      
      const Disconnect = () => {
          return (
          <button onClick={() => {
              setCurrentAccount(null);
          }} className="btn">Disconnect</button>
          )
      }

      const Delegate = () => {
          return (
           
                <button onClick={interact} className="btn">Approve your weth</button>
                )
          
      }



      useEffect(() => {
        checkWalletConnected();
      }, [net])

    return (
        <>
            <h1>Delegate your WETH</h1>
            {currentAccount !== null ? connected() : connectWalletButton() }
            {error === "" ? null: <p style={{color: "red"}}>{error}</p>}
            
        </>
    )
}

export default Main;