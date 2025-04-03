import { useMutation } from "@tanstack/react-query";
import { apiClient, unwrapAxiosResponse } from "./client.config";

export const useActivateUser = () =>
  useMutation({
    mutationFn: (userId: string) =>
      apiClient.patch(`/api/user/admin/activate/${userId}`).then(unwrapAxiosResponse),
  }); 