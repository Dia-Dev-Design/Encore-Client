import { Select } from "antd";
import useStaffUsers from "hooks/useStaffUsers";
import useUsersByCompany from "hooks/useUsersByCompany";

interface StaffUsersProps {
  handleChange: (value: string) => void;
  companyId: string;
}

const UsersByCompany = ({ handleChange, companyId }: StaffUsersProps) => {
  const { data, isLoading } = useUsersByCompany(companyId);

  return !isLoading ? (
    <div className="flex flex-col justify-center mt-8 mb-10 w-full">
      <span className="text-greys-700 text-xs font-medium block text-left font-figtree mb-1">
        Select User
      </span>
      <Select
        placeholder="Select User"
        className="custom-select w-full"
        style={{ width: "100%" }}
        loading={isLoading}
        showSearch
        onChange={handleChange}
        optionFilterProp="label"
        options={data?.map((user: any) => ({
          value: user.id,
          label: user.name,
        }))}
      />
    </div>
  ) : (
    <></>
  );
};

export default UsersByCompany;
