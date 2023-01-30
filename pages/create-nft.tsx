import { useState ,  useMemo , useCallback , useContext } from 'react';

import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

import { useTheme } from 'next-themes';
import images from '../assets';

import { Button, Input } from '../components';

import { NFTContext } from '../context/NFTContext';

const CreateNFT = () => {
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState(null);
  const router = useRouter();
  const [formInput, setFormInput] = useState({
    price:'',
    name:'',
    description:''
  })

  const context =  useContext(NFTContext);
  if(!context) return null;
  const { uploadIPFS, createNFT } = context;

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    //upload image to the blockchain
    const url = await uploadIPFS(acceptedFiles[0]);

    setFileUrl(url);
  },[]);

  const { getRootProps, getInputProps, isDragActive ,isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 500000
  })

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dash
      ${isDragActive && 'border-file-active'}
      ${isDragActive && 'border-file-accept'}
      ${isDragReject && 'border-file-reject'}
    `
  ),[ isDragActive ,isDragAccept, isDragReject ]);

  return (
    <div className="flex justify-center sm:px-4 p-12">
       <div className="w-3/5 md:w-full">
          <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
              Create new NFT 
          </h1>
          <div className="mt-16">
            <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload File</p>
            <div className="mt-4"> 
               <div {...getRootProps()} className={fileStyle}>
                  <input {...getInputProps()}/>
                  <div className="flexCenter flex-col text-center">
                    <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                      JPG, PNG, GIF, SVG , WEBM
                    </p>
                    <div className="my-12 w-full flex justify-center">
                        <Image src={images.upload} alt="file upload" width={100} height={100} className={`${theme === 'light' && 'filter invert'}`}/>
                    </div>
                    <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                      Drag and Drop File
                    </p>
                    <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                      or Browse media on your device
                    </p>
                    {fileUrl && (
                      <aside>
                        <div>
                          <img src={fileUrl} alt="assets_file" />
                        </div>
                      </aside>
                    )}
                  </div>
               </div>


               <Input
                  inputType="input"
                  title="Name"
                  placeholder="Item Name"
                  handleClick={(e: { target: { value: any; }; }) => setFormInput({...formInput, name:e.target.value})}
               />
               <Input
                  inputType="textarea"
                  title="Description"
                  placeholder="NFT description"
                  handleClick={(e: { target: { value: any; }; }) => setFormInput({...formInput, description:e.target.value})}
               />
               <Input
                  inputType="number"
                  title="Price"
                  placeholder="NFT Price"
                  handleClick={(e: { target: { value: any; }; }) => setFormInput({...formInput, price:e.target.value})}
               />
            </div>
            <div className="mt-7 w-full flex justify-end">
              <Button 
                btnName="Create NFT"
                classStyles="rounded-xl"
                handleClick={() => createNFT(formInput,fileUrl,router)}
              />
            </div>
          </div>
       </div>
    </div>
  )
}

export default CreateNFT
