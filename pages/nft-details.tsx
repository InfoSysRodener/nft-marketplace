import React , { useState , useEffect , useContext }from 'react';

import { NFTContext } from '../context/NFTContext';
import { Button, Loader, Modal, NFTCard } from '../components';

import Image from 'next/image';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';
import  { useRouter } from 'next/router';

const PaymentBodyCmp = ({ nft, nftCurrency } : any) => (
  <div className="flex flex-col">
    <div className="flexBetween">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Item</p>
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Subtotal</p>
    </div>

    <div className="flexBetweenStart my-5">
      <div className="flex-1 flexStartCenter">
        <div className="relative w-28 h-28">
          <Image src={nft.image || images[`nft${nft.i}`]} fill alt="nft image"/>
        </div>
        <div className="flexCenterStart flex-col ml-5">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{shortenAddress(nft.seller)}</p>
          <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{nft.name}</p>
        </div>
      </div>

      <div>
        <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
      </div>
    </div>

    <div className="flexBetween mt-10">
      <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">Total</p>
      <p className="font-poppins dark:text-white text-nft-black-1 text-base minlg:text-xl font-normal">{nft.price} <span className="font-semibold">{nftCurrency}</span></p>
    </div>
  </div>
);


const NFTDetails = () => {
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const context =  useContext(NFTContext);
  if(!context) return null;
  const { currentAccount , nftCurrency, BuyNFT } = context;
  const [nft, setNft] = useState<any>({image:'', tokenId:'' ,name:'',owner:'',price:'',seller:''});
  const [paymentModal, setPaymentModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);


  const checkout = async () => {
    await BuyNFT(nft);
    
    setPaymentModal(false);
    setSuccessModal(true);
  }

  useEffect(() => {
    if(!router.isReady) return;
    setNft(router.query);
    setIsLoading(false);
  },[router.isReady])

  if(isLoading) return <Loader/>

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
        <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
            <div className="relative w-557 h-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 ">
              <Image src={nft.image} alt="nft image"  className="rounded-xl shadow-lg object-cover" fill/>
            </div>
        </div>
        <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
          <div  className="flex flex-row sm:flex-col">
            <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">{nft.name}</h2>
          </div>
          <div className="mt-10">
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
              Creator
            </p>
            <div className="flex flex-row items-center mt-3">
              <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
                <Image src={images.creator1} alt="creator image" className="object-cover rounded-full" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-base font-semibold">
                {shortenAddress(currentAccount === nft.owner.toLowerCase() ? nft.owner : nft.seller)}
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col">
              <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex-row">
                <p className="font-poppins dark:text-white text-nft-black-1 text-base font-medium mb-2">
                  Details
                </p>
              </div>
              <div className="mt-3">
                <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">{nft.description}</p>
              </div>
          </div>
          <div className="flex flex-row sm:flex-col mt-10">
            {currentAccount === nft.seller.toLowerCase() ? (
              <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border-gray p-2">
                  You cannot buy your own NFT
              </p>
            ) : currentAccount === nft.owner.toLowerCase() ? (
              <Button
                  btnName="List on Marketplace"
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
              />
            ) : (
              <Button
                  btnName={`Buy for ${nft.price} ${nftCurrency}`}
                  classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                  handleClick={() => setPaymentModal(true)}
              />
            )}
            {
              paymentModal && (
              <Modal
                  header="Check Out"
                  body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency}/>}
                  footer={(
                    <div className="flex flex-row sm:flex-col">
                      <Button
                        btnName="checkout"
                        classStyles="mr-5 sm:mr-0 sm:mb-2 rounded-md"
                        handleClick={checkout}
                      />
                      <Button
                        btnName="camcel"
                        classStyles="mr-5 sm:mr-0 rounded-md"
                        handleClick={() => setPaymentModal(false)}
                      />
                    </div>
                  )}
                  handleClose={() => setPaymentModal(false)}
              /> 
           )}

           {
            successModal && (
              <Modal
                  header="Payment Successfull"
                  body={(
                    <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
                      <div className="relative w-52 h-52">
                          <Image src={nft.image} alt="nft" fill/>
                      </div>
                      <p className="font-poppins dark:text-white text-nft-black-1 text-sm minlg:text-xl font-normal mt-10">
                          You successfully purchased
                          <span className="font-semibold ml-2">{nft.name} from</span>
                          <span className="font-semibold ml-2">{shortenAddress(nft.seller)}</span>
                      </p>
                    </div>
                  )}
                  footer={(
                    <div className="flexCenter flex-col">
                      <Button
                        btnName="Check it out!"
                        classStyles="sm:mb-5 sm:mr-0 rounded-md"
                        handleClick={() => router.push('/my-nfts')}
                      />
                    </div>
                  )}
                  handleClose={() => setPaymentModal(false)}
              />
            )}
          </div>
        </div>
    </div>
  )
}

export default NFTDetails
