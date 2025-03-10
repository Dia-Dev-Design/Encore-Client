import { Tooltip } from "antd";
import EncoreWhite from "assets/icons/chat/EncoreIconWhite.svg";
import Check from "assets/icons/check.svg";
import X from "assets/icons/x.svg";
import Edit from "assets/icons/edit.svg";


const InitialSupportInformation = () => {
  return (
    <div className="bg-primaryMariner-950 rounded-lg h-[678px] overflow-y-auto custom-gray-scroll">
      <div className="bg-primaryMariner-900 flex justify-between p-4">
        <h3 className="text-white text-2xl font-figtree font-semibold">
          Encore AI -
          <span className="text-lg"> Initial Support Information</span>
        </h3>
        <img src={EncoreWhite} alt="Encore AI" className="w-[53px]" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-greys-300 text-base font-figtree font-medium">
              1. General requirements for their industry Document
            </p>
            <ul className="text-white text-base font-figtree font-medium mt-2">
              <li>a. Document 1</li>
              <li>b. Document 2</li>
              <li>c. Document 3</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Tooltip title="Good Response">
              <img src={Check} alt="Check" className="w-[24px] cursor-pointer" />
            </Tooltip>
            <Tooltip title="Bad Response">
              <img src={X} alt="X" className="w-[24px] cursor-pointer" />
            </Tooltip>
            <Tooltip title="Edit">
              <img src={Edit} alt="Edit" className="w-[24px] cursor-pointer" />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSupportInformation;
