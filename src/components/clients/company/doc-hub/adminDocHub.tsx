import { Dropdown, Table, TableColumnsType, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { ReactComponent as VerticalDotsIcon } from "assets/icons/vertical_dots_gray.svg";
import DocIcon  from "assets/icons/DocHubOff.svg";
import { DocHubDataType, Params } from "interfaces/clientDashboard/dochub/dochub.interface";
import { FilterValue, SorterResult, TablePaginationConfig, TableRowSelection } from "antd/es/table/interface";
import { getDefaultSortOrder } from "helper/table.helper";
import { useQueryParams } from "helper/query.helper";
import { CLIENT_DOCS, COMPANY_DATA } from "consts/clientPanel/clientQuery.const";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import ShowTotal from "components/common/dataTable/TotalPages";
import { SortOrder } from "interfaces/table.interface";
import { useParams } from "react-router-dom";
import { getCompanyData, getRecentDocumentsAdmin } from "api/adminDocHub.api";

const AdminDocHub: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const { data: companyData, isLoading: companyDataLoading } = getCompanyData(COMPANY_DATA, companyId || "");
    const [folderID, setFolderID] = useState<string>("");
    const [params, setParams] = useQueryParams<Params>({
        documentLimit: 5,
        documentPage: 1,
    });
    const { data, isLoading } = getRecentDocumentsAdmin(CLIENT_DOCS, folderID, {
        limit: params.documentLimit,
        page: params.documentPage,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    
    useEffect(()=>{
        console.log(companyData);
        if (companyData?.rootFolderId){
            setFolderID(companyData.rootFolderId)
        }
    }, [companyData]);

    const loadOrders = (name: string, params: Params) => {
        return getDefaultSortOrder(
            name,
            params.documentSortOption,
            params.documentSortOrder
        );
    };

    const columns = (
        params: Params
    ): TableColumnsType<DocHubDataType> => [
        {
            title: "Name",
            dataIndex: "name",
            key: "docName",
            width: "200px",
            sorter: true,
            defaultSortOrder: loadOrders("docName", params),
        },
        {
            title: "Product Tag",
            dataIndex: "product",
            key: "productTag",
            sorter: true,
            defaultSortOrder: loadOrders("productTag", params),
        },
        {
            title: "Task/Chat",
            dataIndex: "taskOrChat",
            key: "taskName",
            sorter: true,
            defaultSortOrder: loadOrders("taskName", params),
        },
        {
            title: "Owner",
            dataIndex: "owner",
            key: "owner",
            sorter: true,
            defaultSortOrder: loadOrders("owner", params),
        },
        {
            title: "Upload Date",
            dataIndex: "uploadDate",
            key: "uploadDate",
            render: (uploadDate) => new Date(uploadDate).toLocaleDateString(),
            sorter: true,
            defaultSortOrder: loadOrders("uploadDate", params),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            width: 150,
            sorter: true,
            defaultSortOrder: loadOrders("assignedToName", params),
        },
        {
            title: "Download",
            dataIndex: "downloadUrl",
            key: "downloadUrl",
            render: (link) => <Tooltip title="Download File"><a href={link} target="_blank"><img src={DocIcon} alt="Download"/> </a></Tooltip>,            
            width: "50px",
            sorter: false,
            defaultSortOrder: loadOrders("downloadUrl", params),
        },
        // {
        //     title: "Actions",
        //     dataIndex: "actions",
        //     key: "actions",
        //     render: (_, record) => (
        //         <Dropdown
        //             menu={{
        //                 items: DropdownActions<DocHubDataType>(
        //                 handleAssignTo,
        //                 handleMarkAsComplete,
        //                 handleDeleteTask,
        //                 record
        //                 ),
        //             }}
        //             trigger={["click"]}
        //         >
        //         <VerticalDotsIcon className="cursor-pointer" />
        //         </Dropdown>
        //     ),
        // },
    ];

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DocHubDataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<DocHubDataType> | SorterResult<DocHubDataType>[]
    ) => {
        const multipleSort = Array.isArray(sorter) ? sorter[0] : sorter;

        setParams({
            documentPage: pagination.current,
            documentLimit: pagination.pageSize,
            documentSortOption: multipleSort.order
            ? multipleSort.columnKey?.toString()
            : null,
            documentSortOrder: multipleSort.order
            ? multipleSort.order === "ascend"
                ? SortOrder.ASC
                : SortOrder.DESC
            : null,
        });
    };

    return (
        <section className="w-full h-full p-0 m-0 md:px-10 md:pt-6">
            <div className="w-full h-full md:h-[76vh] flex flex-row md:gap-4">
                <section className="w-full px-10">
                    <div className="border border-[#C2C9CE] rounded-lg">
                        <div className="flex justify-between px-6 py-[14px] items-center border-b border-[#C2C9CE]">
                            <h3 className="text-2xl font-semibold font-figtree">Recent Documents</h3>
                        </div>
                        <Table<DocHubDataType>
                            rowSelection={rowSelection}
                            columns={columns(
                                params
                            )}
                            dataSource={data?.data}
                            loading={isLoading || companyDataLoading}
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
                                            documentLimit: Number(value),
                                            documentPage: 1,
                                        });
                                    }}
                                />
                            ),
                            }}
                            onChange={handleTableChange}
                        />
                    </div>
                </section>
            </div>
        </section>
    );
};


export default AdminDocHub;
