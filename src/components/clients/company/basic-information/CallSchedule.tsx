import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useQueryParams } from "helper/query.helper";

import ShowTotal from "components/common/dataTable/TotalPages";
import { PAGINATION_ITEMS_PER_PAGE } from "helper/pagination.helper";
import { CALL_SCHEDULE, ENCORE_TASK } from "consts/query.const";
import { getCallSchedule } from "api/company.api";
import { DataType, Params } from "interfaces/company/company.interface";
import { useParams } from "react-router-dom";

const columns = (): TableColumnsType<DataType> => [
  {
    title: "Meeting",
    dataIndex: "meetingType",
    key: "meetingType",
    render: (meetingType) => meetingType,
    width: "200px",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render: (time: string | number | Date) => {
      const options: Intl.DateTimeFormatOptions = {
        timeZoneName: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
      };

      const dateFormatter = new Intl.DateTimeFormat(
        navigator.language || "en-US",
        options
      );

      const date =
        typeof time === "string" || typeof time === "number"
          ? new Date(time)
          : time;

      return dateFormatter.format(date);
    },
    width: 270,
  },
  {
    title: "Method Type",
    dataIndex: "platform",
    key: "platform",
    width: 150,
  },
  {
    title: "",
    dataIndex: "",
    key: "",
  },
];

const CallSchedule = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [params, setParams] = useQueryParams<Params>({
    callScheduleLimit: 5,
    callSchedulePage: 1,
  });

  const { data, isLoading } = getCallSchedule(CALL_SCHEDULE, companyId, {
    limit: params.callScheduleLimit,
    page: params.callSchedulePage,
  });

  return (
    <>
      <section className="px-10 mt-8 max-w-[882px]">
        <div className="border border-[#C2C9CE] rounded-lg">
          <div className="flex justify-between px-6 py-[14px] items-center border-b border-[#C2C9CE]">
            <h3 className="text-2xl font-semibold font-figtree">
              Call Schedule
            </h3>
          </div>
          <Table<DataType>
            columns={columns()}
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
                      callScheduleLimit: Number(value),
                      callSchedulePage: 1,
                    });
                  }}
                />
              ),
            }}
          />
        </div>
      </section>
    </>
  );
};

export default CallSchedule;
