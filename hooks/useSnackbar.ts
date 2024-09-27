import { SnackbarContext } from "@/contexts/SnackbarContext";
import { SnackbarV2Context } from "@/contexts/SnackbarV2Context";
import { useContext } from "react";

function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar context must be use inside SnackbarProvider");
  return context;
}

export default useSnackbar;

export function useSnackbarV2() {
  const context = useContext(SnackbarV2Context);
  if (!context)
    throw new Error("useSnackbar context must be use inside SnackbarProvider");
  return context;
}
