import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes';
import { Navbar, Footer } from '../components';
import { NFTProvider } from '../context/NFTContext';

const App = ({ Component, pageProps }: AppProps) => (
  <NFTProvider>
    <ThemeProvider attribute="class">
      <div className="dark:bg-nft-dark bg-white min-h-screen">
          <Navbar/>
          <div className="pt-65">
            <Component {...pageProps} />
          </div>
          <Footer/>
      </div>
    </ThemeProvider>
  </NFTProvider>
)


export default App;