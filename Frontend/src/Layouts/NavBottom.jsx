import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { Home, Bot, PlusCircle, Files } from "lucide-react";
import { Avatar } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";

const NavBottom = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Set the initial selected tab based on the current path
  const getInitialTab = (path) => {
    switch (path) {
      case "/nextai":
        return "nextai";
      case "/communities":
        return "communities";
      case "/newJot":
        return "newJot";
      case "/userProfile":
        return "userProfile";
      case "/":
        return "home";
      default:
        return "home"; // default to home if path is unknown
    }
  };

  const [selectedTab, setSelectedTab] = useState(
    getInitialTab(location.pathname)
  );

  // Function to navigate based on tab selection
  const navTo = (path) => {
    navigate(path === "home" ? "/" : `/${path}`);
  };

  // Handle tab selection change
  const handleSelectionChange = (e) => {
    navTo(e);
    setSelectedTab(e);
  };

  // Update selected tab when the path changes
  useEffect(() => {
    const currentTab = getInitialTab(location.pathname);
    setSelectedTab(currentTab);
  }, [location]);

  useEffect(() => {
    // Update styles for div with data-slot="tabList"
    const tabListDivs = document.querySelectorAll('div[data-slot="tabList"]');
    tabListDivs.forEach((tabListDiv) => {
      tabListDiv.style.display = "flex";
      tabListDiv.style.width = "100%";
      tabListDiv.style.height = "100%";
      tabListDiv.style.alignItems = "center";
      tabListDiv.style.justifyContent = "space-evenly"; // Or 'space-between'
    });
  }, []);

  return (
    <div className="sm:hidden flex h-[64px] w-full">
      <Tabs
        aria-label="Dynamic tabs"
        variant="underlined"
        className="w-full flex items-center justify-around h-full"
        selectedKey={selectedTab}
        onSelectionChange={handleSelectionChange}
      >
        <Tab
          key="home"
          className="w-fit h-12 rounded min-h-fit"
          title={
            <div className="flex items-center space-x-2">
              <Home size={30} />
            </div>
          }
        />

        <Tab
          key="nextai"
          className="w-fit h-12 rounded min-h-fit"
          title={
            <div className="flex items-center space-x-2">
              <Bot size={30} />
            </div>
          }
        />

        <Tab
          key="newJot"
          className="w-fit h-12 rounded min-h-fit"
          title={
            <div className="flex items-center space-x-2">
              <PlusCircle size={27} />
            </div>
          }
        />

        <Tab
          key="communities"
          className="w-fit h-12 rounded min-h-fit"
          title={
            <div className="flex items-center space-x-2">
              <Files size={27} />
            </div>
          }
        />

        <Tab
          key="userProfile"
          className="w-fit h-12 rounded min-h-fit"
          title={
            <div className="flex items-center space-x-2">
              <Avatar
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704g"
              />
            </div>
          }
        />
      </Tabs>
    </div>
  );
};

export default NavBottom;
