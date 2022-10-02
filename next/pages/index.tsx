import { TextField } from '@mui/material'
import Axios from 'axios'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {


  const router = useRouter()
  useEffect(() => {
    if (!localStorage.jwt) {
      router.push("/login")
    } else {
      const queryDrinks =async () => {
        const drinks = await Axios.get("http://localhost:1337/api/drinks?filters[users_permissions_user][id]=1", {headers: {
          Authorization: `Bearer ${localStorage.jwt}`
        }})
        console.log(drinks.data.data)
      }
      queryDrinks()
    }
  })

  return (
    <>
      <h1>Please log in</h1>

    </>
  )
}

export default Home
