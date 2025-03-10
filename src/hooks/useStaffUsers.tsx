import { getStaffUsers } from "api/users.config";

const useStaffUsers = () => {
  const { data, isLoading, error } = getStaffUsers();
  return { data, isLoading, error };
};

export default useStaffUsers;
