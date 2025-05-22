import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "@/styles/common.module.css";


export function toastAlert(
  errorType,
  message,
  id = Math.random().toString(),
  position = "TOP_CENTER"
) {
  const toastId = Math.random().toString();

  const commonOptions = {
    autoClose: 2000,
    toastId: toastId,
    position: toast.POSITION[position],
    theme: "dark",
    className: `${styles.toastify_custom}` // Apply the custom CSS class
  };

  if (errorType === "error") {
    toast.error(message, commonOptions);
  } else if (errorType === "success") {
    toast.success(message, commonOptions);
  }
}

// export function toastAlert(
//   errorType,
//   message,
//   id = Math.random().toString(),
//   position = "TOP_CENTER"
// ) {
//   const toastId = Math.random().toString();

//   if (errorType === "error") {
//     toast.error(message, {
//       autoClose: 2000,
//       toastId: toastId,
//       position: toast.POSITION[position],
//       theme: "dark",
//     });
//   } else if (errorType === "success") {
//     toast.success(message, {
//       autoClose: 2000,
//       toastId: toastId,
//       position: toast.POSITION[position],
//       theme: "dark",
//     });
//   }
// }