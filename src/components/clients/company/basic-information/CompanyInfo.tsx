import { LoadingType } from "consts/loading.const";
import { CompanyResponse } from "interfaces/company/company.interface";
import Loading from "pages/Loading/Loading";
import CompanyInfoItem from "./CompanyInfoItem";
import { Drawer } from "antd";
import { useState } from "react";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";
import ServicesForm from "./ServicesForm";
import { ClientsStageMap } from "consts/clients.const";

interface CompanyInfoProps {
  data: CompanyResponse;
  isLoading: boolean;
}

const CompanyInfo = ({ data, isLoading }: CompanyInfoProps) => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (isLoading || !data) return <Loading type={LoadingType.BLOCK} />;

  return (
    <div className="px-10">
      <div className="border border-greys-300 rounded-lg mt-6">
        <div className="flex justify-between border-b border-b-greys-300 py-[10px] px-6">
          <h2 className="text-neutrals-black font-semibold text-2xl font-figtree">
            Company Info
          </h2>

          <button
            className="bg-primaryMariner-700 text-white font-figtree font-medium px-4 py-2 rounded-lg"
            onClick={showDrawer}
          >
            Enable Services
          </button>
        </div>
        <div className="flex">
          <div className="flex-[0_0_917px] border-r border-r-greys-300">
            <div className="grid grid-cols-2 gap-24 pt-4 pl-6 pr-[114px]">
              <div className="col-span-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-1">
                        <CompanyInfoItem content="Contact name" type="title" />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem
                          content={data?.contactName}
                          type="description"
                        />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem content="Email address" type="title" />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem
                          content={data?.emailAddress}
                          className="underline"
                          type="description"
                        />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem content="Phone" type="title" />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem
                          content={data?.phone}
                          type="description"
                        />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem content="Industry type" type="title" />
                      </div>
                      <div className="col-span-1">
                        <CompanyInfoItem
                          content={data?.industryType.name}
                          type="description"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="grid grid-cols-2">
                      <div className="col-span-1">
                        <CompanyInfoItem
                          content="Company Location"
                          type="title"
                          className="max-w-[100px] block"
                        />
                      </div>
                      <div className="col-span-1 flex flex-col gap-3">
                        {data?.states.map((state, index) => (
                          <CompanyInfoItem
                            key={index}
                            content={state}
                            type="description"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-greys-300 p-6 mt-12">
                  <div className="grid grid-cols-4">
                    <div className="col-span-1">
                      <CompanyInfoItem content="Current Stage" type="title" />
                    </div>
                    <div className="col-span-1">
                      <CompanyInfoItem
                        content={ClientsStageMap[data?.currentStage] ?? data?.currentStage}
                        type="description"
                      />
                    </div>
                  </div>
                </div>
              </div>
          <div className="flex-auto"></div>
        </div>
      </div>
      <Drawer
        title="Services Ready to Enable"
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        className="custom-drawer"
        mask={false}
        width={252}
        rootClassName="company-detail-drawer-root"
        extra={<CloseOutlined onClick={onClose} className="text-2xl" />}
      >
        <ServicesForm services={data.services ?? []} />
      </Drawer>
    </div>
  );
};

export default CompanyInfo;
