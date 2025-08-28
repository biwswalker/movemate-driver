import * as TaskManager from "expo-task-manager";
import { UpdateDriverLocationDocument } from "@graphql/generated/graphql"; // Import Mutation ที่สร้างจาก Codegen
import { storage } from "@/utils/mmkv-storage";
import { createApolloClient } from "@/graphql/apollo-client";
import { LocationObject } from "expo-location";

export const LOCATION_TASK_NAME = "background-location-task";

console.log(`✅ TaskManager: Defining task "${LOCATION_TASK_NAME}"`); // 🎯 เพิ่ม Log นี้


TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  console.log("--- BACKGROUND TASK IS RUNNING ---");

  if (error) {
    console.error("Background location task error:", error);
    return;
  }

  if (data) {
    const { locations } = data as { locations: LocationObject[] };
    const latestLocation = locations[0];

    if (latestLocation) {
      console.log("📍 Received new background location", latestLocation.coords);

      try {
        // สร้าง Apollo Client ขึ้นมาใหม่เพื่อใช้ใน Task
        const token = storage.getString("access_token") || "";
        const client = createApolloClient(token);

        // ส่งข้อมูลไปยัง Backend
        await client.mutate({
          mutation: UpdateDriverLocationDocument,
          variables: {
            latitude: latestLocation.coords.latitude,
            longitude: latestLocation.coords.longitude,
          },
        });
        console.log("Successfully sent location to server.");
      } catch (err) {
        console.error("Failed to send location to server:", err);
      }
    }
  }
});
