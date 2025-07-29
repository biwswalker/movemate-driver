import { NotificationContext } from "@/contexts/NotificationContext";
import { useContext } from "react";

export default function useNotification() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification context must be use inside NotificationProvider"
    );
  return context;
}
