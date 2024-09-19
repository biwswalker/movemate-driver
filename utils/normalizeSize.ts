import { PixelRatio, Platform } from "react-native";
import { Dimensions } from "react-native";

const aspectRatio = (
  originalWidth: number,
  originalHeight: number,
  newWidth: number
) => {
  if (originalWidth === 0) {
    throw new Error("originalWidth should not be a zero");
  }

  if (typeof originalWidth !== "number") {
    throw new Error("originalWidth should be a number");
  }

  if (typeof originalHeight !== "number") {
    throw new Error("originalHeight should be a number");
  }

  if (typeof newWidth !== "number") {
    throw new Error("newWidth should be a number");
  }

  return (originalHeight / originalWidth) * newWidth;
};

const LOGICAL_RESOLUTION: Record<TSupportDevice, IResolution> = {
  iPhoneProMax: { width: 430, height: 932 },
  iPhonePro: { width: 393, height: 852 },
  iPhone: { width: 390, height: 844 },
  iPhone14Plus: { width: 428, height: 926 },
  iPhone13Mini: { width: 375, height: 812 },
  iPhoneSE: { width: 320, height: 568 },
  iPhone8Plus: { width: 414, height: 736 },
  iPhone8: { width: 375, height: 667 },
  AndroidSmall: { width: 360, height: 640 },
  AndroidLarge: { width: 360, height: 800 },
};

const REFERENT_DEVICE: TSupportDevice = "iPhoneSE";
const MIN_SCREEN_WIDTH = LOGICAL_RESOLUTION.iPhoneSE.width;
const MIN_SCREEN_HEIGHT = LOGICAL_RESOLUTION.iPhoneSE.height;
const MAX_SCREEN_WIDTH = LOGICAL_RESOLUTION.iPhoneProMax.width;
const MAX_SCREEN_HEIGHT = LOGICAL_RESOLUTION.iPhoneProMax.height;

const { width, height } = Dimensions.get("window");
const scale = width / MIN_SCREEN_WIDTH;

export function normBaseW(
  size: number,
  fromSize: TSupportDevice = REFERENT_DEVICE
) {
  return fromSize !== REFERENT_DEVICE
    ? aspectRatio(LOGICAL_RESOLUTION[fromSize].width, size, MIN_SCREEN_WIDTH)
    : size;
}

const normalizeWithProp =
  (size: number, orientation: TOrientation) => (fromSize: TSupportDevice) => {
    const normalizeBaseSize = normBaseW(size, fromSize);

    switch (orientation) {
      case "portrait": {
        const usedHeight =
          height >= MAX_SCREEN_HEIGHT ? MAX_SCREEN_HEIGHT : height;
        return Math.round((normalizeBaseSize * usedHeight) / MIN_SCREEN_HEIGHT);
      }
      default: {
        const usedWidth = width >= MAX_SCREEN_WIDTH ? MAX_SCREEN_WIDTH : width;
        return Math.round((normalizeBaseSize * usedWidth) / MIN_SCREEN_WIDTH);
      }
    }
  };

export function normBaseH(
  size: number,
  orientation: TOrientation = "portrait",
  fromSize: TSupportDevice = REFERENT_DEVICE
) {
  return normalizeWithProp(size, orientation)(fromSize);
}

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
