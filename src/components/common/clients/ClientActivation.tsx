import React, { useState } from "react";
import { Dropdown, Table, Modal, message } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots.svg";
import { useQueryParams } from "helper/query.helper";
import { getNonActivatedUsers } from "api/dashboard.api";

import ShowTotal from "components/common/dataTable/TotalPages";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { NON_ACTIVATED_USERS } from "consts/query.const";
import {
  ApiResponse,
  DataType,
  Params,
  Props,
} from "interfaces/dashboard/clients/nonActivatedUsers.interface";
import Status from "components/common/status/Status";
import { getDefaultSortOrder } from "helper/table.helper";
import { SortOrder } from "interfaces/table.interface";
import InputSearch from "../search/Search";
import { useActivateUser } from "api/users.api";
import { useQueryClient } from "@tanstack/react-query";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const loadOrders = (name: string, params: Params) => {
  return getDefaultSortOrder(
    name,
    params.nonActivatedUsersSortOption,
    params.nonActivatedUsersSortOrder
  );
};

const columns = (
  handleActivate: (record?: DataType) => void,
  params: Params
): TableColumnsType<DataType> => [
  {
    title: "User Name",
    dataIndex: "name",
    key: "name",
    width: "20%",
    sorter: true,
    defaultSortOrder: loadOrders("name", params),
    render: (name) => name || "No Name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: "20%",
    sorter: true,
  },
  {
    title: "Sign Up Date",
    dataIndex: "createdAt",
    key: "createdAt",
    width: "20%",
    render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    sorter: true,
    defaultSortOrder: loadOrders("createdAt", params),
  },

  {
    title: "Activation Status",
    dataIndex: "isActivated",
    key: "isActivated",
    width: "20%",
    align: "center",
    render: (isActivated) => (
      <Status
        text={isActivated ? "Activated" : "Not Activated"}
        type={isActivated ? "active" : "inactive"}
      />
    ),
    sorter: true,
    defaultSortOrder: loadOrders("isActivated", params),
  },

  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    width: "20%",
    align: "right",
    render: (_, record) => (
      <div className="flex justify-end pr-4">
        <Dropdown
          menu={{
            items: [
              {
                key: "activate",
                label: "Activate",
                onClick: () => handleActivate(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <VerticalDotsIcon className="cursor-pointer" />
        </Dropdown>
      </div>
    ),
  },
];

const NonActivatedUsersList = ({
  selectedRowKeys,
  setSelectedRowKeys,
  isPage = false,
}: Props) => {
  const [params, setParams] = useQueryParams<Params>({
    nonActivatedUsersLimit: 10,
    nonActivatedUsersPage: 1,
  });

  const queryClient = useQueryClient();
  const activateUserMutation = useActivateUser();
  const [messageApi, contextHolder] = message.useMessage();

  const [actionIdsRow, setActionIdsRow] = useState<React.Key[]>();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, error } = getNonActivatedUsers(NON_ACTIVATED_USERS, {
    limit: params.nonActivatedUsersLimit,
    page: params.nonActivatedUsersPage,
    tableType: NON_ACTIVATED_USERS,
    sortOption: params.nonActivatedUsersSortOption,
    sortOrder: params.nonActivatedUsersSortOrder,
    search: params.nonActivatedUsersSearch,
  });

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleModalConfirm = () => {
    if (actionIdsRow && actionIdsRow.length > 0) {
      activateUserMutation.mutate(actionIdsRow[0] as string, {
        onSuccess: () => {
          messageApi.success("User activated successfully");
          closeModal();
          queryClient.invalidateQueries({ queryKey: [NON_ACTIVATED_USERS] });
        },
        onError: () => {
          messageApi.error("Error activating user");
          closeModal();
        },
      });
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleActivate = (record?: DataType) => {
    if (record) {
      setActionIdsRow([record.id]);
      setModalOpen(true);
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    const multipleSort = Array.isArray(sorter) ? sorter[0] : sorter;

    setParams({
      nonActivatedUsersPage: pagination.current,
      nonActivatedUsersLimit: pagination.pageSize,
      nonActivatedUsersSortOption: multipleSort.order
        ? multipleSort.columnKey?.toString()
        : null,
      nonActivatedUsersSortOrder: multipleSort.order
        ? multipleSort.order === "ascend"
          ? SortOrder.ASC
          : SortOrder.DESC
        : null,
    });
  };

  const handleSearch = (value: string) => {
    setParams({ nonActivatedUsersSearch: value ? value : undefined });
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (error) {
    console.error("API Error:", error);
  }

  return (
    <>
      {contextHolder}
      <div className="mt-3">
        <div className="mb-4">
          <InputSearch
            onSearch={handleSearch}
            placeholder="Search users"
            width={256}
          />
        </div>
        <Table<DataType>
          rowSelection={rowSelection}
          rowKey="id"
          columns={columns(handleActivate, params)}
          dataSource={data?.users}
          loading={isLoading}
          rootClassName="custom-table"
          pagination={{
            current: data?.pagination?.currentPage,
            pageSize: data?.pagination?.limit,
            total: data?.pagination?.totalItems,
            pageSizeOptions: PAGINATION_ITEMS_PER_PAGE,

            showTotal: (total, range) => (
              <ShowTotal
                total={total}
                range={range}
                limit={data?.pagination?.limit}
                onChange={(value) => {
                  setParams({
                    nonActivatedUsersLimit: Number(value),
                    nonActivatedUsersPage: 1,
                  });
                }}
              />
            ),
          }}
          onChange={handleTableChange}
        />
      </div>

      <Modal
        title="Activate User"
        open={modalOpen}
        width={400}
        confirmLoading={activateUserMutation.isPending}
        okText="Activate"
        onOk={handleModalConfirm}
        onCancel={closeModal}
      >
        <p>Are you sure you want to activate this user?</p>
      </Modal>
    </>
  );
};

export default NonActivatedUsersList;
