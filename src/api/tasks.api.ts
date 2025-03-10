import { useMutation } from "@tanstack/react-query";

import { apiClient, unwrapAxiosResponse } from "./client.config";
import { AssignToInterface } from "interfaces/dashboard/actionableTask/assignTo.interface";
import {
  CompleteTasksRequest,
  DeleteTasksRequest,
} from "interfaces/dashboard/actionableTask/common.interface";

export const useAssignTo = () =>
  useMutation({
    mutationFn: (params: AssignToInterface) =>
      apiClient.post(`/api/tasks/assign`, params).then(unwrapAxiosResponse),
  });

export const useDeleteTasks = () =>
  useMutation({
    mutationFn: (params: DeleteTasksRequest) =>
      apiClient
        .delete(`/api/tasks`, {
          data: params,
        })
        .then(unwrapAxiosResponse),
  });

export const useCompleteTasks = () =>
  useMutation({
    mutationFn: (params: CompleteTasksRequest) =>
      apiClient.post(`/api/tasks/complete`, params).then(unwrapAxiosResponse),
  });
