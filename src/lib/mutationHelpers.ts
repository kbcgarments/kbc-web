import { useToastStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";

export function useMutationHelpers() {
  const queryClient = useQueryClient();
  const toast = useToastStore();
  const success = toast.success;
  const error = toast.error;
  return { queryClient, success, error };
}
