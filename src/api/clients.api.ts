import { useMutation } from "@tanstack/react-query";

import { apiClient, unwrapAxiosResponse } from "./client.config";

import { AssignToInterface } from "interfaces/dashboard/clients/assignTo.interface";
import { ChangeTypeInterface } from "interfaces/dashboard/clients/changeType.interface";

export const useAssignTo = () =>
  useMutation({
    mutationFn: (params: AssignToInterface) =>
      apiClient.post(`/api/companies/assign`, params).then(unwrapAxiosResponse),
  });

export const useChangeType = () =>
  useMutation({
    mutationFn: (params: ChangeTypeInterface) =>
      apiClient
        .post(`/api/companies/change-type`, params)
        .then(unwrapAxiosResponse),
  });
