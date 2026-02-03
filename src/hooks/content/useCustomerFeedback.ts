import { useMutationHelpers, apiClient } from "@/lib";
import { useMutation } from "@tanstack/react-query";

export function useSubmitFeedback() {
  const { queryClient, success, error } = useMutationHelpers();

  return useMutation({
    mutationFn: (payload: {
      orderNumber: string;
      language: string;
      email: string;
      rating?: number;
      message: string;
    }) => apiClient.post("/feedback", payload),

    onSuccess: () => {
      queryClient.invalidateQueries();
      success("Feedback submitted successfully");
    },

    onError: (err) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to submit feedback. Try again.";
      error(msg);
    },
  });
}
