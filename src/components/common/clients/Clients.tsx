import React, { useState } from "react";
import { Dropdown, Modal, Select } from "antd";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots_gray.svg";
import { useQueryParams } from "helper/query.helper";
import DropdownActions from "./DropdownActions";
import {
  LAWYER_CHATBOT_CLIENTS,
  PROSPECT_CLIENTS,
  CLIENT_ACTIVATION,
} from "consts/query.const";
import { useLocation } from "react-router-dom";
import ProspectClients from "./ProspectClients";
import ClientActivation from "./ClientActivation";
import LawyerChatbotClients from "./LawyerChatbotClients";
import clsx from "clsx";
import { ClientsTabsMap } from "consts/clients.const";
import ModalAssignTo from "./modals/ModalAssignTo";
import ModalChangeType from "./modals/ModalChangeType";
import { ChangeTypeEnum } from "interfaces/dashboard/clients/changeType.interface";

interface Params {
  clientsTableTab: string;
}

interface ClientsProps {
  isPage?: boolean;
}

const Clients: React.FC<ClientsProps> = ({ isPage = false }) => {
  const location = useLocation();
  const initialUrlParams = new URLSearchParams(location.search);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useQueryParams<Params>();
  const [currentTab, setCurrentTab] = useState<string>(
    params.clientsTableTab ?? PROSPECT_CLIENTS
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState({
    isOpen: false,
    title: "",
    description: "",
    serviceType: ChangeTypeEnum.DISSOLUTION,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const hideTypeModal = () => {
    setModalType({
      ...modalType,
      isOpen: false,
    });
  };

  const onChange = (key: string) => {
    setSelectedRowKeys([]);
    setParams({ clientsTableTab: key });
    setCurrentTab(key);
  };

  const handleAssignTo = () => {
    showModal();
  };

  const handleChangeToDissolutionClient = () => {
    setModalType({
      isOpen: true,
      title: "Change to Dissolution Client",
      description: "Are you sure you want to change to Dissolution Client?",
      serviceType: ChangeTypeEnum.DISSOLUTION,
    });
  };

  const handleChangeToLawyerChatbotClient = () => {
    setModalType({
      isOpen: true,
      title: "Change to Lawyer Chatbot Client",
      description: "Are you sure you want to change to Lawyer Chatbot Client?",
      serviceType: ChangeTypeEnum.AI_CHATBOT,
    });
  };

  const items: TabsProps["items"] = [
    {
      key: CLIENT_ACTIVATION,
      label: ClientsTabsMap[CLIENT_ACTIVATION],
      children: (
        <ClientActivation
          isPage={isPage}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      ),
    },
    {
      key: PROSPECT_CLIENTS,
      label: ClientsTabsMap[PROSPECT_CLIENTS],
      children: (
        <ProspectClients
          isPage={isPage}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      ),
    },
    {
      key: LAWYER_CHATBOT_CLIENTS,
      label: ClientsTabsMap[LAWYER_CHATBOT_CLIENTS],
      children: (
        <LawyerChatbotClients
          isPage={isPage}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      ),
    },
  ];

  return (
    <>
      <section className="p-10">
        <div className="border border-[#C2C9CE] rounded-lg">
          <div className="flex justify-between px-6 py-[14px] items-center border-b border-[#C2C9CE]">
            <div>
              <h3 className="text-2xl font-semibold font-figtree">
                {"Client Management"}
              </h3>
            </div>
            {selectedRowKeys.length > 0 && (
              <Dropdown
                menu={{
                  items: DropdownActions(
                    handleAssignTo,
                    handleChangeToDissolutionClient,
                    handleChangeToLawyerChatbotClient,
                    null,
                    currentTab
                  ),
                }}
                trigger={["click"]}
              >
                <VerticalDotsIcon className="cursor-pointer" />
              </Dropdown>
            )}
          </div>
          <Tabs
            defaultActiveKey={params.clientsTableTab}
            items={items}
            onChange={onChange}
            className={clsx("custom-tabs", { "is-page": isPage })}
          />
        </div>
      </section>

      <ModalAssignTo
        isModalOpen={isModalOpen}
        selectedRowIDs={selectedRowKeys}
        closeModal={hideModal}
      />

      <ModalChangeType
        isModalOpen={modalType.isOpen}
        selectedRowIDs={selectedRowKeys}
        closeModal={hideTypeModal}
        description={modalType.description}
        title={modalType.title}
        serviceType={modalType.serviceType}
      />
    </>
  );
};

export default Clients;
