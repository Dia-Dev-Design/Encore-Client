import { getUsersByCompany } from "api/users.config";

const useUsersByCompany = (companyId: string) => {
  const { data, isLoading, error } = getUsersByCompany(companyId);
  return { data, isLoading, error };
};

export default useUsersByCompany;
