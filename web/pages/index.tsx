import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import HeaderBar from '../components/header-bar'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Stammtisch Login</title>
        <meta name="description" content="Stammtsich Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeaderBar />

      <main className='container mx-auto'>
      </main>
    </div>
  )
}

export default Home
