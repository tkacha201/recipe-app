import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultOptions = {
  position: "top-right",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success notifications
export function showSuccess(message) {
  toast.success(message, {
    ...defaultOptions,
    autoClose: 3000,
  });
}

// Error notifications
export function showError(message) {
  toast.error(message, {
    ...defaultOptions,
    autoClose: 5000,
  });
}

// Info notifications
export function showInfo(message) {
  toast.info(message, {
    ...defaultOptions,
    autoClose: 3000,
  });
}

// Warning notifications
export function showWarning(message) {
  toast.warning(message, {
    ...defaultOptions,
    autoClose: 4000,
  });
}
