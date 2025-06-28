import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  Notification,
} from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  EShipmentStatus,
  GetAvailableShipmentByTrackingNumberQuery,
  Shipment,
  useGetAvailableShipmentByTrackingNumberLazyQuery,
} from "@/graphql/generated/graphql";
import { get } from "lodash";

enum ENavigationType {
  INDEX = "index",
  EMPLOYEE = "employee",
  SHIPMENT = "shipment",
  FINANCE = "finance",
  NOTIFICATION = "notification",
  PROFILE = "profile",
  PROFILE_DETAIL = "profile-detail",
  PROFILE_DOCUMENT = "profile-document",
}

export function useNotificationObserver() {
  const router = useRouter();
  const { user } = useAuth();
  const [shipment, setShipment] = useState<Shipment | null>(null);

  const [getShipment, { loading: shipmentLoading }] =
    useGetAvailableShipmentByTrackingNumberLazyQuery({
      fetchPolicy: "network-only",
      onCompleted: handleLoadShipmentComplete,
    });

  function handleLoadShipmentComplete(
    response: GetAvailableShipmentByTrackingNumberQuery
  ) {
    if (response.getAvailableShipmentByTrackingNumber) {
      setShipment(response.getAvailableShipmentByTrackingNumber as Shipment);
    }
  }

  useEffect(() => {
    function handleNotification(notification: Notification) {
      const data = notification.request.content.data;
      if (!data) return;

      if (data.navigation === ENavigationType.SHIPMENT && data.trackingNumber) {
        // เมื่อได้รับ Notification ที่มี trackingNumber ให้ทำการ get shipment
        getShipment({ variables: { tracking: data.trackingNumber } });
      } else if (data.navigation === ENavigationType.NOTIFICATION) {
      } else if (data.navigation === ENavigationType.EMPLOYEE) {
      } else if (data.navigation === ENavigationType.INDEX) {
      }
    }

    // Listener สำหรับ Notification ที่ได้รับตอนแอปปิด/เบื้องหลัง
    getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) {
        handleNotification(response.notification);
      }
    });

    // Listener สำหรับ Notification ที่ได้รับตอนแอปเปิดอยู่
    const subscription = addNotificationResponseReceivedListener((response) => {
      handleNotification(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // ไม่ทำงานถ้ากำลังโหลด หรือไม่มีข้อมูล หรือไม่มี trackingNumber
    if (shipmentLoading || !shipment) return;

    if (!shipment) return; // ไม่เจอข้อมูล shipment

    const driverId = get(shipment, "driver._id") || get(shipment, "driver");

    const isMyJobInProgress =
      shipment.status === EShipmentStatus.PROGRESSING && driverId === user?._id;

    if (isMyJobInProgress) {
      router.push({
        pathname: "/(app)/shipment-working",
        params: { trackingNumber: shipment.trackingNumber },
      });
    } else {
      router.push({
        pathname: "/(app)/shipment-overview",
        params: { trackingNumber: shipment.trackingNumber },
      });
    }

    // --- สำคัญมาก ---
    // Reset state กลับเป็น null เพื่อให้พร้อมรับ Notification ใหม่
    // และป้องกันการ Redirect ซ้ำซ้อนหาก component re-render
    setShipment(null);
  }, [shipment, shipmentLoading, router, user]);
}
