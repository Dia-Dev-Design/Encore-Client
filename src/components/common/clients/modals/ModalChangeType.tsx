import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useChangeType } from "api/clients.api";
import {
  DISSOLUTION_CLIENTS,
  LAWYER_CHATBOT_CLIENTS,
  PROSPECT_CLIENTS,
} from "consts/query.const";
import { ChangeTypeEnum } from "interfaces/dashboard/clients/changeType.interface";
import React from "react";

interface ModalChangeTypeProps {
  isModalOpen: boolean;
  selectedRowIDs: React.Key[] | undefined;
  description: string;
  closeModal: () => void;
  title: string;
  serviceType: ChangeTypeEnum;
}

const ModalChangeType = ({
  selectedRowIDs,
  isModalOpen,
  closeModal,
  description,
  title,
  serviceType,
}: ModalChangeTypeProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useChangeType();

  const handleChangeType = () => {
    const payload = {
      companyIds: selectedRowIDs,
      serviceType: serviceType,
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
            content: "Type changed successfully",
            duration: 10,
          });
          closeModal();
        },
        onError: (error, payload) => {
          messageApi.open({
            type: "error",
            content: "Error changing type",
            duration: 10,
          });
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={title}
        open={isModalOpen}
        width={400}
        confirmLoading={isPending}
        okText="Save"
        onOk={handleChangeType}
        onCancel={closeModal}
        onClose={closeModal}
      >
        <p>{description}</p>
      </Modal>
    </>
  );
};

export default ModalChangeType;
