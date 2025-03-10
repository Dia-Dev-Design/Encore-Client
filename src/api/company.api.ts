import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient, { unwrapAxiosResponse } from "./client.config";
import {
  CompanyResponse,
  IntakeCallFormRequest,
  ToggleCompanyServicesRequest,
} from "interfaces/company/company.interface";
import { Params } from "interfaces/table.interface";

export function getCompany(key: string, companyId: string | undefined) {
  return useQuery({
    queryKey: [key, companyId],
    queryFn: ({ signal }) =>
      apiClient
        .get<CompanyResponse>(`/api/companies/${companyId}/info`, {
          signal,
          params: {
            companyId,
          },
        })
        .then(unwrapAxiosResponse),
  });
}

export const useToggleCompanyServices = (companyId: string) =>
  useMutation({
    mutationFn: (params: ToggleCompanyServicesRequest) =>
      apiClient
        .post(
          `/api/companies/${companyId}/services/activate-deactivate`,
          params
        )
        .then(unwrapAxiosResponse),
  });

export function getCallSchedule(
  key: string,
  companyId: string | undefined,
  params: Params
) {
  return useQuery({
    queryKey: [key, params],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/companies/${companyId}/meetings`, {
          signal,
          params,
        })
        .then(unwrapAxiosResponse),
  });
}

export function getIntakeCall(key: string, companyId: string | undefined) {
  return useQuery({
    queryKey: [key, companyId],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/companies/intake-call/${companyId}`, {
          signal,
        })
        .then(unwrapAxiosResponse),
  });
}

export const useSendFormIntakeCall = (companyId: string) =>
  useMutation({
    mutationFn: (params: IntakeCallFormRequest) =>
      apiClient
        .post(
          `/api/companies/intake-call/${companyId}`,
          params
        )
        .then(unwrapAxiosResponse),
  });
