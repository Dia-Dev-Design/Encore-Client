import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useAssignTo } from "api/tasks.api";
import StaffUsers from "components/common/users/StaffUsers";
import UsersByCompany from "components/common/users/UsersByCompany";
import { CLIENT_TASK, ENCORE_TASK } from "consts/query.const";
import React, { useState } from "react";

interface ModalAssignToProps {
  isModalOpen: boolean;
  selectedRowIDs: React.Key[] | undefined;
  closeModal: () => void;
  taskType: string;
  companyId: string;
  isAdmin?: boolean;
}

const ModalAssignTo = ({
  selectedRowIDs,
  isModalOpen,
  closeModal,
  taskType,
  companyId,
  isAdmin = false,
}: ModalAssignToProps) => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const { mutate, isPending } = useAssignTo();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const handleAssignTo = () => {
    const payload = {
      ids: selectedRowIDs,
      userId: selectedValue,
      taskType: taskType,
    };

    mutate(
      {
        ...payload,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [CLIENT_TASK] });
          queryClient.invalidateQueries({ queryKey: [ENCORE_TASK] });

          messageApi.open({
            type: "success",
            content: "User changed successfully",
            duration: 10,
          });
          closeModal();
        },
        onError: (error, payload) => {
          messageApi.open({
            type: "error",
            content: "Error changing user",
            duration: 10,
          });
        },
      }
    );
  };

  const handleChangeSelect = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Assigned to"
        open={isModalOpen}
        width={400}
        confirmLoading={isPending}
        okText="Save"
        onOk={handleAssignTo}
        onCancel={closeModal}
        onClose={closeModal}
      >
        {isAdmin ? (
          <StaffUsers handleChange={handleChangeSelect} />
        ) : (
          <UsersByCompany
            handleChange={handleChangeSelect}
            companyId={companyId}
          />
        )}
      </Modal>
    </>
  );
};

export default ModalAssignTo;
