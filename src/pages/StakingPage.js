import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./StakingPage.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { ReactComponent as HanLogo } from '../images/HanLogo.svg'
import HanLogo from "../assets/images/HanLogo.svg";
import { FiRefreshCcw } from "react-icons/fi";
import Web3 from "web3";
import {
  StakingContract,
  WETHContract,
  RewardTokenContract,
  ArrakisContract,
  StakingAddress,
  StakingTokenAddress,
  StakingTokenContract,
} from "../config/StakingRakis6Config";
import { stakingAction } from "../redux/actions/stakingAction";
import { stakingCancelAction } from "../redux/actions/stakingCancelAction";
import { stakingRewardAction } from "../redux/actions/stakingRewardAction";
import { stakingViewAction } from "../redux/actions/stakingViewAction";
import BigNumber from "bignumber.js";
import { OptimismRedLogo, ArrakisBlackIcon } from "../assets/_index";
import { stakingApproveAction } from "../redux/actions/stakingApproveAction";
import { HiQuestionMarkCircle } from "react-icons/hi";
import HelpIcon from "@mui/icons-material/Help";
import { Tooltip, IconButton } from "@mui/material";

const StakingPage = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState();
  const [stakingAmount, setStakingAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [disable, setDisable] = useState(false);
  const [checkChainId, setCheckChainId] = useState("");
  const [testAmount, setTestAmount] = useState("");
  const [test, setTest] = useState("");

  const AmountBN = new BigNumber("1000000000000000000");
  const {
    getAmount,
    getRewardReleased,
    stakingTokenBalance,
    resultValue,
    getBalance,
    stakingTokenAmount,
    getWithdrawAmount,
    canAmountStake,
    successApprove,
    HanQuantityLpQuantityPerYear1HanValue,
  } = useSelector((state) => state.stakingView);

  //---------------- Optimism Network Switching ----------------
  const networks = {
    optimismTestNet: {
      chainId: `0x${Number(420).toString(16)}`,
      chainName: "Optimism Goerli",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: [
        "https://opt-goerli.g.alchemy.com/v2/2lGr3nFlynOLUsom7cnrmg-hUtq7IcrM",
      ],
      blockExplorerUrls: ["https://goerli-optimistic.etherscan.io"],
    },
    optimism: {
      chainId: `0x${Number(10).toString(16)}`,
      chainName: "Optimism",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      rpcUrls: ["https://mainnet.optimism.io"],
      blockExplorerUrls: ["https://optimistic.etherscan.io"],
    },
  };

  const changeNetwork = async ({ networkName, setError }) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName],
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectWallet = async () => {
    if (window.ethereum === undefined) {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      );
    } else {
      const account = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setAccount(account[0]);
    }
  };

  const handleNetworkSwitch = async (networkName) => {
    setError();
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
  };

  // add to LP token
  const addStakingToken = async () => {
    const tokenAddress = "0x6d8aA00034ECB1d2aD766117d7d35e1f94f18dE0";
    const tokenSymbol = "LP";
    const tokenDecimals = 18;
    const tokenImage =
      "https://github.com/sieun95/develop_note/blob/main/Arrakis%20Icon%20(monochrome).png?raw=true";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum?.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(typeof window.ethereum.chainId,"이더확인");

  // add to Reward Token
  const addRewardToken = async () => {
    const tokenAddress = "0xC7483FbDB5c03E785617a638E0f22a08da10084B";
    const tokenSymbol = "HAN";
    const tokenDecimals = 18;
    const tokenImage =
      "https://raw.githubusercontent.com/hanchain-paykhan/hanchain/3058eecc5d26f980db884f1318da6c4de18a7aea/logo/logo.svg";

    try {
      const wasAdded = await window.ethereum?.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.ethereum?.on("chainChanged", networkChanged);

    return () => {
      window.ethereum?.removeListener("chainChanged", networkChanged);
    };
  }, []);

  const setup = useCallback(async () => {
    const account = await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
    const web3Instance = new Web3(window.ethereum);
    setWeb3(web3Instance);
    setAccount(account[0]);
  });

  useEffect(() => {
    setup();
    window.ethereum?.on("accountsChanged", () => {
      setup();
    });
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum?.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum?.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  useEffect(() => {
    if (window.ethereum?.chainId === "0xa") {
      setCheckChainId("Oxa");
    }
  }, [window.ethereum?.chainId]);

  const staking = () => {
    let stakingAmountSet = document.getElementById("maxStakeAmount").value;
    const stakingnum = AmountBN.multipliedBy(new BigNumber(stakingAmountSet));
    dispatch(stakingAction.stakingAct(account, stakingnum));
  };

  const Approve = () => {
    let stakingAmountSet = document.getElementById("maxStakeAmount").value;
    const stakingnum = AmountBN.multipliedBy(new BigNumber(stakingAmountSet));
    dispatch(stakingApproveAction.stakingApproveAct(account, stakingnum));
  };

  const unStaking = () => {
    let unstakingAmountSet = document.getElementById("maxUnstakeAmount").value;
    const unstakingnum = AmountBN.multipliedBy(
      new BigNumber(unstakingAmountSet)
    );
    dispatch(stakingCancelAction.stakingCancelAct(account, unstakingnum));
  };

  const rewardClaim = () => {
    dispatch(stakingRewardAction.stakingRewardAct(account));
  };

  const changeState = () => {
    dispatch(stakingViewAction.stakingViewAct(account));
  };

  const changeStakingAmount = (e) => {
    const pattern = /^(\d{0,4}([.]\d{0,14})?)?$/;
    if (pattern.test(e.target.value)) {
      setStakingAmount(e.target.value);
    }
  };

  const changeWithdrawAmount = (e) => {
    const pattern = /^(\d{0,4}([.]\d{0,14})?)?$/;
    if (pattern.test(e.target.value)) {
      setWithdrawAmount(e.target.value);
    }
  };

  const changeMaxDepositAmount = () => {
    setStakingAmount(stakingTokenAmount);
  };

  const changeMaxWithdrawAmount = () => {
    setWithdrawAmount(getWithdrawAmount);
  };

  useEffect(() => {
    dispatch(stakingViewAction.stakingViewAct(account));
  }, [account]);


  return (
    <div className="stakingPageContainer">
      <div className="stakingPageHanLogoContainer">
        <img className="stakingHanLogo" src={HanLogo} alt="HanLogo" />
        <a>STAKING</a>
      </div>
      <div className="stakingAllAmountContainer">
        <div className="stakingAprAmountContainer">
          <div className="stakingAprAmountTitle">
            <div className="stakingAprAmountTxt">
              <a>APR</a>
            </div>
            <div className="tooltip-container">
              <i className="info-icon material-icons">
                <HelpIcon />
              </i>
              <div className="tooltip-content">
                <span>
                  APR displayed is not historical statistics. According to the
                  LP token quantity standard that fluctuates with the HAN weight
                  of the POOL, when staking at the present time, APR is the
                  annual interest rate of the amount of HAN to be obtained
                  against the liquidity supplied.
                </span>
                <span className="align-right">
                  {" "}
                  <a
                    href="https://medium.com/@HanIdentity/hanchain-x-optimism-x-uniswap-v3-x-arrakis-af564de80f81"
                    target="_blank"
                  >
                    Read More
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="stakingAprAmountNum">
            <a>{HanQuantityLpQuantityPerYear1HanValue}%</a>
          </div>
        </div>
      </div>

      <Tabs className="Tabs">
        <div className="stakedCanAmountSection">
          <p>STAKED : {getAmount}</p>
        </div>
        <div className="stakingCanAmountSection">
          <p>Available Quota : {canAmountStake}</p>
        </div>
        {account === "" ? (
          <div className="connectWalletSection">
            <img
              width="30px"
              height="30px"
              src="https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg"
            />
            <button onClick={handleConnectWallet}>Connect Wallet</button>
          </div>
        ) : checkChainId === "Oxa" ? (
          <div className="connectWalletComSection">
            <img width="30px" height="30px" src={OptimismRedLogo} />
            <button disabled={true}>
              {account.substr(0, 6)}...{account.slice(-6)}
            </button>
          </div>
        ) : (
          <div className="connectWalletComSection">
            <img
              width="30px"
              height="30px"
              src="https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880"
            />
            <button disabled={true}>
              {account.substr(0, 6)}...{account.slice(-6)}
            </button>
          </div>
        )}
        <TabList>
          <Tab>DEPOSIT</Tab>
          <Tab>REWARDS</Tab>
          <Tab>WITHDRAW</Tab>
        </TabList>
        <TabPanel>
          <div className="stakingTokenBalanceSection">
            <p>Available : {stakingTokenBalance}</p>
          </div>
          {stakingAmount === "" ? (
            <>
              <div className="depositAmountSection">
                <input
                  type="number"
                  step="0.000000000000001"
                  id="maxStakeAmount"
                  placeholder="0"
                  onChange={changeStakingAmount}
                  value={stakingAmount}
                ></input>
                <p className="amountTxt">RAKIS-6</p>
                <button
                  className="amountMaxBtn"
                  onClick={changeMaxDepositAmount}
                >
                  Max
                </button>
              </div>
              <div className="depositStakeBtnSection">
                <button className="enter-learn-more">ENTER AMOUNT</button>
              </div>
            </>
          ) : stakingTokenBalance === "0" ||
            stakingAmount > stakingTokenBalance ? (
            <>
              <div className="depositAmountSection">
                <input
                  type="number"
                  step="0.00000000000001"
                  id="maxStakeAmount"
                  placeholder="0"
                  onChange={changeStakingAmount}
                  value={stakingAmount}
                ></input>
                <p className="amountTxt">RAKIS-6</p>
                <button
                  className="amountMaxBtn"
                  onClick={changeMaxDepositAmount}
                >
                  Max
                </button>
              </div>
              <div className="depositStakeBtnSection">
                <button className="cant-learn-more" disabled={true}>
                  INSUFFICIENT RAKIS-6 BALANCE
                </button>
              </div>
            </>
          ) : successApprove === false ? (
            <>
              <div className="depositAmountSection">
                <input
                  type="number"
                  step="0.00000000000001"
                  id="maxStakeAmount"
                  placeholder="0"
                  onChange={changeStakingAmount}
                  value={stakingAmount}
                ></input>
                <p className="amountTxt">RAKIS-6</p>
                <button
                  className="amountMaxBtn"
                  onClick={changeMaxDepositAmount}
                >
                  Max
                </button>
              </div>
              <div className="depositStakeBtnSection">
                <button className="learn-more" onClick={Approve}>
                  APPROVE
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="depositAmountSection">
                <input
                  type="number"
                  step="0.00000000000001"
                  id="maxStakeAmount"
                  placeholder="0"
                  // onChange={changeStakingAmount}
                  value={stakingAmount}
                ></input>
                <p className="amountTxt">RAKIS-6</p>
                <button
                  className="amountMaxBtn"
                  onClick={changeMaxDepositAmount}
                >
                  Max
                </button>
              </div>
              <div className="depositStakeBtnSection">
                <button className="learn-more" onClick={staking}>
                  STAKE
                </button>
              </div>
            </>
          )}
        </TabPanel>
        <TabPanel className="allTokenRewardsContainer">
          <div className="allRewardsCumulativeSection">
            <p>
              Estimated Interest : {resultValue}
              <FiRefreshCcw
                className="allRefreshClaimIcon"
                onClick={changeState}
              />
              HAN
            </p>
          </div>
          <div className="amountTokenRewardAccSection">
            <p>Accumulated Interest : {getBalance} HAN</p>
          </div>
          <div className="amountTokenRewardTxtSection">
            <p>Rewarded Interest : {getRewardReleased} HAN </p>
          </div>
          <div className="rewardsClaimBtnSection">
            {resultValue + getBalance <= 0 ? (
              <button className="cant-learn-more" disabled={true}>
                NOTHING TO CLAIM
              </button>
            ) : (
              <button className="learn-more" onClick={rewardClaim}>
                CLAIM
              </button>
            )}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="withdrawAmountSection">
            <input
              type="number"
              step="0.00000000000001"
              id="maxUnstakeAmount"
              placeholder="0"
              onChange={changeWithdrawAmount}
              value={withdrawAmount}
            ></input>
            <p className="amountTxt">RAKIS-6</p>
            <button className="amountMaxBtn" onClick={changeMaxWithdrawAmount}>
              Max
            </button>
          </div>
          <div className="withdrawUnstakeBtnSection">
            {withdrawAmount === "" ? (
              <div className="unStakeBtnSection">
                <button className="enter-learn-more">ENTER AMOUNT</button>
              </div>
            ) : getAmount === 0 || withdrawAmount > getAmount ? (
              <div className="unStakeCantBtnSection">
                <button className="cant-learn-more" disabled={true}>
                  INSUFFICIENT RAKIS-6 BALANCE
                </button>
              </div>
            ) : (
              <div className="unStakeBtnSection">
                <button className="learn-more" onClick={unStaking}>
                  UNSTAKE
                </button>
              </div>
            )}
          </div>
        </TabPanel>
        <div className="logoContainer">
          <img
            src={OptimismRedLogo}
            onClick={() => handleNetworkSwitch("optimism")}
            className="opIcon"
          />
          <img
            src={ArrakisBlackIcon}
            onClick={addStakingToken}
            className="arrakisIcon"
          />
          <img src={HanLogo} onClick={addRewardToken} className="hanIcon" />
        </div>
      </Tabs>
    </div>
  );
};

export default StakingPage;
