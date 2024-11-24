/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useContext } from "react";
import { DarkModeContext } from "../Contexts/DarkModeContext";
// import { UserContext } from "../Contexts/UserContext";
import { Input } from "@nextui-org/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Divider } from "@nextui-org/divider";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const NewAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginbtnState, setLoginbtnState] = useState(1);
  const serverUrl = "http://localhost:3000";

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // -1 will navigate to the previous page in the history stack
  };

  const gotoLoginPage = () => {
    navigate("/login");
  };

  //   const userContext = useContext(UserContext);

  function handleSignup() {
    console.log("Hola");

    setLoginbtnState(0);

    toast
      .promise(
        axios.post(
          `${serverUrl}/api/v1/auth/signup`,
          {
            name: name,
            email,
            password,
          },
          {
            withCredentials: true, // Include credentials (cookies)
          }
        ),
        {
          loading: "Processing...",
          success: <b>Account created successfully!</b>,
          error: <b>Failed to create account. Please try again.</b>,
        }
      )
      .then((response) => {
        // Redirect to login page or any other page after successful signup
        // userContext.setUser(response.data.user);
        console.log(response.data.user);
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        setLoginbtnState(1);
      });
  }

  return (
    <div className="main flex items-center justify-center w-full h-full flex-col">
      <div className="top_nav flex items-center justify-center w-full  h-[64px] z-10 fixed top-0">
        <div className="left h-full  flex items-center justify-center">
          <Button
            isIconOnly
            color="primary"
            variant="light"
            aria-label="Take a photo"
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
        <h1 className="text-2xl font-bold p-5">Create New Account</h1>
        <Input
          className="w-full"
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          className="w-full"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          color="primary"
          className="w-full p-6"
          onClick={handleSignup}
          isDisabled={loginbtnState ? false : true}
          // isDisabled
        >
          Signup
        </Button>

        <Divider className="my-4" />

        <Button
          color="primary"
          variant="flat"
          className="w-full p-6"
          onClick={gotoLoginPage}
        >
          Already have an account? Login
        </Button>
      </div>
    </div>
  );
};

export default NewAccount;
