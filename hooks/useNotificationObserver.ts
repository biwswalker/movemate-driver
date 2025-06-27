import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  Notification,
} from "expo-notifications";
import { useEffect } from "react";

enum ENavigationType {
  INDEX = "index",
  EMPLOYEE = "employee",
  SHIPMENT = "shipment",
  SHIPMENT_WORK = "shipment-work",
  FINANCE = "finance",
  NOTIFICATION = "notification",
  PROFILE = "profile",
  PROFILE_DETAIL = "profile-detail",
  PROFILE_DOCUMENT = "profile-document",
}

export function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notification) {
      const data = notification.request.content.data;
      if (data) {
        if (data.navigation === ENavigationType.SHIPMENT) {
          if (data.trackingNumber) {
            // router.push({
            //   pathname: "/",
            //   params: { trackingNumber: data.trackingNumber },
            // });
          }
        } else if (data.navigation === ENavigationType.SHIPMENT_WORK) {
          if (data.trackingNumber) {
            // router.push({
            //   pathname: "/",
            //   params: { trackingNumber: data.trackingNumber },
            // });
          }
        } else if (data.navigation === ENavigationType.NOTIFICATION) {
        } else if (data.navigation === ENavigationType.EMPLOYEE) {
          // router.push("/employee/employees");
          // if (data.driverId) { }
        } else if (data.navigation === ENavigationType.INDEX) {
          // router.push("/");
        }
      }
    }

    getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}
