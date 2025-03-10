import React, { useState } from "react";
import { Dropdown, Progress, Select, Table } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots.svg";
import { useQueryParams } from "helper/query.helper";
import { getActionableTasks, getClients } from "api/dashboard.api";

import ShowTotal from "components/common/dataTable/TotalPages";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import DropdownActions from "./DropdownActions";
import { LAWYER_CHATBOT_CLIENTS, PROSPECT_CLIENTS } from "consts/query.const";
import {
  DataType,
  Params,
  Props,
} from "interfaces/dashboard/clients/lawyerChatbotClients.interface";
import Status from "components/common/status/Status";
import { LawyerChatbotClientsStatusMap } from "consts/status.const";
import { getDefaultSortOrder } from "helper/table.helper";
import { SortOrder } from "interfaces/table.interface";
import InputSearch from "../search/Search";
import {
  LawyerRequestEnum,
  LawyerRequestsData,
  LawyerRequestsMap,
} from "consts/clients.const";
import ModalChangeType from "./modals/ModalChangeType";
import { ChangeTypeEnum } from "interfaces/dashboard/clients/changeType.interface";
import _ from "lodash";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const loadOrders = (name: string, params: Params) => {
  return getDefaultSortOrder(
    name,
    params.lawyerChatbotClientsSortOption,
    params.lawyerChatbotClientsSortOrder
  );
};

const columns = (
  handleAssignTo: (record?: DataType) => void,
  handleChangeToDissolutionClient: (record?: DataType) => void,
  handleChangeToLawyerChatbotClient: (record?: DataType) => void,
  params: Params
): TableColumnsType<DataType> => [
  {
    title: "Company name",
    dataIndex: "name",
    key: "name",
    width: "300px",
    sorter: true,
    defaultSortOrder: loadOrders("name", params),
  },
  {
    title: "Last Topic",
    dataIndex: "chatbotLastTopic",
    key: "chatbotLastTopic",
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    sorter: true,
    defaultSortOrder: loadOrders("chatbotDate", params),
  },
  {
    title: "Layer Request",
    dataIndex: "chatbotHasRequest",
    key: "chatbotHasRequest",
    render: (chatbotHasRequest) =>
      chatbotHasRequest
        ? LawyerRequestsMap[LawyerRequestEnum.YES]
        : LawyerRequestsMap[LawyerRequestEnum.NO],
  },
  {
    title: "Status",
    dataIndex: "chatbotStatus",
    key: "chatbotStatus",

    render: (chatbotStatus) => (
      <Status
        text={LawyerChatbotClientsStatusMap[chatbotStatus]}
        type={chatbotStatus}
      />
    ),
    sorter: true,
    defaultSortOrder: loadOrders("chatbotStatus", params),
  },

  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_, record) => (
      <Dropdown
        menu={{
          items: DropdownActions<DataType>(
            handleAssignTo,
            handleChangeToDissolutionClient,
            handleChangeToLawyerChatbotClient,
            record,
            LAWYER_CHATBOT_CLIENTS
          ),
        }}
        trigger={["click"]}
      >
        <VerticalDotsIcon className="cursor-pointer" />
      </Dropdown>
    ),
  },
];

const LawyerChatbotClients = ({
  selectedRowKeys,
  setSelectedRowKeys,
  isPage = false,
}: Props) => {
  const [params, setParams] = useQueryParams<Params>({
    lawyerChatbotClientsLimit: 5,
    lawyerChatbotClientsPage: 1,
  });

  const [actionIdsRow, setActionIdsRow] = useState<React.Key[]>();
  const [modalType, setModalType] = useState({
    isOpen: false,
    title: "",
    description: "",
    serviceType: ChangeTypeEnum.AI_CHATBOT,
  });

  const { data, isLoading } = getClients(LAWYER_CHATBOT_CLIENTS, {
    limit: params.lawyerChatbotClientsLimit,
    tableType: LAWYER_CHATBOT_CLIENTS,
    page: params.lawyerChatbotClientsPage,
    hasReqChatbotLawyer: params.lawyerChatbotClientsRequest,
    sortOption: params.lawyerChatbotClientsSortOption,
    sortOrder: params.lawyerChatbotClientsSortOrder,
    search: params.lawyerChatbotClientsSearch,
  });

  const hideTypeModal = () => {
    setModalType({
      ...modalType,
      isOpen: false,
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleAssignTo = (record?: DataType) => {
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    const multipleSort = Array.isArray(sorter) ? sorter[0] : sorter;

    setParams({
      lawyerChatbotClientsPage: pagination.current,
      lawyerChatbotClientsLimit: pagination.pageSize,
      lawyerChatbotClientsSortOption: multipleSort.order
        ? multipleSort.columnKey?.toString()
        : null,
      lawyerChatbotClientsSortOrder: multipleSort.order
        ? multipleSort.order === "ascend"
          ? SortOrder.ASC
          : SortOrder.DESC
        : null,
    });
  };

  const handleChangeToDissolutionClient = (record?: DataType) => {
    if (record) {
      setActionIdsRow([record.id]);
      setModalType({
        isOpen: true,
        title: "Change to Dissolution Client",
        description: "Are you sure you want to change to Dissolution Client?",
        serviceType: ChangeTypeEnum.DISSOLUTION,
      });
    }
  };


  const handleSelectChange = (value: string) => {
    setParams({ lawyerChatbotClientsRequest: value ? value : undefined });
  };

  const handleSearch = (value: string) => {
    setParams({ lawyerChatbotClientsSearch: value ? value : undefined });
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      {isPage && (
        <div className="flex mb-6 justify-between items-end px-4 mt-4">
          <div className="flex flex-col">
            <span className="text-greys-700 text-xs font-medium font-figtree mb-1">
              Select Lawyer Request
            </span>
            <Select
              placeholder="Select Lawyer Request"
              className="custom-select"
              style={{ width: 384 }}
              onChange={handleSelectChange}
              options={[
                { value: "", label: "All lawyer request", key: "show-all" },
                ...LawyerRequestsData,
              ]}
            />
          </div>
          <InputSearch
            onSearch={handleSearch}
            defaultValue={params.lawyerChatbotClientsSearch}
          />
        </div>
      )}

      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns(
          handleAssignTo,
          handleChangeToDissolutionClient,
          _,
          params
        )}
        dataSource={data?.data}
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
                  lawyerChatbotClientsLimit: Number(value),
                  lawyerChatbotClientsPage: 1,
                });
              }}
            />
          ),
        }}
        onChange={handleTableChange}
      />

      <ModalChangeType
        isModalOpen={modalType.isOpen}
        selectedRowIDs={actionIdsRow}
        closeModal={hideTypeModal}
        description={modalType.description}
        title={modalType.title}
        serviceType={modalType.serviceType}
      />
    </>
  );
};

export default LawyerChatbotClients;
