import { useQueryClient } from "@tanstack/react-query";
import { Input, message, Modal, Radio, Select } from "antd";
import { createCategory, moveToCategory } from "api/clientChatbot.api";
import { CATEGORY_AND_CHATS, CATEGORY_LIST } from "consts/clientPanel/clientQuery.const";
import { CategoryThread } from "interfaces/clientDashboard/categoryThread.interface";
import { CreateCategoryParams } from "interfaces/clientDashboard/createCategory.interface";
import { MoveToCategoryParams } from "interfaces/clientDashboard/moveToCategory.interface";
import React, { useState } from "react";

interface ModalMoveChatToCategoryProps {
    categories: CategoryThread[];
    isModalOpen: boolean;
    closeModal: () => void;
    chatbotThreadId: string | undefined;
    setIsCategoryBeingCreated: (value: boolean) => void;
}

const ModalMoveChatToCategory: React.FC<ModalMoveChatToCategoryProps> =({
    categories, isModalOpen, closeModal, chatbotThreadId, setIsCategoryBeingCreated
}) => {
    const queryClient = useQueryClient();
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categoryName, setCategoryName] = useState<string>("");
    const { mutate: moveToCategoryMutation, isPending: isMovingToCategory } = moveToCategory(chatbotThreadId as string);
    const { mutate: createNewCategory, isPending: isCreatingNewCategory } = createCategory();
    const [messageApi, contextHolder] = message.useMessage();

    const handleDecision = () => {
        if (selectedOption === "Move") {
            if (selectedCategory === "") {
                messageApi.open({
                    type: "error",
                    content: "Please choose a category to move the chat",
                    duration: 10,
                });
                return;
            }
            processMoveToCategory(selectedCategory);
        } else if (selectedOption === "Create") {
            console.log("Create new category");
            handleNewCategory();
        }
    };

    const handleNewCategory = () => {
        if (categoryName === "") {
            messageApi.open({
                type: "error",
                content: "Please type a name for the category",
                duration: 10,
            });
            return;
        }
        const payload: CreateCategoryParams = {
            name: categoryName as string,
        };
        setIsCategoryBeingCreated(true);
        createNewCategory(payload, { 
            onSuccess: (data) => {
                console.log("Endpoint result:", data);
                processMoveToCategory(data.id);
                setIsCategoryBeingCreated(false);
            },
            onError: (error, payload) => {
                console.error("Error:", error, payload);
                setIsCategoryBeingCreated(false);
            },
        });
    }

    const processMoveToCategory = (categoryId: string) => {
        const payload: MoveToCategoryParams = {
            category_id: categoryId,
        };
        moveToCategoryMutation(payload,
        {
            onSuccess: () => {
                messageApi.open({
                    type: "success",
                    content: "Chat moved to category",
                    duration: 10,
                });
                queryClient.invalidateQueries({ queryKey: [CATEGORY_AND_CHATS] });
                queryClient.invalidateQueries({ queryKey: [CATEGORY_LIST] });
                closeModal();
            },
            onError: (error, payload) => {
                messageApi.open({
                    type: "error",
                    content: "Error updating chat to category",
                    duration: 10,
                });
            },
            }
        );
    }

    const onChangeCategory = (value: string) => {
        setSelectedOption("Move");
        setSelectedCategory(value);
    }

    const onChangeCategoryName = (value: string) => {
        setSelectedOption("Create");
        setCategoryName(value);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title="Move Chat to a Category"
                open={isModalOpen}
                width={400}
                confirmLoading={isMovingToCategory || isCreatingNewCategory}
                okText="Save"
                onOk={handleDecision}
                onCancel={closeModal}
                onClose={closeModal}
            >
                <Radio.Group 
                    value={selectedOption} 
                    onChange={(e) => setSelectedOption(e.target.value)}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem 0.5rem" }}
                >
                    <Radio value={"Move"}>
                        <p className="font-figtree text-neutrals-black text-base font-medium">Move to an existent category</p>
                    </Radio>
                    <div>
                        <Select 
                            placeholder="Select a Category"
                            onChange={onChangeCategory}
                            style={{ width: "100%" }}
                            options={categories?.map((category: CategoryThread) => ({
                                value: category.id,
                                label: category.name,
                            }))}
                        />
                    </div>
                    <Radio value={"Create"}>
                        <p className="font-figtree text-neutrals-black text-base font-medium">Create a new category for this chat</p>
                    </Radio>
                    <div>
                        <Input 
                            placeholder="Type a name"
                            value={categoryName} 
                            onChange={e => onChangeCategoryName(e.target.value)}
                        />
                    </div>
                </Radio.Group>
            </Modal>
        </>
    );
};

export default ModalMoveChatToCategory;
