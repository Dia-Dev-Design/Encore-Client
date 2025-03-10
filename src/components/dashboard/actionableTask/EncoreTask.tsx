import React, { useState } from "react";
import { Dropdown, Progress, Table } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots.svg";
import { useQueryParams } from "helper/query.helper";
import { getActionableTasks } from "api/dashboard.api";
import {
  DataType,
  Params,
  Props,
} from "interfaces/dashboard/actionableTask/encoreTask.interface";
import ShowTotal from "components/common/dataTable/TotalPages";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import { progressBar } from "helper/progressBar.helper";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import DropdownActions from "./DropdownActions";
import { ENCORE_TASK } from "consts/query.const";
import ModalAssignTo from "./modals/ModalAssignTo";
import ModalDelete from "./modals/ModalDelete";
import ModalMarkAsComplete from "./modals/ModalMarkAsComplete";
import { SortOrder } from "interfaces/table.interface";
import { getDefaultSortOrder } from "helper/table.helper";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

const loadOrders = (name: string, params: Params) => {
  return getDefaultSortOrder(
    name,
    params.encoreTaskSortOption,
    params.encoreTaskSortOrder
  );
};

const columns = (
  handleAssignTo: (record?: DataType) => void,
  handleMarkAsComplete: (record?: DataType) => void,
  handleDeleteTask: (record?: DataType) => void,
  params: Params
): TableColumnsType<DataType> => [
  {
    title: "Company Name",
    dataIndex: "company",
    key: "companyName",
    render: (company) => company.name,
    width: "150px",
    sorter: true,
    defaultSortOrder: loadOrders("companyName", params),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    sorter: true,
    defaultSortOrder: loadOrders("category", params),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    sorter: true,
    defaultSortOrder: loadOrders("description", params),
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (dueDate) => new Date(dueDate).toLocaleDateString(),
    sorter: true,
    defaultSortOrder: loadOrders("dueDate", params),
  },
  {
    title: "Assigned to",
    dataIndex: "admin",
    key: "assignedToName",
    render: (admin) => (admin ? admin.name : "N/A"),
    width: 150,
    sorter: true,
    defaultSortOrder: loadOrders("assignedToName", params),
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
            handleMarkAsComplete,
            handleDeleteTask,
            record
          ),
        }}
        trigger={["click"]}
      >
        <VerticalDotsIcon className="cursor-pointer" />
      </Dropdown>
    ),
  },
];

const EncoreTasks = ({ selectedRowKeys, setSelectedRowKeys }: Props) => {
  const [params, setParams] = useQueryParams<Params>({
    encoreTasksLimit: 5,
    encoreTasksPage: 1,
  });

  const [actionIdsRow, setActionIdsRow] = useState<React.Key[]>();

  const [modalAssign, setModalAssign] = useState({
    ids: [],
    userId: "",
    isOpen: false,
    taskType: ENCORE_TASK,
    companyId: "",
  });

  const [modalDelete, setModalDelete] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  const [modalComplete, setModalComplete] = useState({
    isOpen: false,
    title: "",
    description: "",
  });

  const { data, isLoading } = getActionableTasks(ENCORE_TASK, {
    limit: params.encoreTasksLimit,
    typeTask: ENCORE_TASK,
    page: params.encoreTasksPage,
    sortOption: params.encoreTaskSortOption,
    sortOrder: params.encoreTaskSortOrder,
  });

  const hideModal = () => {
    setModalAssign({
      ...modalAssign,
      isOpen: false,
    });
  };

  const hideDeleteModal = () => {
    setModalDelete({
      ...modalDelete,
      isOpen: false,
    });
  };

  const hideCompleteModal = () => {
    setModalComplete({
      ...modalComplete,
      isOpen: false,
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleAssignTo = (record?: DataType) => {
    if (record) {
      setModalAssign({
        ...modalAssign,
        ids: [record.id] as never[],
        companyId: record?.company?.id,
        isOpen: true,
      });
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    const multipleSort = Array.isArray(sorter) ? sorter[0] : sorter;

    setParams({
      encoreTasksPage: pagination.current,
      encoreTasksLimit: pagination.pageSize,
      encoreTaskSortOption: multipleSort.order
        ? multipleSort.columnKey?.toString()
        : null,
      encoreTaskSortOrder: multipleSort.order
        ? multipleSort.order === "ascend"
          ? SortOrder.ASC
          : SortOrder.DESC
        : null,
    });
  };

  const handleMarkAsComplete = (record?: DataType) => {
    if (record) {
      setActionIdsRow([record.id]);
      setModalComplete({
        isOpen: true,
        title: "Mark As Complete",
        description: "Are you sure to mark this task as complete?",
      });
    }
  };

  const handleDeleteTask = (record?: DataType) => {
    if (record) {
      setActionIdsRow([record.id]);
      setModalDelete({
        isOpen: true,
        title: "Delete Task",
        description: "Are you sure to delete this task?",
      });
    }
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns(
          handleAssignTo,
          handleMarkAsComplete,
          handleDeleteTask,
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
                  encoreTasksLimit: Number(value),
                  encoreTasksPage: 1,
                });
              }}
            />
          ),
        }}
        onChange={handleTableChange}
      />
      <ModalAssignTo
        companyId={modalAssign.companyId}
        isModalOpen={modalAssign.isOpen}
        selectedRowIDs={modalAssign.ids}
        closeModal={hideModal}
        taskType={modalAssign.taskType}
        isAdmin={true}
      />

      <ModalDelete
        isModalOpen={modalDelete.isOpen}
        selectedRowIDs={actionIdsRow}
        closeModal={hideDeleteModal}
        description={modalDelete.description}
        title={modalDelete.title}
      />
      <ModalMarkAsComplete
        isModalOpen={modalComplete.isOpen}
        selectedRowIDs={actionIdsRow}
        closeModal={hideCompleteModal}
        description={modalComplete.description}
        title={modalComplete.title}
      />
    </>
  );
};

export default EncoreTasks;
