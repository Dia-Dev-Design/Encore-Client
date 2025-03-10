import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useDeleteTasks } from "api/tasks.api";
import { CLIENT_TASK, ENCORE_TASK } from "consts/query.const";
import React from "react";

interface ModalDeleteProps {
  isModalOpen: boolean;
  selectedRowIDs: React.Key[] | undefined;
  description: string;
  closeModal: () => void;
  title: string;
}

const ModalDelete = ({
  selectedRowIDs,
  isModalOpen,
  closeModal,
  description,
  title,
}: ModalDeleteProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useDeleteTasks();

  const handleChange = () => {
    const payload = {
      ids: selectedRowIDs,
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
            content: "Successful removal",
            duration: 10,
          });
          closeModal();
        },
        onError: (error, payload) => {
          messageApi.open({
            type: "error",
            content: "Error deleting",
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
        className="modal-delete"
        confirmLoading={isPending}
        okText="Delete"
        onOk={handleChange}
        onCancel={closeModal}
        onClose={closeModal}
      >
        <p>{description}</p>
      </Modal>
    </>
  );
};

export default ModalDelete;
