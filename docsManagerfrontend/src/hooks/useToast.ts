import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastData = {
  message: string;
  type: ToastType;
};

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setToast({ message, type: "success" });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ message, type: "error" });
  }, []);

  const showInfo = useCallback((message: string) => {
    setToast({ message, type: "info" });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    hideToast,
  };
}
