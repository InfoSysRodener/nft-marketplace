import React, { useState , useEffect } from 'react';
import Web3Modal from 'web3modal';
import { Contract, ethers } from 'ethers';
import axios from 'axios';
import { MarketAddress , MarketAddressABI } from './constants';

import { create as  ipfsHttpClient } from 'ipfs-http-client';

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY_SECRET;
const subdomain = process.env.NEXT_PUBLIC_IPFS_API_ENDPOINT;
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const fetchContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider | undefined) => new ethers.Contract(MarketAddress,MarketAddressABI,signerOrProvider);

interface contextProps{
    nftCurrency:string,
    connectWallet:any,
    currentAccount: any,
    uploadIPFS:any,
    createNFT:any,
    fetchNFTs:any,
    fetchMyNFTsOrListedNFTs:any,
    BuyNFT:any,
    createSale:any
}

export const NFTContext = React.createContext<contextProps | null>(null);


export const NFTProvider = ({ children } : { children: React.ReactNode }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const nftCurrency = 'ETH';

    const checkIfWalletIsConnected = async () => {
        if(!window.ethereum) return alert('Please Install MetaMask');

        const accounts = await  window.ethereum.request({method:'eth_accounts'});

        if(accounts.length){
            setCurrentAccount(accounts[0]);
        }else{
           console.log('No Accounts Found!'); 
        }

    }

   
    

    const connectWallet = async () => {
        if(!window.ethereum) return alert('Please Install MetaMask');

        const accounts = await  window.ethereum.request({method:'eth_requestAccounts'});

        setCurrentAccount(accounts[0]);

        window.location.reload();
    }



    const uploadIPFS =async (file: any) => {
 
        try {
            const added = await client.add({ content: file });

            const URL = `${subdomain}/ipfs/${added.path}`;

            return URL;

       } catch (error) {

         console.log('Error uploading file to IPFS.',error);

       }
    }   


    const createNFT =async (formInput:any,fileUrl:any,router:any) => {
        const { name , description, price } = formInput;

        if(!name || !description || !price || !fileUrl) return;

        const data = JSON.stringify({name,description,image:fileUrl});

        try {
            const added = await client.add(data);
            const url = `${subdomain}/ipfs/${added.path}`;

            await createSale(url,price,null,null);

            router.push('/');

        } catch (error) {

            console.log('Error uploading file to IPFS.',error);

        }
    }


    const createSale =async (url:any,formInputPrice:any,isReselling:any,id: any ) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const price = ethers.utils.parseUnits(formInputPrice,'ether');

        const contract = fetchContract(signer);

        const listingPrice = await contract.getListingPrice();

        const transaction  = !isReselling 
            ? await contract.createToken(url,price, { value: listingPrice.toString() })
            : await contract.resellToken(id,price, { value: listingPrice.toString() });

        await transaction.wait();
    }


    const fetchNFTs = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/ntdvzlM2nfLiY6Q_K57AMu6Ti2zaNXXU');
        const contract = fetchContract(provider);

        const data = await contract.fetchMarketItems();

        const items = Promise.all(data.map( async ({tokenId,seller,owner,price:unformattedPrice}:any) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {data: {name,description,image} } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice, 'ether');

            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI
            }
        }))

        return items;
    }

    const fetchMyNFTsOrListedNFTs = async (type : string) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);

        const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();

        const items = Promise.all(data.map( async ({tokenId,seller,owner,price:unformattedPrice}:any) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const {data: {name,description,image} } = await axios.get(tokenURI);
            const price = ethers.utils.formatUnits(unformattedPrice, 'ether');

            return {
                price,
                tokenId: tokenId.toNumber(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI
            }
        }))

        return items;
    }


    const BuyNFT =async (nft:any) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);

        const price = ethers.utils.parseUnits(nft.price.toString(),'ether');

        const transaction = await contract.createMarketSale(nft.tokenId,{ value:price});

        await transaction.wait();
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        fetchNFTs();
    },[]);

    return (
        <NFTContext.Provider value={{nftCurrency,connectWallet ,currentAccount,uploadIPFS,createNFT,fetchNFTs,fetchMyNFTsOrListedNFTs, BuyNFT ,createSale}}>
            {children}
        </NFTContext.Provider>
    )
}