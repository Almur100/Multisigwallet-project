import { useState } from 'react'
import { ethers } from 'ethers';
import { TextField, Card, CardContent, Grid, Button, Box } from '@mui/material';
import Container from '@mui/material/Container';
import mabi from './multisigwallet.json';



export default function Revoketransaction(){
    const [trindex, settrindex] = useState("");
    const [signer, setSigner] = useState();
    const [hasError, setError] = useState(false);

    function revokeEvent(e){
      e.persist();
      console.log(e.target.value);
      
      // console.log(e.currentTarget.checked);
      settrindex(e.target.value);
    }


        
        
        
      

      

      async function RevokeTr(e) {
        e.preventDefault();
        // const contractAddress = "0x6ef8c7f41f2adad277fe204703c0a77c1cb58ce8";
        const contractAddress = "0xbbd98e8f7d1a2a51b479ab8d32a5f06c602a31dc";
    
        const abi = mabi.abi;
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const _trindex = trindex;
        // const _amount = submittr.amount;
        // const _masseage = submittr.masseage;
        // const msgbytes = ethers.utils.formatBytes32String(_masseage);
        // const contactbytes = ethers.utils.formatBytes32String(_contact);
        try{
        const caddbs = await contract.revokeTransaction(_trindex ).then((r) => {
          console.log(r);
        });
      }catch(e){
      console.log( "Error: connect again your address to goirel test network or address already exist in marketplace" )
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
            setError(true);
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
         <Box sx={{ marginLeft: '4650px', marginTop: '10px', marginBottom: '10px' }}>
        <Button type="submit" variant='contained' color='primary' onClick={connect}> connect wallet </Button>
      </Box>
      <Card sx={{ maxWidth: 450, margin: '0 auto', padding: '20px,5px' }}>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item>
              <TextField
                type="number"

                placeholder='Enter transaction id'

                onChange={revokeEvent}
                value={trindex}
                fullWidth required
              />
              <Box sx={{ marginTop: '20px', marginLeft: '130px' }}>

                <Button type="submit" onClick={RevokeTr} variant='contained' color='primary'>revoke</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

      </Card>
      </Container>

      )}

        </>
    )
}