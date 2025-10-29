import { useEffect } from "react";
import "./style.css";

type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export const Toast = ({ message, type = "success", onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
      </div>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};
