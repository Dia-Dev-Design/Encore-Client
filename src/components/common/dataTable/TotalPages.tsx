import { Select } from "antd";
import { PAGINATION_ITEMS_PER_PAGE_SELECT } from "helper/pagination.helper";

interface TotalPagesProps {
  total: number;
  limit: number;
  range: number[];
  onChange: (value: any) => void;
}

const ShowTotal = ({ total, range, limit, onChange }: TotalPagesProps) => {
  return (
    <div className="items-center flex justify-between w-full">
      <span className="text-greys-500 font-medium text-sm font-figtree">
        Show{" "}
        <Select
          className="mx-2 font-figtree text-greys-500"
          defaultValue={limit}
          style={{ width: 82 }}
          onChange={onChange}
          options={PAGINATION_ITEMS_PER_PAGE_SELECT}
        />{" "}
        <span className="text-greys-500 font-medium text-sm">per page </span>
      </span>
      <span className="ml-2 text-greys-500 font-medium text-sm font-figtree">
        {range[0]}-{range[1]} of {total}
      </span>
    </div>
  );
};

export default ShowTotal;
