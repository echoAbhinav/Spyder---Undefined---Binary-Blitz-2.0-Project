import React from "react";
import CardUI from "../Components/CardUI";
import { Shield } from "lucide-react";
import { Home, Bot, PlusCircle, Files, FileScan } from "lucide-react";

const Dashboardd = () => {
  const progress = 80;
  return (
    <div className="main w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 items-center justify-center">
        <CardUI
          title="AI Chat"
          description="Detect and filter inappropriate content"
          icon={<Bot size={80} className="" />}
        />

        <CardUI
          title="File Scanner"
          description="Detect and filter inappropriate content"
          icon={<FileScan size={80} className="" />}
        />

        <CardUI
          title="Web Analyzer"
          description="Detect and filter inappropriate content"
          icon={<Bot size={80} className="" />}
        />

        <CardUI
          title="NSFW Detector"
          description="Detect and filter inappropriate content"
          icon={<Bot size={80} className="" />}
        />
      </div>
    </div>
  );
};

export default Dashboardd;
