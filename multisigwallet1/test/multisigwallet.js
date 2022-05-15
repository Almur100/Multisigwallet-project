const {expect} = require("chai");
// const { ethers } = require("hardhat");

describe("multisigwallet contract",()=>{
    let Multisigwallet;
    let multisigwallet;
    let deployer;
    let addr1;
    let addr2;
    let addr3;
    let addr4;
    let addrs;

    beforeEach(async()=>{
        Multisigwallet = await ethers.getContractFactory("MultiSigWallet");
        [deployer,addr1,addr2,addr3,addr4,...addrs ] = await ethers.getSigners();
        multisigwallet = await Multisigwallet.deploy([addr1.address,addr2.address,addr3.address],3);
        
		const transactionHash = await addr3.sendTransaction({
			to: multisigwallet.address,
			value: 20,
        });   

    });
    describe("deployment of contract",()=>{
        it("it will check correct owners and numconfirmationsrequird",async()=>{
           expect ( await multisigwallet.numConfirmationsRequired()).to.equal(3);
           expect( await multisigwallet.owners(0)).to.equal(addr1.address);
           expect( await multisigwallet.owners(1)).to.equal(addr2.address);
           expect( await multisigwallet.owners(2)).to.equal(addr3.address);
       
               
        });

    });
    describe("submittransaction",()=>{
        it("it will check submit transactions rulles are correct",async()=>{
            const subtr = await multisigwallet.connect(addr1).submitTransaction(addr4.address,5,"0x65");
            const tr = await multisigwallet.transactions(0);
            expect(tr.value).to.equal(5);
            // expect(tr.data).to.equal(0x65);
            expect(tr.executed).to.equal(false);
            expect(tr.numConfirmations).to.equal(0);
            expect(tr.to).to.equal(addr4.address);
            await expect(subtr).to.emit(multisigwallet,"SubmitTransaction").withArgs(addr1.address,0,addr4.address,5,"0x65");

        });   
        it("it will if submit transaction is not doing owner ",async()=>{
            await expect(multisigwallet.connect(deployer).submitTransaction(addr4.address,5,0x65)).to.be.revertedWith("not owner");
            // const tr = await multisigwallet.transactions(0);
            // expect(tr.value).to.equal(5);
            // expect(tr.data).to.equal(0x65);
            //    expect(tr.executed).to.equal(false); 
            // expect(tr.numConfirmations).to.equal(0);
            // expect(tr.to).to.equal(addr4.address);

        });


    });
    describe("confirmtransaction",()=>{
        
           


       
        it("it will check confirmtransactions rulles are correct",async()=>{
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,5,0x65);
            
            // expect(v.value).to.equal(5);
            
            // const bal = await ethers.provider.getBalance(addr4.address);
            // const bal1 = await ethers.provider.getBalance(multisigwallet.address);
            // console.log(bal1);
            // console.log(bal);
            const cft = await multisigwallet.connect(addr1).confirmTransaction(0);
             expect(await  multisigwallet.connect(addr1). checkConfirmation(0)).to.equal(true);
             const v = await multisigwallet.transactions(0);
             expect(v.numConfirmations).to.equal(1);
             await expect(cft).to.emit(multisigwallet,"ConfirmTransaction").withArgs(addr1.address,0);


        });
        it("it will fail if this not owner",async()=>{
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,5,0x65);
            await expect(multisigwallet.connect(deployer).confirmTransaction(0)).to.be.revertedWith("not owner");

        });
        it("it will fail if txindex not exist",async()=>{
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,5,0x65);
            await expect(multisigwallet.connect(addr1).confirmTransaction(1)).to.be.revertedWith("tx does not exist");

        });
        it("it will fail if tx already executed ",async()=>{
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,5,0x65);
            
            await multisigwallet.connect(addr1).confirmTransaction(0);
            await multisigwallet.connect(addr2).confirmTransaction(0);
            await multisigwallet.connect(addr3).confirmTransaction(0);
            await multisigwallet.connect(addr2).executeTransaction(0);
            await expect(multisigwallet.connect(addr1).confirmTransaction(0)).to.be.revertedWith("tx already executed");
        });
        it("it will fail if txindex not exist",async()=>{
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,5,0x65);
            await multisigwallet.connect(addr1).confirmTransaction(0);
            await expect(multisigwallet.connect(addr1).confirmTransaction(0)).to.be.revertedWith("tx already confirmed");

        });


    });
    describe("executetransaction",()=>{
        beforeEach(async()=>{
            const amount = 5;
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,amount,0x65);
            await multisigwallet.connect(addr1).confirmTransaction(0);
            await multisigwallet.connect(addr2).confirmTransaction(0);
            await multisigwallet.connect(addr3).confirmTransaction(0);
        });
        it("it will check executetransactions rulles are correct",async()=>{
            const et = await multisigwallet.connect(addr2).executeTransaction(0);
            await expect(et).to.emit(multisigwallet,"ExecuteTransaction").withArgs(addr2.address,0);


        });
        it("it will this not owner address",async()=>{
            const et = await expect(multisigwallet.connect(deployer).executeTransaction(0)).to.be.revertedWith("not owner");
        });
        it("it will if tx does not exist",async()=>{
            const et = await expect(multisigwallet.connect(addr2).executeTransaction(1)).to.be.revertedWith("tx does not exist");
        });
        it("it will if tx already executed",async()=>{
            await multisigwallet.connect(addr2).executeTransaction(0);
            const et = await expect(multisigwallet.connect(addr2  ).executeTransaction(0)).to.be.revertedWith("tx already executed");
                
                
                
                
                
                
                
                   
                
                
                
                
              
        });
    });
    describe("revokeconfirmations",()=>{
        beforeEach(async()=>{
            const amount = 5;
            await multisigwallet.connect(addr1).submitTransaction(addr4.address,amount,0x65);
            await multisigwallet.connect(addr1).confirmTransaction(0);
            await multisigwallet.connect(addr2).confirmTransaction(0);
            await multisigwallet.connect(addr3).confirmTransaction(0);
        });
        it("it will check revokeconfirmations rulles are correct",async()=>{
            const ct = await multisigwallet.connect(addr2).revokeConfirmation(0);
            const numc = await multisigwallet.transactions(0);
            expect(numc.numConfirmations).to.equal(2);
            const checkcon = await multisigwallet.connect(addr2).checkConfirmation(0);
            expect(checkcon).to.equal(false);
            await expect(ct).to.emit(multisigwallet,"RevokeConfirmation").withArgs(addr2.address,0); 





        }); 
        it("it will fail if this is not owner",async()=>{
            await expect(multisigwallet.connect(deployer).revokeConfirmation(0)).to.be.revertedWith("not owner");


        });
        it("it will fail if tx does not exist",async()=>{
            await expect(multisigwallet.connect(addr2).revokeConfirmation(2)).to.be.revertedWith("tx does not exist");


        });
        it("it will fail if tx already confirmed",async()=>{
            await multisigwallet.connect(addr2).executeTransaction(0);
            await expect(multisigwallet.connect(addr2).revokeConfirmation(0)).to.be.revertedWith("tx already executed");


        });   
    });
});
