import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    if (message) {
      if (type === "success") toast.success(message, { rtl: true, onClose });
      else toast.error(message, { rtl: true, onClose });
    }
  }, [message, type, onClose]);
  return <ToastContainer position="top-center" autoClose={3000} rtl theme="colored" />;
};

export default Toast; 