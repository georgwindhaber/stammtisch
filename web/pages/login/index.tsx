import type { NextPage } from "next";
import React, { useState } from "react";

import axios from "axios";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.MouseEvent<HTMLInputElement>) => {
    setEmail((e.target as HTMLInputElement).value);
  };
  const handlePasswordChange = (e: React.MouseEvent<HTMLInputElement>) => {
    setPassword((e.target as HTMLInputElement).value);
  };
  const loginUser = () => {
    console.log(email, password);
    axios
      .post(
        "http://localhost:1337/api/auth/local",
        {
          identifier: email,
          password: password,
        },
      )
      .then((response) => {
        console.log("User profile", response.data.user);
        console.log("User token", response.data.jwt);
      })
      .catch((error) => {
        console.log("An error occurred:", error.response);
      });
  };

  return (
    <main className="container mx-auto h-full flex flex-col justify-center p-3">
      <div>
        <h1 className="text-2xl font-bold">Stammtisch</h1>
        <input
          type="text"
          className="block px-2 py-1 bg-gray-200 rounded-lg text-lg focus:outline-none"
          placeholder="Email Adresse"
          onClick={handleEmailChange}
        />
        <input
          type="password"
          className="block px-2 py-1 bg-gray-200 rounded-lg text-lg focus:outline-none"
          placeholder="Passwort"
          onClick={handlePasswordChange}
        />
        <button onClick={loginUser}>Login</button>
      </div>
    </main>
  );
};

export default Login;
