import { LOCATION_TASK_NAME } from "@/tasks/locationTask";
import * as Location from "expo-location";
import { Alert, Linking } from "react-native";
import * as TaskManager from "expo-task-manager";

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

// Start location tracking in background
export const startBackgroundTracking = async () => {
  // Don't track position if permission is not granted
  const hasPermission = await requestLocationPermissions();
  if (!hasPermission) {
    console.log("Cannot start tracking, permissions not granted.");
    return;
  }

  // Make sure the task is defined otherwise do not start tracking
  const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    console.log("Task is not defined");
    return;
  }

  // Don't track if it is already running in background
  const hasStarted =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (hasStarted) {
    console.log("Already started");
    // await stopBackgroundTracking();
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    // For better logs, we set the accuracy to the most sensitive option
    accuracy: Location.Accuracy.BestForNavigation,
    // Make sure to enable this notification if you want to consistently track in the background
    showsBackgroundLocationIndicator: true,
    timeInterval: 20000, // 20 วินาที
    distanceInterval: 40, // 50 เมตร
    foregroundService: {
      notificationTitle: "Movemate Driver กำลังทำงาน",
      notificationBody: "กำลังติดตามตำแหน่งสำหรับงานที่กำลังดำเนินการ",
      notificationColor: "#FFFFFF",
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
