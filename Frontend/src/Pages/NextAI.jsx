import React, { useState } from "react";
import { User } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { MailIcon, Bolt, Upload } from "lucide-react";
import { FaBolt } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import axios from "axios";
import { FaLastfmSquare } from "react-icons/fa";
// import "./AI.css";

const NextAI = () => {
  const [messages, setMessages] = useState([
    { text: "Hey there!", type: "received" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);

  const [serverCmd, setServerCmd] = useState("none");
  const [scanBtnDisabled, setScanBtnDisabled] = useState(false);
  const [scanBtnTxt, setScanBtnTxt] = useState("Scan");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Store selected file
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleServerCmd = (cmd) => {
    setServerCmd(cmd);
    if (cmd === "filescan") {
      alert("File Scan!");
    } else if (cmd === "webscan") {
      alert("Web Scan!");
    }
  };

  // const handleFileScan = async () => {
  //   if (!file) {
  //     alert("Please select a file first");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   setScanBtnTxt("Scanning");
  //   setScanBtnDisabled(true);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/scanFile",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const data = await response.json();
  //     console.log(data);

  //     const receivedMessage = {
  //       text: data.answer.ai_output,
  //       type: "received",
  //       server_cmd: data.answer.server_cmd,
  //     };

  //     setScanBtnTxt("Scan");
  //     setScanBtnDisabled(false);

  //     setMessages((prevMessages) => [...prevMessages, receivedMessage]);

  //     console.log("File scan successfully", response.data);
  //   } catch (error) {
  //     setScanBtnTxt("Scan Failed");
  //     setScanBtnDisabled(false);
  //     console.error("Error sending message:", error);
  //   }

  //   // try {
  //   //   const response = await fetch("http://localhost:3000/scanFile", {
  //   //     method: "POST",
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //   });

  //   //   if (!response.ok) {
  //   //     throw new Error("Network response was not ok");
  //   //   }

  //   //   const data = await response.json();
  //   //   console.log(data);

  //   //   const receivedMessage = {
  //   //     text: data.answer.ai_output,
  //   //     type: "received",
  //   //     server_cmd: data.answer.server_cmd,
  //   //   };

  //   //   setScanBtnTxt("Scan");
  //   //   setScanBtnDisabled(false);

  //   //   setMessages((prevMessages) => [...prevMessages, receivedMessage]);

  //   //   // let parsed = JSON.parse(data.answer);
  //   //   // console.log(parsed);
  //   // } catch (error) {
  //   //   setScanBtnTxt("Scan Failed");
  //   //   setScanBtnDisabled(false);
  //   //   console.error("Error sending message:", error);
  //   // }
  // };

  const handleFileScan = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setScanBtnTxt("Scanning");
    setScanBtnDisabled(true);

    try {
      const response = await axios.post(
        "https://spyder-undefined-binary-blitz-2-0-project.onrender.com/scanFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data;
      console.log("File scan successfully", data);

      const receivedMessage = {
        text: data.answer.ai_output,
        type: "received",
        server_cmd: data.answer.server_cmd,
      };

      setScanBtnTxt("Scan");
      setScanBtnDisabled(false);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    } catch (error) {
      setScanBtnTxt("Scan Failed");
      setScanBtnDisabled(false);
      console.error("Error sending message:", error);

      // Show user-friendly error
      alert("There was an issue scanning the file. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      // Add the sent message to the state
      const userMessage = { text: inputValue, type: "sent" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setTyping(true);

      // Send message to Gemini API
      try {
        const response = await fetch(
          "https://spyder-undefined-binary-blitz-2-0-project.onrender.com/geminiChat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: inputValue,
              // token: localStorage.getItem("token"),
            }), // Adjust based on your API requirements
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTyping(false);

        let parsed = JSON.parse(data.answer);

        handleServerCmd(parsed.server_cmd);

        // Assuming the API returns a text response
        const receivedMessage = {
          text: parsed.ai_output,
          type: "received",
          server_cmd: parsed.server_cmd,
        };
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      // Clear the input field
      setInputValue("");
    }
  };

  return (
    <div className="main w-full h-full flex flex-col items-center justify-center">
      <div className="header w-full h-[65px] flex items-center justify-center p-4 border-b-2 mt-1">
        <div className="left w-1/2">
          <User
            name="NextAI"
            description="Online"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            }}
          />
        </div>
        <div className="right w-1/2"></div>
      </div>
      <div className="chatBody w-full h-[calc(100%-65px)] flex flex-col items-center justify-center">
        <div className="chats w-full h-[calc(100%-70px)] flex items-center justify-center">
          <div className="chats_main h-full w-full p-2 overflow-y-auto">
            {messages.map((msg, index) => (
              // <div key={index} className={msg.type === 'sent' ? 'sent-message' : 'received-message'}>
              //   {msg.text}
              // </div>
              <div
                key={index}
                className={`chat_wrapper min-h-fit w-full mt-1 flex ${
                  msg.type === "sent" ? " justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`chat ai bg-primary max-w-[50%] text-default-50 ${
                    msg.type === "sent"
                      ? "float-end p-2 rounded-lg rounded-br-[0]"
                      : "float-start p-2 rounded-lg rounded-bl-[0] "
                  } `}
                >
                  {msg.type === "received" ? (
                    <Markdown
                      remarkPlugins={[remarkBreaks]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-4xl font-extrabold mb-6">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-3xl font-bold mb-5">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-2xl font-semibold mb-4">
                            {children}
                          </h3>
                        ),

                        // Add more components as needed
                      }}
                    >
                      {msg.text}
                    </Markdown>
                  ) : (
                    <span>{msg.text}</span> // Use <span> for consistency
                  )}

                  {msg.server_cmd === "filescan" && (
                    <div className="mt-2 w-fit text-default-800 flex">
                      <Input
                        className="w-fit"
                        radius="sm"
                        variant=""
                        type="file"
                        color="primary"
                        onChange={handleFileChange}
                        startContent={
                          <Upload className="text-2xl text-default-800 pointer-events-none flex-shrink-0 " />
                        }
                      />
                      <Button
                        className="bg-[#f4f4f5] text-black ml-2 "
                        radius="sm"
                        onClick={handleFileScan}
                        isDisabled={scanBtnDisabled}
                      >
                        {scanBtnTxt}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className={`loading mt-3 ${typing ? "block" : "hidden"}`}>
              <div className="typing-indicator">
                <div className="typing-circle"></div>
                <div className="typing-circle"></div>
                <div className="typing-circle"></div>
                <div className="typing-shadow"></div>
                <div className="typing-shadow"></div>
                <div className="typing-shadow"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="input_div w-full h-[70px] flex items-center justify-center p-4">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="m-0 p-0"
            placeholder="Type here..."
            labelPlacement="outside"
            startContent={
              <FaBolt
                size={18}
                className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
              />
            }
          />
          <Button
            color="primary"
            className=" m-0 min-w-fit p-5 rounded-[15px] ml-2"
            onClick={handleSendMessage}
          >
            <IoSend
              size={18}
              className="text-2xl pointer-events-none flex-shrink-0"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NextAI;
