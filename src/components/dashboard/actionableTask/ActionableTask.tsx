import React, { useState } from "react";
import { Dropdown } from "antd";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots_gray.svg";
import { useQueryParams } from "helper/query.helper";
import EncoreTask from "./EncoreTask";
import DropdownActions from "./DropdownActions";
import { CLIENT_TASK, ENCORE_TASK } from "consts/query.const";
import ClientTasks from "./ClientTask";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import ModalDelete from "./modals/ModalDelete";
import ModalMarkAsComplete from "./modals/ModalMarkAsComplete";

interface Params {
  actionableTasksTableTab: string;
}

const ActionableTasks: React.FC = () => {
  const location = useLocation();
  const initialUrlParams = new URLSearchParams(location.search);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useQueryParams<Params>();
  const [modalDelete, setModalDelete] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  const [modalComplete, setModalComplete] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  const onChange = (key: string) => {
    setSelectedRowKeys([]);
    setParams({ actionableTasksTableTab: key });
  };

  const hideDeleteModal = () => {
    setModalDelete({
      ...modalDelete,
      isOpen: false,
    });
  };

  const hideCompleteModal = () => {
    setModalComplete({
      ...modalComplete,
      isOpen: false,
    });
  };


  const handleMarkAsComplete = () => {
    if (selectedRowKeys) {
      setModalComplete({
        isOpen: true,
        title: "Mark As Complete",
        description: "Are you sure to mark these tasks as complete?",
      });
    }
  };

  const handleDeleteTask = () => {
    if (selectedRowKeys) {
      setModalDelete({
        isOpen: true,
        title: "Delete Tasks",
        description: "Are you sure to delete these tasks?",
      });
    }
  };

  const items: TabsProps["items"] = [
    {
      key: ENCORE_TASK,
      label: "Encore Tasks",
      children: (
        <EncoreTask
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      ),
    },
    {
      key: CLIENT_TASK,
      label: "Client Tasks",
      children: (
        <ClientTasks
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      ),
    },
  ];

  return (
    <>
      <section className="px-10">
        <div className="border border-[#C2C9CE] rounded-lg">
          <div className="flex justify-between px-6 py-[14px] items-center border-b border-[#C2C9CE]">
            <h3 className="text-2xl font-semibold font-figtree">
              Actionable Tasks
            </h3>
            {selectedRowKeys.length > 0 && (
              <Dropdown
                menu={{
                  items: DropdownActions(
                    () => {},
                    handleMarkAsComplete,
                    handleDeleteTask
                  ),
                }}
                trigger={["click"]}
              >
                <VerticalDotsIcon className="cursor-pointer" />
              </Dropdown>
            )}
          </div>
          <Tabs
            defaultActiveKey={params.actionableTasksTableTab}
            items={items}
            onChange={onChange}
            className="custom-tabs"
          />
        </div>
      </section>
      <ModalDelete
        isModalOpen={modalDelete.isOpen}
        selectedRowIDs={selectedRowKeys}
        closeModal={hideDeleteModal}
        description={modalDelete.description}
        title={modalDelete.title}
      />

      <ModalMarkAsComplete
        isModalOpen={modalComplete.isOpen}
        selectedRowIDs={selectedRowKeys}
        closeModal={hideCompleteModal}
        description={modalComplete.description}
        title={modalComplete.title}
      />
    </>
  );
};

export default ActionableTasks;
