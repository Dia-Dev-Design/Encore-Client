import { useQueryClient } from "@tanstack/react-query";
import { message, Modal } from "antd";
import { useCompleteTasks, useDeleteTasks } from "api/tasks.api";
import { CLIENT_TASK, ENCORE_TASK } from "consts/query.const";
import React from "react";

interface ModalMarkAsCompleteProps {
  isModalOpen: boolean;
  selectedRowIDs: React.Key[] | undefined;
  description: string;
  closeModal: () => void;
  title: string;
}

const ModalMarkAsComplete = ({
  selectedRowIDs,
  isModalOpen,
  closeModal,
  description,
  title,
}: ModalMarkAsCompleteProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCompleteTasks();

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
            content: "Completed successfully",
            duration: 10,
          });
          closeModal();
        },
        onError: (error, payload) => {
          messageApi.open({
            type: "error",
            content: "Error completing task",
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
        okText="Ok"
        onOk={handleChange}
        onCancel={closeModal}
        onClose={closeModal}
      >
        <p>{description}</p>
      </Modal>
    </>
  );
};

export default ModalMarkAsComplete;
