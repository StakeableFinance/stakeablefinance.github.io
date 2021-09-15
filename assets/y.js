
// main.js

var bscconnected=false
var bscaddress="0x"
var balance=0;
var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org:443') );
var tokenAddress="0x5eC2A778717Cf1A5018C6aE3A7A2957582A92007";
var liquidityAddress="0xAf52520dD1f9a9302Fb9ea1B60532350AC1b5829"

var dailyApy = 540
var bonusApy = 330

var totalSupply = 0
var tokenPrice = 0
var unlockedAmount = 0
var lockedYield = 0
var lockedAmount = 0
var lockedUntil = 0
var lockedTotal = 0

var stakedValues = []
var pools = [7, 30, 60, 90, 180, 360]
var yields = []

$(document).ready(function() {
    $('.unlockedAmount').animateNumbers(parseInt(unlockedAmount))
    for (var i = 0; i<pools.length; i++) {
        yields.push(((1+(1/dailyApy * (pools[i]/bonusApy+1)))**pools[i]-1))
        $('.pool'+(i+1)+'final').animateNumbers(parseInt(unlockedAmount)+parseInt(yields[i]*unlockedAmount));
    }
    updateYield()
    setTokenPrice()
    detectChainId ()
    
    if(window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      console.log(window.ethereum.autoRefreshOnNetworkChange);
    }
})

async function detectChainId () {
  const provider = await detectEthereumProvider()
  if (provider) {
    const chainidnetwork = await provider.request({
      method: 'eth_chainId'
    })
    // let chainidnetwork = window.ethereum.chainId;
    console.log(window.ethereum.autoRefreshOnNetworkChange);
    console.log(chainidnetwork);
    let networkHtmlready = document.getElementById('networkHtml');
    let networkHtmlreadyContainer = document.getElementById('networkContainer');
    
    switch(chainidnetwork) {
      case "0x1":
        networkHtmlready.innerHTML = 'Wrong Network: Ethereum Main Network (Mainnet)'
      break;
      case "0x3":
        networkHtmlready.innerHTML = 'Wrong Network: Ropsten Test Network'
      break;
      case "0x4":
        networkHtmlready.innerHTML = 'Wrong Network: Rinkeby Test Network'
      break;
      case "0x5":
        networkHtmlready.innerHTML = 'Wrong Network: Goerli Test Network'
      break;
      case "0x2a":
        networkHtmlready.innerHTML = 'Wrong Network: Kovan Test Network'
      break;
      case "0x38":
        networkHtmlready.innerHTML = 'Binance Smart Chain (Mainnet)'
        networkHtmlreadyContainer.style.backgroundColor = '#1ebd09'
      break;
      case "0x61":
        networkHtmlready.innerHTML = 'Wrong Network: Binance Smart Chain (Testnet)'
      break;
      default:
        networkHtmlready.innerHTML = 'Wrong Network: Other Network'
    }
  } else {
    document.getElementById('networkHtml').innerHTML = 'Please install MetaMask to use this dApp!'
  }
}


var tokenABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_bonusApy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_dailyApy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_distAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_liquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"clearETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"distribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"lockedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lockedTotal","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"lockedUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"lockedYield","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"}],"name":"register","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setBonusApy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setDailyApy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setDistAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"liquidityFee","type":"uint256"}],"name":"setLiquidityFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxPercent","type":"uint256"}],"name":"setMaxTxPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setSupply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"until","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"unlockedAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"unwhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"whitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
var liquidityABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]

function days(num) {
    return parseInt(Date.now()/1000 + num*24*60*60)
}


function updateYield(){
	pools.forEach(function(pool, i) {
        $('.pool'+(i+1)+'apy').animateNumbers((((1+yields[i])**(365/pools[i])-1)*100).toFixed(2)+'%');
        $('.pool'+(i+1)+'yield').animateNumbers((yields[i]*100).toFixed(2)+'%');
        // $('.pool'+i+1+'bonus').animateNumbers(((((1+(1/dailyApy * (pools[i]/bonusApy+1)))**pools[i]-1) / ((1+(1/dailyApy))**pools[i]) -1)*100).toFixed(2)+'%');
        // console.log(pools[i], (((1+(1/dailyApy * (pools[i]/bonusApy+1)))**pools[i]-1)*100).toFixed(2)+'%', ((((1+(1/dailyApy * (pools[i]/bonusApy+1)))**pools[i]-1) / ((1+(1/dailyApy))**pools[i]-1) -1)*100).toFixed(2)+'%')
    })
}

async function disconnectWeb3() {
  Swal.fire({
    text: "Please disconnect the existing accounts like this",
    imageUrl: 'https://miro.medium.com/max/361/1*liAKaIo6rGId_w9Zg0SIQA.png',
    imageHeight: 400,
    imageAlt: 'Disconnect',
    
  })
}

// general listener for account change
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if(!accounts.length) {
  
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'info',
        title: 'Wallet is disconnected now'
      })
      
      $('body').removeClass('web3');
      $('.farm-btn').removeClass('notActive'); 
      bscconnected = false;

      //BURAYI TEKRAR INCELE
      $('.unlockedAmount').animateNumbers(0)

      pools.forEach(function(pool, i) {
          $('.pool'+(i+1)+'final').animateNumbers(0);
      })
    }
    // console.log('accountsChanges',accounts);
    if(bscconnected) {
      bscaddress = accounts[0];
      setBalances();
      document.getElementById('walletaddress').innerText = bscaddress;
    }
  })
}

// DEPRECATED
// window.ethereum.on('networkChanged', function(networkId){
//   console.log(networkId);
// });


// general listener for network changes
if (window.ethereum) {
  window.ethereum.on('chainChanged', (chainId) => {
    window.ethereum.autoRefreshOnNetworkChange = false;
    console.log(window.ethereum.autoRefreshOnNetworkChange);
    console.log(chainId) // 0x38 if it's BSC
    let networkHtml = document.getElementById('networkHtml');
    let networkHtmlContainer = document.getElementById('networkContainer');
  
    switch(chainId) {
      case "0x1":
        networkHtml.innerHTML = 'Wrong Network: Ethereum Main Network (Mainnet)'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
      break;
      case "0x3":
        networkHtml.innerHTML = 'Wrong Network: Ropsten Test Network'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
      break;
      case "0x4":
        networkHtml.innerHTML = 'Wrong Network: Rinkeby Test Network'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
      break;
      case "0x5":
        networkHtml.innerHTML = 'Wrong Network: Goerli Test Network'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
      break;
      case "0x2a":
        networkHtml.innerHTML = 'Wrong Network: Kovan Test Network'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
      break;
      case "0x38":
        networkHtml.innerHTML = 'Binance Smart Chain (Mainnet)'
        networkHtmlContainer.style.backgroundColor = '#1ebd09';
      break;
      case "0x61":
        networkHtml.innerHTML = 'Wrong Network: Binance Smart Chain (Testnet)'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
      break;
      default:
        networkHtml.innerHTML = 'Wrong Network: Other Network'
        networkHtmlContainer.style.backgroundColor = '#ff001d';
    }
  
    //if network is not BSC then
    
    if(bscconnected){
      if (chainId != "0x38") {
        $('body').removeClass('web3')
        $('.farm-btn').addClass('notActive'); 
        setBalances();
        
      } else {
        $('body').addClass('web3');
        $('.farm-btn').removeClass('notActive'); 
        setBalances();
      } 
    } 
  })
}

async function connectWeb3(){
  
  if (window.ethereum) {
    if (window.ethereum.chainId != "0x38") {
        params = [{
          chainId: '0x38',
          chainName: 'Binance Smart Chain Mainnet',
          nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
          },
          rpcUrls: ['https://bsc-dataseed1.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com/']
        }]

        window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params
        }).then(()=>{
          window.ethereum.on('chainChanged', (chainId) => {
            window.ethereum.autoRefreshOnNetworkChange = false;
            console.log(chainId) // 0x38 if it's BSC
            if (chainId != "0x38") {
                return chainId
            }
            if(!bscconnected) {
              connectWeb3Account();  
            } else {
              setBalances();
            }
          })
        }).catch((error)=>{
          if (error.code == "-32002") {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            
            Toast.fire({
              icon: 'warning',
              title: "Request already pending, please click Metamask icon on browser tool bar and confirm switching in order to continue."
            })
          } else {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })
            Toast.fire({
              icon: 'warning',
              title: error.message
            })
            console.log("Error", error.message);
          }
        });
    } 
    
    await connectWeb3Account()
    
      
  } else {
      const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
      Toast.fire({
        icon: 'warning',
        title: 'No provider was found'
      })
      return;
  }
}

async function connectWeb3Account(){
  try {
    window.web3 = new Web3(window.ethereum);
    // conn = await window.ethereum.enable(); //DEPRECATED
    conn = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(conn);
    bscconnected=conn.length>0
    if(bscconnected){
        bscaddress=conn[0]
        document.getElementById('walletaddress').innerText = bscaddress;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'Connected'
          })
      }
      web3.eth.getAccounts()
      updateConnectStatus()

      setBalances()
      return true;
  } catch (e) {
      if (e.code == 4001) {
        const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
        Toast.fire({
          icon: 'warning',
          title: 'User rejected the request'
        })
      } else console.log(e)
  }
}

function updateConnectStatus(){
	if(bscconnected){
		$('body').addClass('web3')
	}
}

function setSupply(){
    var contract = new web3.eth.Contract(tokenABI, tokenAddress);

    contract.methods.lockedTotal().call( function(error, result){
        lockedTotal = result/1e9

        contract.methods.totalSupply().call( function(error, result){
            setTimeout(function() {
                totalSupply = result/1e9
                $('.supply').animateNumbers(parseInt(totalSupply))
                $('.mcap').animateNumbers('$'+parseInt(totalSupply*tokenPrice))
                $('.valuestaked').animateNumbers('$'+parseInt(lockedTotal*tokenPrice))
            }, 0)
        });
	});
}

async function setBalances(){
	var contract = new web3.eth.Contract(tokenABI, tokenAddress);
	
    contract.methods.unlockedAmount(bscaddress).call( function(error, result){
        if (!result) result = 0
        unlockedAmount = new Decimal(result).dividedBy(1e9)
        $('.unlockedAmount').animateNumbers(parseInt(unlockedAmount))

        pools.forEach(function(pool, i) {
            $('.pool'+(i+1)+'final').animateNumbers(parseInt(unlockedAmount)+parseInt(yields[i]*unlockedAmount));
        })
	});

    contract.methods.lockedYield(bscaddress).call( function(error, result){
        if (!result) result = 0
        lockedYield = new Decimal(result).dividedBy(1e9)
        $('.lockedYield').animateNumbers(parseInt(lockedYield))
	});

    contract.methods.lockedAmount(bscaddress).call( function(error, result){
        if (!result) result = 0
        lockedAmount = new Decimal(result).dividedBy(1e9)
        $('.lockedAmount').animateNumbers(parseInt(lockedAmount))

        contract.methods.lockedUntil(bscaddress).call( function(error, result){
            if (!result) result = 0
            lockedUntil = parseInt(result)
            if (lockedUntil && lockedAmount.toNumber()) {
                $('.lockedUntil').text(new Date(lockedUntil*1000).toLocaleDateString('en-UK'))
    
                if (lockedUntil < Date.now()/1000) {
                    $('.unstake').removeClass('d-none')
                }
            } else {
                $('.lockedUntil').text('NaN')
            }
        });
	});
}

function stake(until) {
    if (!bscconnected) {
        Swal.fire({
            // title: 'Are you sure?',
            text: "Please connect your wallet, then try again.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#1ebd09',
            cancelButtonColor: '#adafbc',
            confirmButtonText: 'Connect to Wallet'
          }).then((result) => {
            if (result.isConfirmed) {
                connectWeb3()
            }
          })
        // alert('Please connect your wallet, then try again.')
        // connectWeb3()
        return
    }

    var contract = new web3.eth.Contract(tokenABI, tokenAddress);
    var now = Date.now()/1000
    var days = Math.floor((until-now)/60/60/24)
    
    // if (confirm('You will stake '+unlockedAmount+' of your STAKE tokens for a duration of '+days+' days. You will not be able to withdraw your tokens before! Tokens will be locked by the smart contract, and there is no way to unlock them until the staking period of '+days+' days expires. Proceed and  stake (lock-up) tokens for '+days+' days?')) {
    //     contract.methods.stake(unlockedAmount.mul(1e9).toString(), until).send({from: bscaddress},  function(err, transactionHash) {
    //         console.log(err, transactionHash)
    //     });
    // }

    Swal.fire({
        title: 'Are you sure?',
        text: `You will stake ${unlockedAmount} of your STAKE tokens for a duration of ${days} days. You will not be able to withdraw your tokens before! Tokens will be locked by the smart contract, and there is no way to unlock them until the staking period of ${days} days expires. Proceed and  stake (lock-up) tokens for ${days} days?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1ebd09',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, start staking!'
      }).then((result) => {
        if (result.isConfirmed) {
            contract.methods.stake(unlockedAmount.mul(1e9).toString(), until).send({from: bscaddress},  
              function(err, transactionHash) {
                console.log(err, transactionHash)

                if (!err) {
                  Swal.fire({
                    title: 'Congratulations',
                    text: 'transactionHash => ' + transactionHash,
                    icon: 'success',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    confirmButtonColor: '#1ebd09',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ok'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      setTimeout(() => {
                        location.reload();
                      }, 3000);
                    }
                  })
                }
                else {
                  if (err.code === 4001) {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                      didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                      }
                    })
                    
                    Toast.fire({
                      icon: 'warning',
                      title: 'User denied transaction signature'
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: err.message,
                    })
                  }
                }
            });
        }
      })
}

function unstake() {
    var contract = new web3.eth.Contract(tokenABI, tokenAddress);

    contract.methods.unstake().send({from: bscaddress},  function(err, transactionHash) {
        console.log(err, transactionHash)
        if (!err) {
          Swal.fire({
            title: 'Congratulations',
            text: 'transactionHash => '+ transactionHash,
            icon: 'success',
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonColor: '#1ebd09',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              setTimeout(() => {
                location.reload();
              }, 3000);
            }
          })
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          })
        }
    });
}

async function setTokenPrice() {
    var contract = new web3.eth.Contract(liquidityABI, liquidityAddress);

    var tokenLocked = 0;
    var bnbLocked = 0;
    var bnbPrice = 0;

    try {
        $.ajax({url: "https://www.binance.com/api/v3/avgPrice?symbol=BNBUSDT", async: false, success: function( data ) {
            bnbPrice = data['price']
            contract.methods.getReserves().call(function(error, result){
                tokenLocked = result['_reserve0']/1e9
                bnbLocked = result['_reserve1']/1e9/1e9
                
                tokenPrice = bnbLocked/tokenLocked*bnbPrice;
                $('.tokenprice').text('$'+tokenPrice.toFixed(8))
                setSupply()
            });
        }});
    } catch (e) {
        return 0
    }
}

Number.prototype.toFixedSpecial = function(n) {
  var str = this.toFixed(n);
  if (str.indexOf('e+') === -1)
    return str;

  // if number is in scientific notation, pick (b)ase and (p)ower
  str = str.replace('.', '').split('e+').reduce(function(p, b) {
    return p + Array(b - p.length + 2).join(0);
  });
  
  if (n > 0)
    str += '.' + Array(n + 1).join(0);
  
  return str;
};

// function init(){
// 	connectWeb3()
// }
// init()
