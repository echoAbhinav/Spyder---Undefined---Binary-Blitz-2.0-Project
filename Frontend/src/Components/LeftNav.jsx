import User_Dropdown from "./LeftNav/User_Dropdown";
import Files from "./LeftNav/Files";
import NewFiles from "./LeftNav/NewFiles";

const LeftNav = () => {
  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto  p-2 #bg-[#f7f7f5] bg-default-10">
      <User_Dropdown />
      <NewFiles />
    </div>
  );
};

export default LeftNav;
