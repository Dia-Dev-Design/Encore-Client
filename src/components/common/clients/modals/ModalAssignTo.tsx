import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useAssignTo } from "api/clients.api";
import StaffUsers from "components/common/users/StaffUsers";
import {
  DISSOLUTION_CLIENTS,
  LAWYER_CHATBOT_CLIENTS,
  PROSPECT_CLIENTS,
} from "consts/query.const";
import React, { useState } from "react";

interface ModalAssignToProps {
  isModalOpen: boolean;
  selectedRowIDs: React.Key[] | undefined;
  closeModal: () => void;
}

const ModalAssignTo = ({
  selectedRowIDs,
  isModalOpen,
  closeModal,
}: ModalAssignToProps) => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const { mutate, isPending } = useAssignTo();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const handleAssignTo = () => {
    const payload = {
      companyIds: selectedRowIDs,
      staffUserId: selectedValue,
    };

    mutate(
      {
        ...payload,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [PROSPECT_CLIENTS] });
          queryClient.invalidateQueries({ queryKey: [DISSOLUTION_CLIENTS] });
          queryClient.invalidateQueries({ queryKey: [LAWYER_CHATBOT_CLIENTS] });

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
        <StaffUsers handleChange={handleChangeSelect} />
      </Modal>
    </>
  );
};

export default ModalAssignTo;
