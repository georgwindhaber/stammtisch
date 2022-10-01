import { Button, TextField } from "@mui/material";
import Axios, { AxiosError } from "axios";
import { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";

const Login: NextPage = () => {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ errorMessage, setErrorMessage ] = useState("")

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleLogin = async () => {
        console.log("login")
        try {
            const response = await Axios.post('http://localhost:1337/api/auth/local', { identifier: email.value, password: password.value })
            if (response?.data?.jwt) {
                localStorage.jwt = response.data.jwt;
                console.log(response)
            } else {
                console.log(response)
            }
        } catch (err) {
            const error = err as AxiosError
            if(error.response?.data) {
                const strapiError = error.response?.data as any
                if (strapiError.error?.name === 'ValidationError') {
                    setErrorMessage("Falsche Email-Adresse oder Passwort")
                }
            }
            else {
                setErrorMessage("Keine verbinding zum Server")
            }
        }
    
    };

    return <>
        <h1>Login</h1>
        <TextField label="Email" onChange={handleEmailChange} />
        <TextField label="Passwort" type="password" />
        <Button variant="contained" onClick={handleLogin}>Login</Button>
        {email}
    </>
}

export default Login