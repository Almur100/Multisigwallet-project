import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import ResponsiveAppBar from './components/appbar';
import { Typography } from '@mui/material'

export default function Home() {
  return (
    <>
    <Typography variant='h5' sx={{fontWeight: 'bold',pl:'100px',pt:'50px'}}>
    A MultiSig wallet is a digital wallet that operates with multisignature addresses
    </Typography>
    </>
  )
    
}
