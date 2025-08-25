import { LOCATION_TASK_NAME } from "@/tasks/locationTask";
import * as Location from "expo-location";

export const startBackgroundTracking = async () => {
  // ตรวจสอบว่า Task ได้เริ่มทำงานไปแล้วหรือยัง
  const isTracking =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isTracking) {
    console.log("Background tracking is already active.");
    return;
  }

  console.log("Starting background location tracking...");
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced, // ✅ Balanced เพื่อความสมดุลระหว่างความแม่นยำและแบตเตอรี่
    timeInterval: 30000, // 30 วินาที
    distanceInterval: 50, // 50 เมตร
    showsBackgroundLocationIndicator: true, // (iOS) แสดงแถบสีฟ้าว่าแอปกำลังใช้ตำแหน่ง
    foregroundService: {
      notificationTitle: "Movemate Driver กำลังติดตามตำแหน่ง",
      notificationBody: "การติดตามจะทำงานเฉพาะเมื่องานของคุณกำลังดำเนินการ",
    },
  });
};

export const stopBackgroundTracking = async () => {
  const isTracking =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (!isTracking) {
    console.log("Background tracking is not active.");
    return;
  }

  console.log("Stopping background location tracking...");
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
};
