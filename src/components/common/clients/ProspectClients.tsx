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
} from "interfaces/dashboard/clients/prospectClients.interface";
import ShowTotal from "components/common/dataTable/TotalPages";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import { progressBar } from "helper/progressBar.helper";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import DropdownActions from "./DropdownActions";
import { PROSPECT_CLIENTS } from "consts/query.const";
import InputSearch from "../search/Search";
import {
  ClientsStageData,
  ClientsStageMap,
  CompanyStatusMap,
} from "consts/clients.const";
import { SortOrder } from "interfaces/table.interface";
import { getDefaultSortOrder } from "helper/table.helper";
import ModalAssignTo from "./modals/ModalAssignTo";
import { ChangeTypeEnum } from "interfaces/dashboard/clients/changeType.interface";
import ModalChangeType from "./modals/ModalChangeType";
import { Link } from "react-router-dom";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const loadOrders = (name: string, params: Params) => {
  return getDefaultSortOrder(
    name,
    params.prospectClientsSortOption,
    params.prospectClientsSortOrder
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
        to={`/dashboard/clients/company/${record.id}`}
      >
        {name}
      </Link>
    ),
  },
  {
    title: "Signed Up",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) => new Date(createdAt).toLocaleDateString(),
    sorter: true,
    defaultSortOrder: loadOrders("createdAt", params),
  },
  {
    title: "Company Status",
    dataIndex: "status",
    key: "status",
    sorter: true,
    defaultSortOrder: loadOrders("status", params),
    render: (status) => CompanyStatusMap[status],
  },
  {
    title: "Current Stage",
    dataIndex: "currentStage",
    key: "currentStage",
    sorter: true,
    defaultSortOrder: loadOrders("currentStage", params),
    render: (currentStage) => ClientsStageMap[currentStage],
  },
  {
    title: "Assigned to",
    dataIndex: "assignedTo",
    key: "assignedTo",
    render: (assignedTo) => assignedTo ? assignedTo.name : '',
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
            PROSPECT_CLIENTS
          ),
        }}
        trigger={["click"]}
      >
        <VerticalDotsIcon className="cursor-pointer" />
      </Dropdown>
    ),
  },
];

const ProspectClients = ({
  selectedRowKeys,
  setSelectedRowKeys,
  isPage = false,
}: Props) => {
  const [params, setParams] = useQueryParams<Params>({
    prospectClientsLimit: 5,
    prospectClientsPage: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionIdsRow, setActionIdsRow] = useState<React.Key[]>();
  const [modalType, setModalType] = useState({
    isOpen: false,
    title: "",
    description: "",
    serviceType: ChangeTypeEnum.DISSOLUTION,
  });

  const { data, isLoading } = getClients(PROSPECT_CLIENTS, {
    limit: params.prospectClientsLimit,
    tableType: PROSPECT_CLIENTS,
    page: params.prospectClientsPage,
    currentStage: params.prospectClientsCurrentStage,
    search: params.prospectClientsSearch,
    sortOption: params.prospectClientsSortOption,
    sortOrder: params.prospectClientsSortOrder,
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
      prospectClientsPage: pagination.current,
      prospectClientsLimit: pagination.pageSize,
      prospectClientsSortOption: multipleSort.order
        ? multipleSort.field?.toString()
        : null,
      prospectClientsSortOrder: multipleSort.order
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

  const handleSelectChange = (value: string) => {
    setParams({ prospectClientsCurrentStage: value ? value : undefined });
  };

  const handleSearch = (value: string) => {
    setParams({ prospectClientsSearch: value ? value : undefined });
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
              Current Stage
            </span>
            <Select
              placeholder="Select Current stage"
              className="custom-select"
              defaultValue={params.prospectClientsCurrentStage}
              style={{ width: 384 }}
              onChange={handleSelectChange}
              options={[
                { value: "", label: "All Stages", key: "show-all" },
                ...ClientsStageData,
              ]}
            />
          </div>
          <InputSearch
            onSearch={handleSearch}
            defaultValue={params.prospectClientsSearch}
          />
        </div>
      )}
      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns(
          handleAssignTo,
          handleChangeToDissolutionClient,
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
                  prospectClientsLimit: Number(value),
                  prospectClientsPage: 1,
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

export default ProspectClients;
