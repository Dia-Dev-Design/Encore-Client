import { STAFF_USERS, USERS_BY_COMPANY } from "consts/query.const";
import apiClient, { unwrapAxiosResponse } from "./client.config";
import { useQuery } from "@tanstack/react-query";

export function getStaffUsers() {
  return useQuery({
    queryKey: [STAFF_USERS],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/staff-user/simple-list`, {
          signal,
        })
        .then(unwrapAxiosResponse),
  });
}

export function getUsersByCompany(companyId: string) {
  return useQuery({
    queryKey: [USERS_BY_COMPANY, companyId],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/user/by-company/${companyId}`, {
          signal,
        })
        .then(unwrapAxiosResponse),
  });
}
