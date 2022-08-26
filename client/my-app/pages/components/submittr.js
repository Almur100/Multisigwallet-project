
import { useState } from 'react'
import { ethers } from 'ethers';
import { TextField, Card, CardContent, Grid, Button, Box } from '@mui/material';
import Container from '@mui/material/Container';
import mabi from './multisigwallet.json'

export default function Submittransaction(){
    const [signer, setSigner] = useState();
    const [hasError, setError] = useState(false);
    const [submittr, setsubmittr] = useState({
        address: "",
        amount: "",
        masseage: "",
      });

      function addbsEvent(event) {
        console.log(event.target.value);
        console.log(event.target.name);
        const { name, value } = event.target;
    
        setsubmittr((prevalue) => {
          console.log(prevalue);
    
          return {
            ...prevalue,
            [name]: value,
    
          };
    
        })
      }

      async function SubmitTr(e) {
        e.preventDefault();
        // const contractAddress = "0x6ef8c7f41f2adad277fe204703c0a77c1cb58ce8";
        const contractAddress = "0xbbd98e8f7d1a2a51b479ab8d32a5f06c602a31dc";
    
        const abi = mabi.abi;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const _address = submittr.address;
        const _amount = submittr.amount;
        const _masseage = submittr.masseage;
        const msgbytes = ethers.utils.formatBytes32String(_masseage);
        // const contactbytes = ethers.utils.formatBytes32String(_contact);
        try{
        const caddbs = await contract.submitTransaction(_address,_amount,msgbytes ).then((r) => {
          console.log(r);
        });
      }catch(e){
      console.log(e)
      setError(true);
      }
    
      }
      async function connect() {
        if (typeof window.ethereum !== undefined) {
          try {
            await ethereum.request({ method: "eth_requestAccounts" });
            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            const Provider = new ethers.providers.Web3Provider(window.ethereum);
            // setProvider(Provider);
            setSigner(Provider.getSigner());
    
          } catch (e) {
            console.log(e);
          }
        }
    
      }
    
    
    return(
        <>
        {hasError ? (
        <>
        <Box sx={{alignItems:'center',color:'red',ml:'450px',mt:'50px'}}>
          {"Error: connect your address to ethereum goerli test network"}
          </Box>
          <Box sx={{alignItems:'center',ml:'45%',mt:'50px'}}> 
          <Button type="submit" onClick={connect}> connect wallet </Button>
          </Box>
        </>
      ) : (
        <Container>
        <Box sx={{ marginLeft: '465px', marginTop: '10px', marginBottom: '10px' }}>
        <Button type="submit" variant='contained' color='primary' onClick={connect}> connect wallet </Button>
      </Box>
      <form onSubmit={SubmitTr}>
        <Card sx={{ maxWidth: 450, margin: '0 auto', padding: '20px,5px' }}>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item>
                <TextField
                  type="text"
                  placeholder='Enter your address'
                  name='address'
                  onChange={addbsEvent}
                  value={submittr.address}
                  fullWidth required
                />

                <TextField
                  type="number"

                  placeholder='Enter amount'
                  name='amount'
                  onChange={addbsEvent}
                  value={submittr.amount}
                  fullWidth required
                />

                <TextField
                  type="text"

                  placeholder='Enter your masseage'
                  name='masseage'
                  onChange={addbsEvent}
                  value={submittr.masseage}
                  fullWidth required
                />

                <Box sx={{ marginTop: '20px', marginLeft: '130px' }}>

                  <Button type="submit"  variant='contained' color='primary'>submitTransaction</Button>
                </Box>



              </Grid>
            </Grid>
          </CardContent>

        </Card>



      </form>
      </Container>

      )}
        </>
    )
}