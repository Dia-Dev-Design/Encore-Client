import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";

import { apiClient, unwrapAxiosResponse } from "./client.config";

import { Params } from "interfaces/table.interface";
import { MetricParams } from "interfaces/dashboard/metrics/metricParams.interface";
import { Metric } from "interfaces/dashboard/metrics/metric.interface";
import { ClientDataReceived } from "interfaces/dashboard/clientDataReceived.interface";
import { AdminNotificationParams } from "interfaces/dashboard/adminNotifications.interface";


export function getClients(key: string, params: Params) {
  return useQuery({
    queryKey: [key, params],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/companies`, {
          signal,
          params,
        })
        .then(unwrapAxiosResponse),
  });
}

export function getNonActivatedUsers(key: string, params: Params) {
  const { limit = 10, page = 1 } = params;
  
  return useQuery({
    queryKey: [key, { limit, page }],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/user/admin/non-activated?limit=${limit}&page=${page}`, {
          signal,
        })
        .then(unwrapAxiosResponse),
  });
}

export function getActionableTasks(key: string, params: Params) {
  return useQuery({
    queryKey: [key, params],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/tasks/list`, {
          signal,
          params,
        })
        .then(unwrapAxiosResponse),
  });
}

export function getMetrics(params: MetricParams) {
  return useQuery<Metric>({
    queryKey: ["metrics", params],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/metrics`, {
          signal,
          params: {
            period: params.period,
          },
        })
        .then(unwrapAxiosResponse),
  });
}

export function getUser() {
  return useQuery<ClientDataReceived>({
    queryKey: ['user'],
    queryFn: async ({ signal }) => {
      console.log("This is our response from getUser()", signal)
      const response = await apiClient.get('/api/auth/me', { signal });
      return unwrapAxiosResponse(response);
    }
  });
}



export function getAdminUser(): UseQueryResult<any, unknown> {
  return useQuery<any, unknown>({
    queryKey: ['admin-user'],
    queryFn: async ({ signal }) => {
      const response = await apiClient.get('/api/auth/admin/me', { signal });
      return unwrapAxiosResponse(response);
    }
  });
}

export function getDissolutionTasks(id: string) {
  return useQuery({
    queryKey: ['get-dissolution-tasks'],
    queryFn: async () => {
      const res = await apiClient.get(`/api/tasks/dissolution-roadmap/${id}`,)
      return unwrapAxiosResponse(res);
    },
    refetchOnWindowFocus: false
  })
}

export function getAdminNotifications(key: string, params: AdminNotificationParams) {
  return useQuery({
    queryKey: [key],
    queryFn: async ({ signal }) => {
      const response = await apiClient.get('/api/notifications/admin-list', { signal, params });
      return unwrapAxiosResponse(response);
    }
  });
}

export const hideAdminNotifications = () =>
  useMutation({
      mutationFn: (notificationId: string) =>
      apiClient
          .post(`/api/notifications/read-admin/${notificationId}`)
          .then(unwrapAxiosResponse),
  });

export function getCostMetrics() {
  return useQuery({
    queryKey: ["costMetrics"],
    queryFn: ({ signal }) =>
      apiClient
        .get(`/api/metrics/cost/formula`, {
          signal
        })
        .then(unwrapAxiosResponse),
    refetchOnWindowFocus: false
  });
}