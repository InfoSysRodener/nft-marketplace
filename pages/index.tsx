import { useState, useEffect, useRef, useContext, SetStateAction}  from 'react';
import { Banner, CreatorCard, NFTCard, SearchBar } from "../components";

import images from '../assets';

import { makeId } from '../utils/makeId';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { NFTContext } from '../context/NFTContext';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const {theme} = useTheme();
  const parentRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const [nfts, setNfts] = useState<any>([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently Added');

  const context =  useContext(NFTContext);
  if(!context) return null;
  const { fetchNFTs } = context;

  useEffect(() => {
    fetchNFTs().then((items: any) => setNfts(items));
  },[]);

  const handleScroll = (direction:string) => {
    const {current} = scrollRef;
   
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if(direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else{
      current.scrollLeft += scrollAmount;
    }
  }

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current:parent } = parentRef;

    if(current.scrollWidth >= parent.offsetWidth){
      setHideButtons(false);
    }else{
      setHideButtons(true);
    }
  }

  const topCreators = getCreators(nfts);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value: string) => {
    const filteredNfts = nfts.filter(({ name }: any) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNfts);
    }
  };


  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nfts);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize',isScrollable);
    return () => { window.removeEventListener('resize',isScrollable); }
  });

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
         <Banner
            name="Discovery, Collect and Sell Extraordinary NFTs"
            childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
            parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
         />
         <div>
            <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
              Top Sellers
            </h2>
            <div className="relative flex flex-1 max-w-full mt-3" ref={parentRef}>
              <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none" ref={scrollRef}>
               
                {topCreators.map((creator,i) => (
                  <CreatorCard
                    key={creator.seller}
                    rank={i + 1}
                    creatorImage={images[`creator${i + 1}`]}
                    creatorName={shortenAddress(creator.seller)}
                    creatorEths={creator.sumall}
                  />
                ))}
                { !hideButtons && (
                  <>
                    <div onClick={() => handleScroll('left')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                        <Image src={images.left} 
                          fill 
                          alt="left-arrow" 
                          className={`${theme === 'light' && 'filter invert'}`}
                        />
                    </div>
                    <div onClick={() => handleScroll('right')} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                        <Image src={images.right} 
                          fill 
                          alt="left-arrow" 
                          className={`${theme === 'light' && 'filter invert'}`}
                        />
                    </div>
                  </>
                 )}
              </div>
            </div>
         </div>

         <div className="mt-10">
            <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h2 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                  Hot Bids
                </h2>
                <SearchBar
                  activeSelect={activeSelect}
                  setActiveSelect={setActiveSelect}
                  handleSearch={onHandleSearch}
                  clearSearch={onClearSearch}
                />  
            </div>
            <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
              {nfts.map((nft: any) => <NFTCard key={nft.tokenId} nft={nft}/>)}

               {/* {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                 <NFTCard
                    key={`nft-${i}`}
                    nft={{
                      i,
                      name:`Nifty NFT ${i}`,
                      price: (10 - i * 0.5).toFixed(2),
                      seller:`0x${makeId(3)}....${makeId(4)}`,
                      owner:`0x${makeId(3)}....${makeId(4)}`,
                      description:'Cool NFT on sale'
                  }}
                 />
                ))} */}
            </div>
         </div>
      </div>
    </div>
  )
}

export default Home;