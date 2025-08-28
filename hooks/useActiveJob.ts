import { ActiveJobContext } from "@/contexts/ActiveJobContext";
import { useContext } from "react";

export const useActiveJob = () => {
  const context = useContext(ActiveJobContext);
  if (context === undefined) {
    throw new Error("useActiveJob must be used within a ActiveJobProvider");
  }
  return context;
};
