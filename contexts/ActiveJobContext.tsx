import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "@/services/LocationTrackingService";
import {
  EStepDefinition,
  EStepStatus,
  Shipment,
  useGetActiveShipmentQuery,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { find } from "lodash";

interface ActiveJobContextType {
  activeJob: Shipment | null;
  setActiveJob: (job: Shipment | null) => void;
  isLoading: boolean;
  refetchActiveJob: VoidFunction;
}

const ActiveJobContext = createContext<ActiveJobContextType | undefined>(
  undefined
);

export const ActiveJobProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [activeJob, setActiveJob] = useState<Shipment | null>(null);

  const { refetch, loading } = useGetActiveShipmentQuery({
    fetchPolicy: "network-only",
    skip: !isAuthenticated,
    onCompleted: ({ getActiveShipment }) => {
      setActiveJob(getActiveShipment as Shipment);
    },
    onError: (error) => {
      console.error("Error fetching active job:", error);
      setActiveJob(null);
    },
  });

  useEffect(() => {
    console.log("Active job status changed:", activeJob?.status);
    const manageTracking = async () => {
      const pickupDataDone = find(activeJob?.steps, {
        step: EStepDefinition.PICKUP,
        stepStatus: EStepStatus.DONE,
      });
      if (activeJob?.status === "PROGRESSING" && pickupDataDone) {
        await startBackgroundTracking();
      } else {
        // หยุดการติดตามในทุกกรณีที่เหลือ (จบงาน, ยกเลิก, ไม่มีงาน)
        await stopBackgroundTracking();
      }
    };

    // ไม่ต้องรอให้โหลดข้อมูลครั้งแรกเสร็จก่อน
    if (!loading) {
      manageTracking();
    }
  }, [activeJob?.status, loading]);

  const refetchActiveJob = () => {
    refetch();
  };

  return (
    <ActiveJobContext.Provider
      value={{ activeJob, setActiveJob, isLoading: loading, refetchActiveJob }}
    >
      {children}
    </ActiveJobContext.Provider>
  );
};

// 5. สร้าง Custom Hook เพื่อให้เรียกใช้งานง่าย
export const useActiveJob = () => {
  const context = useContext(ActiveJobContext);
  if (context === undefined) {
    throw new Error("useActiveJob must be used within a ActiveJobProvider");
  }
  return context;
};
