import React, { useState } from "react";
import { Listbox, ListboxItem, ListboxSection, cn } from "@nextui-org/react";
import { FiFileText } from "react-icons/fi";
import { MdMoreHoriz } from "react-icons/md";
import { GoHome } from "react-icons/go";
import { Tabs, Tab, Card, CardBody, Switch, Button } from "@nextui-org/react";

const iconClasses =
  "text-xl text-default-500 pointer-events-none flex-shrink-0";

const Files = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [hoverKey, setHoverKey] = useState("home");
  const [isHovered, setIsHovered] = useState(false);

  function selectionChange(key) {
    setActiveTab(key);
  }

  return (
    <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100 mt-2">
      <Listbox
        variant="flat"
        aria-label="Listbox menu with sections"
        onSelectionChange={(key) => {
          alert(key);
        }}
      >
        <ListboxSection title="Main Navigation" showDivider>
          <ListboxItem
            key="home"
            className={
              activeTab === "home"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<GoHome className={iconClasses} />}
            onClick={() => {
              selectionChange("home");
            }}
          >
            Home
          </ListboxItem>
          <ListboxItem
            key="copy"
            className={
              activeTab === "copy"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<GoHome className={iconClasses} />}
            onClick={() => {
              selectionChange("copy");
            }}
          >
            CodeAI
          </ListboxItem>
          <ListboxItem
            key="edit"
            className={
              activeTab === "edit"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<GoHome className={iconClasses} />}
            onClick={() => {
              selectionChange("edit");
            }}
          >
            Edit file
          </ListboxItem>
        </ListboxSection>

        <ListboxSection title="Files">
          <ListboxItem
            textValue="f1"
            key="f1"
            className={
              activeTab === "f1"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<FiFileText className={iconClasses} />}
            onMouseEnter={() => {
              setIsHovered(true);
              setHoverKey("f1");
              console.log("f1 hovered");
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setHoverKey("");
              console.log("f1 hover over");
            }}
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              selectionChange("f1");
            }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">Edit file</span>
              {((isHovered && hoverKey === "f1") || activeTab === "f1") && (
                <Button className="w-fit h-fit min-w-[2px] px-1 bg-[transparent] hover:bg-default rounded-md">
                  <MdMoreHoriz size={20} />
                </Button>
              )}
            </div>
          </ListboxItem>

          <ListboxItem
            key="f2"
            className={
              activeTab === "f2"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<FiFileText className={iconClasses} />}
            onMouseEnter={() => {
              setIsHovered(true);
              setHoverKey("f2");
              console.log("f2 hovered");
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setHoverKey("");
              console.log("f2 hover over");
            }}
            onClick={() => {
              selectionChange("f2");
            }}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center">Edit file</span>
              {((isHovered && hoverKey === "f2") || activeTab === "f2") && (
                <Button className="w-fit h-fit min-w-[2px] px-1 bg-[transparent] hover:bg-default rounded-md">
                  <MdMoreHoriz size={20} />
                </Button>
              )}
            </div>
          </ListboxItem>

          {/* <ListboxItem
            key="f2"
            className={
              activeTab === "f2"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<FiFileText className={iconClasses} />}
            onClick={() => {
              selectionChange("f2");
            }}
          >
            Edit file
          </ListboxItem>

          <ListboxItem
            key="f3"
            className={
              activeTab === "f3"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<FiFileText className={iconClasses} />}
            onClick={() => {
              selectionChange("f3");
            }}
          >
            Edit file
          </ListboxItem>

          <ListboxItem
            key="f4"
            className={
              activeTab === "f4"
                ? "bg-[#eaeae9] text-black"
                : "bg-transparent text-[#71717a]"
            }
            startContent={<FiFileText className={iconClasses} />}
            onClick={() => {
              selectionChange("f4");
            }}
          >
            Edit file
          </ListboxItem> */}
        </ListboxSection>
      </Listbox>
    </div>
  );
};

export default Files;
