import { isEqual } from "lodash";
import React, { forwardRef, ReactNode, Ref, RefObject } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Button from "./Button";
import colors from "@constants/colors";
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

export interface TabCarousel<T = string> {
  value: T;
  data: TabItem[];
  onChange?: (value: T) => void;
  width: number;
  height: number;
}

type PropsWithStandardRef<T = string> = TabCarousel<T> & {
  ref?: Ref<ICarouselInstance>;
};

export const TabCarouselFinal: <T = string>(
  props: PropsWithStandardRef<T>
) => ReactNode = forwardRef<ICarouselInstance, TabCarousel<any>>(TabCarousel);

function TabCarousel<T = string>(
  props: TabCarousel,
  ref: Ref<ICarouselInstance>
) {
  const { data, value, onChange = () => {}, width, height } = props;

  return (
    <Carousel
      ref={ref}
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
              const carouselRef = ref as RefObject<ICarouselInstance>;
              if (carouselRef?.current) {
                carouselRef.current.scrollTo({
                  count: animationValue.value,
                  animated: true,
                });
              }
            }}
          />
        );
      }}
    />
  );
}

export default TabCarouselFinal;
