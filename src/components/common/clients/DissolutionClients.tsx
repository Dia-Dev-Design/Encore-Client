import React, { useState } from "react";
import { Dropdown, Progress, Select, Table } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots.svg";
import { useQueryParams } from "helper/query.helper";
import { getClients } from "api/dashboard.api";
import {
  DataType,
  Params,
  Props,
} from "interfaces/dashboard/clients/dissolutionClients.interface";
import ShowTotal from "components/common/dataTable/TotalPages";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import { progressBar } from "helper/progressBar.helper";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import DropdownActions from "./DropdownActions";
import { DISSOLUTION_CLIENTS, ENCORE_TASK } from "consts/query.const";
import InputSearch from "../search/Search";
import { CompanyStatusData, CompanyStatusMap } from "consts/clients.const";
import { SortOrder } from "interfaces/table.interface";
import { getDefaultSortOrder } from "helper/table.helper";
import ModalAssignTo from "./modals/ModalAssignTo";
import ModalChangeType from "./modals/ModalChangeType";
import { ChangeTypeEnum } from "interfaces/dashboard/clients/changeType.interface";
import _ from "lodash";
import { Link } from "react-router-dom";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const loadOrders = (name: string, params: Params) => {
  return getDefaultSortOrder(
    name,
    params.dissolutionClientsSortOption,
    params.dissolutionClientsSortOrder
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
    render: (name, record) => (
      <Link
        className="text-primaryMariner-700 underline font-medium"
        to={`/dashboard/clients/dissolution/${record.id}`}
      >
        {name}
      </Link>
    ),
  },
  {
    title: "Location",
    dataIndex: "states",
    key: "location",
    render: (states) => {
      const statesJoin = states.map((state: string) => state).join(", ");

      return statesJoin ? statesJoin : "N/A";
    },
    sorter: true,
    defaultSortOrder: loadOrders("location", params),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => CompanyStatusMap[status],
    sorter: true,
    defaultSortOrder: loadOrders("status", params),
  },
  {
    title: "Task/Step",
    dataIndex: "task",
    key: "taskDescription",
    render: (task) => task.description,
    sorter: true,
    defaultSortOrder: loadOrders("taskDescription", params),
  },
  {
    title: "Assigned to",
    dataIndex: "assignedTo",
    key: "assignedTo",
    render: (assignedTo) => assignedTo?.name || "Unassigned",
    sorter: true,
    defaultSortOrder: loadOrders("assignedTo", params),
  },

  {
    title: "Progress",
    dataIndex: "progress",
    key: "progress",
    render: (progress) => (
      <Progress
        percent={progress}
        strokeColor={progressBar(progress)}
        showInfo={false}
      />
    ),
    width: "172px",
    sorter: true,
    defaultSortOrder: loadOrders("progress", params),
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
            DISSOLUTION_CLIENTS
          ),
        }}
        trigger={["click"]}
      >
        <VerticalDotsIcon className="cursor-pointer" />
      </Dropdown>
    ),
  },
];

const DissolutionClients = ({
  selectedRowKeys,
  setSelectedRowKeys,
  isPage = false,
}: Props) => {
  const [params, setParams] = useQueryParams<Params>({
    dissolutionClientsLimit: 5,
    dissolutionClientsPage: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionIdsRow, setActionIdsRow] = useState<React.Key[]>();
  const [modalType, setModalType] = useState({
    isOpen: false,
    title: "",
    description: "",
    serviceType: ChangeTypeEnum.DISSOLUTION,
  });

  const { data, isLoading } = getClients(DISSOLUTION_CLIENTS, {
    limit: params.dissolutionClientsLimit,
    tableType: DISSOLUTION_CLIENTS,
    page: params.dissolutionClientsPage,
    search: params.dissolutionClientsSearch,
    status: params.prospectClientsStatus,
    sortOption: params.dissolutionClientsSortOption,
    sortOrder: params.dissolutionClientsSortOrder,
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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleAssignTo = (record?: DataType) => {
    if (record) {
      setActionIdsRow([record.id]);
      showModal();
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    const multipleSort = Array.isArray(sorter) ? sorter[0] : sorter;

    setParams({
      dissolutionClientsPage: pagination.current,
      dissolutionClientsLimit: pagination.pageSize,
      dissolutionClientsSortOption: multipleSort.order
        ? multipleSort.columnKey?.toString()
        : null,
      dissolutionClientsSortOrder: multipleSort.order
        ? multipleSort.order === "ascend"
          ? SortOrder.ASC
          : SortOrder.DESC
        : null,
    });
  };


  const handleChangeToLawyerChatbotClient = (record?: DataType) => {
    if (record) {
      setActionIdsRow([record.id]);
      setModalType({
        isOpen: true,
        title: "Change to Lawyer Chatbot Client",
        description:
          "Are you sure you want to change to Lawyer Chatbot Client?",
        serviceType: ChangeTypeEnum.AI_CHATBOT,
      });
    }
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSelectChange = (value: string) => {
    setParams({ prospectClientsStatus: value ? value : undefined });
  };

  const handleSearch = (value: string) => {
    setParams({ dissolutionClientsSearch: value ? value : undefined });
  };

  return (
    <>
      {isPage && (
        <div className="flex mb-6 justify-between items-end px-4 mt-4">
          <div className="flex flex-col">
            <span className="text-greys-700 text-xs font-medium font-figtree mb-1">
              Status
            </span>
            <Select
              placeholder="Select Status"
              className="custom-select"
              style={{ width: 384 }}
              onChange={handleSelectChange}
              options={[
                { value: "", label: "All Status", key: "show-all" },
                ...CompanyStatusData,
              ]}
            />
          </div>
          <InputSearch
            onSearch={handleSearch}
            defaultValue={params.dissolutionClientsSearch}
          />
        </div>
      )}

      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns(
          handleAssignTo,
          _,
          handleChangeToLawyerChatbotClient,
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
                  dissolutionClientsLimit: Number(value),
                  dissolutionClientsPage: 1,
                });
              }}
            />
          ),
        }}
        onChange={handleTableChange}
      />

      <ModalAssignTo
        isModalOpen={isModalOpen}
        selectedRowIDs={actionIdsRow}
        closeModal={hideModal}
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

export default DissolutionClients;
