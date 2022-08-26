async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);
    const addrarray = ["0xefaE649b8901f4834547634600D284D4fb2cc5F8","0x2BBA83D5a34211fFAe295aB3499C98D6423839cA"]

  
    
    // Deploy Second
      const Second = await ethers.getContractFactory('MultiSigWallet');
      const second = await Second.deploy(addrarray,2);
  
     
     console.log( "Second: " + second.address ); 
  
  }
  
  main()
      .then(() => process.exit())
      .catch(error => {
          console.error(error);
          process.exit(1);
  })

  // const contractAddress = "0xbbd98e8f7d1a2a51b479ab8d32a5f06c602a31dc";
  