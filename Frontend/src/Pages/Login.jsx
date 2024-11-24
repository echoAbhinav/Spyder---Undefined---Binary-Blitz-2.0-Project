/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext";
import { Input } from "@nextui-org/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Divider } from "@nextui-org/divider";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const [loginbtnState, setLoginbtnState] = useState(1);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const serverUrl = "http://localhost:3000";

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // -1 will navigate to the previous page in the history stack
  };

  const gotoSignup = () => {
    navigate("/newAccount"); // -1 will navigate to the previous page in the history stack
  };

  const userContext = useContext(UserContext);

  const handleLogin = () => {
    setLoginbtnState(0);
    toast
      .promise(
        axios.post(
          `${serverUrl}/api/auth/login`,
          {
            usernameOrEmail: usernameOrEmail.toLowerCase(),
            password,
          },
          {
            withCredentials: true, // Include credentials (cookies)
          }
        ),
        {
          loading: "Processing...",
          success: <b>Logged In!</b>,
          error: <b>Failed logging in.</b>,
        }
      )
      .then((response) => {
        userContext.setUser(response.data.user);
        console.log("Login ho gya bhai!");
        console.log(response.data.user);
        console.log("Ab navigate krde");
        navigate("/");
        console.log("After navigation");
      })
      .catch((e) => {
        console.log(e);
        setLoginbtnState(1);
      });
  };

  return (
    <div className="main flex items-center justify-center  w-full h-full flex-col">
      <div className="top_nav flex items-center justify-center w-full  h-[64px] z-10 fixed top-0">
        <div className="left h-full  flex items-center justify-center">
          <Button
            isIconOnly
            color="primary"
            variant="light"
            aria-label="Go back"
            className="flex items-center justify-center fixed z-10 top-3 left-3"
            onClick={handleGoBack}
          >
            <IoIosArrowBack size={25} />
          </Button>
        </div>
        <div className="right h-full w-[100%] flex items-center justify-center font-bold text-lg">
          Spyder
        </div>
      </div>

      <div className="form_container flex items-center justify-center flex-col gap-2 max-w-[400px] w-[80%] h-full">
        <h1 className="text-2xl font-bold p-5">Welcome Back!, Login</h1>

        <Input
          className="w-full"
          type="email"
          label="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <Input
          className="w-full"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          color="primary"
          className="w-full p-6"
          onClick={handleLogin}
          isDisabled={loginbtnState ? false : true}
          // isDisabled
        >
          Login
        </Button>

        <Divider className="my-4" />

        <Button
          onClick={gotoSignup}
          color="primary"
          variant="flat"
          className="w-full p-6"
        >
          Create new account
        </Button>
      </div>
    </div>
  );
};

export default Login;
