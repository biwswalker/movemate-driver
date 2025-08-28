import { LOCATION_TASK_NAME } from "@/tasks/locationTask";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";

export const requestLocationPermissions = async (): Promise<boolean> => {
  // 1. ตรวจสอบสถานะ Permission ปัจจุบันก่อน
  const { status: currentForegroundStatus } =
    await Location.getForegroundPermissionsAsync();
  const { status: currentBackgroundStatus } =
    await Location.getBackgroundPermissionsAsync();

  if (
    currentForegroundStatus === "granted" &&
    currentBackgroundStatus === "granted"
  ) {
    console.log("All location permissions already granted.");
    return true; // ถ้าได้รับสิทธิ์ครบแล้ว ก็ไม่ต้องขออีก
  }

  // --- ขอสิทธิ์ Foreground ---
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  console.log("Foreground permission status:", foregroundStatus);

  if (foregroundStatus !== "granted") {
    Alert.alert(
      "จำเป็นต้องใช้ตำแหน่ง",
      "แอป Movemate Driver ต้องการเข้าถึงตำแหน่งของท่านเพื่อใช้ในการติดตามงาน กรุณาเปิดอนุญาตในการตั้งค่า",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ไปที่ตั้งค่า", onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  // --- ขอสิทธิ์ Background ---
  const { status: backgroundStatus } =
    await Location.requestBackgroundPermissionsAsync();
  console.log("Background permission status:", backgroundStatus);

  if (backgroundStatus !== "granted") {
    Alert.alert(
      "จำเป็นต้องติดตามตำแหน่งเบื้องหลัง",
      'กรุณาเลือก "อนุญาตตลอดเวลา" (Allow all the time) เพื่อให้แอปสามารถติดตามงานได้แบบ Real-time แม้จะปิดหน้าจอไปแล้ว',
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ไปที่ตั้งค่า", onPress: () => Linking.openSettings() },
      ]
    );
    return false;
  }

  console.log("All location permissions granted.");
  return true;
};

export const startBackgroundTracking = async () => {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      console.log("Cannot start tracking, permissions not granted.");
      return;
    }

    const requestPermissions = async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 100
          });
        }
      }
    };

    await requestPermissions()

    return

    const isAlreadyTracking =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (isAlreadyTracking) {
      await stopBackgroundTracking();
      // console.log("Background tracking is already active.");
      // return;
    }

    console.log("Attempting to start background location tracking...");

    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1,
        distanceInterval: 1,
        foregroundService: {
          notificationTitle: "Movemate Driver กำลังทำงาน",
          notificationBody: "กำลังติดตามตำแหน่งสำหรับงานที่กำลังดำเนินการ",
          notificationColor: "#FFFFFF",
        },
      });

      const isNowTracking =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log(
        `Successfully called startLocationUpdatesAsync. Is tracking now? -> ${isNowTracking}`
      );
    } catch (error) {
      console.error("ERROR calling startLocationUpdatesAsync:", error);
    }
  } catch (error) {
    console.error("General error in startBackgroundTracking:", error);
  }
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

/**
 * ตรวจสอบว่า Background Location Task กำลังทำงานอยู่หรือไม่
 * @returns {Promise<boolean>} - true หาก Task กำลังทำงาน
 */
export const isTrackingActive = async (): Promise<boolean> => {
  try {
    const isActive =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log(`Is background tracking active? -> ${isActive}`);
    return isActive;
  } catch (error) {
    console.error("Failed to check tracking status:", error);
    return false;
  }
};
