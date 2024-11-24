import React, { useState, useEffect } from "react";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { FiFileText } from "react-icons/fi";
import { MdMoreHoriz } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { Button } from "@nextui-org/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bot, Home, FilePlus, PlusCircle } from "lucide-react";
import { Files as FilesIcon } from "lucide-react";

const iconClasses =
  "text-sm text-default-500 pointer-events-none flex-shrink-0";

const Files = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState();
  const [hoverKey, setHoverKey] = useState("");

  function navTo(location) {
    // alert(location);
    if (location === "home") {
      navigate("/");
    } else {
      navigate(location);
    }
  }

  useEffect(() => {
    // Update selectedTab state based on the current path
    if (location.pathname === "/") {
      // console.log(location.pathname.slice(1));
      setActiveTab("home");
    } else {
      setActiveTab(location.pathname.slice(1));
    }
  }, [location]);

  const items = [
    { key: "home", label: "Home", icon: <Home className={iconClasses} /> },
    { key: "nextai", label: "SpyderAI", icon: <Bot className={iconClasses} /> },
    {
      key: "nsfw",
      label: "NSFW Scanner",
      icon: <FilesIcon className={iconClasses} />,
    },
    {
      key: "pricing",
      label: "Kuch bhi",
      icon: <PlusCircle className={iconClasses} />,
    },
  ];

  const selectionChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 mt-2">
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        onSelectionChange={(key) => alert(key)}
      >
        <ListboxSection title="Main Navigation" showDivider>
          {items.slice(0, 4).map((item) => (
            <ListboxItem
              textValue={item.key}
              key={item.key}
              className={
                activeTab === item.key
                  ? "bg-default-200 dark:bg-default-100"
                  : "bg-transparent text-default-500"
              }
              startContent={item.icon}
              onClick={() => {
                selectionChange(item.key);
                navTo(item.key);
              }}
            >
              {item.label}
            </ListboxItem>
          ))}
        </ListboxSection>

        {/* <ListboxSection title="Files">
          {items.slice(4).map((item) => (
            <ListboxItem
              textValue={item.key}
              key={item.key}
              className={
                activeTab === item.key
                  ? "bg-[#eaeae9] text-black"
                  : "bg-transparent text-[#71717a]"
              }
              startContent={item.icon}
              onMouseEnter={() => setHoverKey(item.key)}
              onMouseLeave={() => setHoverKey("")}
              onClick={() => {
                selectionChange(item.key);
                navTo(item.key);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center">{item.label}</span>
                {(hoverKey === item.key || activeTab === item.key) && (
                  <Button className="w-fit h-fit min-w-[2px] px-1 bg-[transparent] hover:bg-default rounded-md">
                    <MdMoreHoriz size={20} />
                  </Button>
                )}
              </div>
            </ListboxItem>
          ))}
        </ListboxSection> */}
      </Listbox>
    </div>
  );
};

export default Files;
