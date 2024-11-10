import './global.js';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
 // Add this import at the top of your entry file
 import { ethers } from "ethers";
 import {
  ThirdwebStorage,
  StorageDownloader,
  IpfsUploader,
} from "@thirdweb-dev/storage";
 import { ThirdwebProvider } from "@thirdweb-dev/react";
 const storage = new ThirdwebStorage({
  uploader: new IpfsUploader(),
  downloader: new StorageDownloader(),
  gatewayUrls: {
    "ipfs://": [
      "https://gateway.ipfscdn.io/ipfs/",
      "https://cloudflare-ipfs.com/ipfs/",
      "https://ipfs.io/ipfs/",
    ],
  },
});

 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
     <ThirdwebProvider
       clientId="28215ea29f3802e0f1e05b492591a257"  // Replace with your actual Thirdweb client ID
       activeChain={"mumbai"}  // Use "mumbai" for Polygon Mumbai testnet if preferred
     >
       <App />
     </ThirdwebProvider>
   </React.StrictMode>,
 );