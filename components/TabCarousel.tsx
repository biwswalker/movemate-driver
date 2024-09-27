import { isEqual } from "lodash";
import React, { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Button from "./Button";
import colors from "@/constants/colors";
import { normalize } from "@/utils/normalizeSize";

const buttonCarouselStyle = StyleSheet.create({
  circle: {
    width: normalize(8),
    height: normalize(8),
    backgroundColor: colors.error.main,
    borderRadius: normalize(4),
  },
});

export interface TabItem {
  Icon?: (isActive: boolean) => ReactNode;
  isNews?: boolean;
  label: string;
  value: string;
}

export interface TabCarousel {
  value: string;
  data: TabItem[];
  onChange?: (value: string) => void;
  width: number;
  height: number;
}

export default function TabCarousel({
  data,
  value,
  onChange = () => {},
  width,
  height,
}: TabCarousel) {
  const carouselRef = React.useRef<ICarouselInstance>(null);

  return (
    <Carousel
      ref={carouselRef}
      style={{
        width: Dimensions.get("window").width,
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
      loop={false}
      width={width}
      height={height}
      data={data}
      renderItem={({ item, animationValue }) => {
        const isActive = isEqual(value, item.value);
        return (
          <Button
            fullWidth
            varient="soft"
            size="medium"
            color="inherit"
            title={item.label}
            StartIcon={item.Icon && item.Icon(isActive)}
            EndIcon={item.isNews && <View style={buttonCarouselStyle.circle} />}
            style={{ width: width - 8 }}
            onPress={() => {
              onChange(item.value);
              carouselRef.current?.scrollTo({
                count: animationValue.value,
                animated: true,
              });
            }}
          />
        );
      }}
    />
  );
}
