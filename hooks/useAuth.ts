import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth context must be use inside AuthProvider");
  return context;
}
