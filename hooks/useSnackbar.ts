import { SnackbarContext } from "@/contexts/SnackbarContext";
import { useContext } from "react";

function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar context must be use inside SnackbarProvider");
  return context;
}

export default useSnackbar;
