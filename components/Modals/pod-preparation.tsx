import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import Text from "@components/Text";
import colors from "@constants/colors";
import {
  BackHandler,
  Dimensions,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";
import Animated, {
  AnimatedProps,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { normalize } from "@/utils/normalizeSize";
import Button from "../Button";

export const GUILD_IMAGES = [
  require("@assets/images/pod/sample_1.jpg"),
  // require("@assets/images/pod/pod_1.png"),
];

interface PODPreparationModalProps {
  onContinue: VoidFunction;
}

export interface PODPreparationRef {
  present: (callback?: VoidFunction) => void;
  close: Function;
}

export default forwardRef<PODPreparationRef, PODPreparationModalProps>(
  ({ onContinue }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    function handlePresent(callback = () => {}) {
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current?.present(callback as any);
      }
    }

    function handleCloseModal() {
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current?.close();
      }
    }

    useEffect(() => {
      const backAction = () => {
        handleCloseModal();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, []);

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      close: handleCloseModal,
    }));

    const handleSheetChanges = useCallback((index: number) => {
      if (index === 0) {
        console.log("handleSheetChanges: Open", index);
        // Open
      } else {
        console.log("handleSheetChanges:", index);
        // Closed
      }
    }, []);

    return (
      <BottomSheetModal
        detached
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={["80%"]}
        backdropComponent={SheetBackdrop.NoAnimate}
        enableDynamicSizing={false}
      >
        {Content as () => ReactNode}
      </BottomSheetModal>
    );
  }
);

interface ContentProps {
  data: VoidFunction;
}

function Content({ data = () => {} }: ContentProps) {
  function handleContinue() {
    data();
  }

  return (
    <BottomSheetView style={styles.container}>
      {/* <PressSwipe /> */}
      {/* <View
        style={{
          paddingHorizontal: normalize(16),
          flexShrink: 1,
          justifyContent: "center",
        }}
      >
        <Animated.Image
          style={[
            slideitemstyles.container,
            { borderRadius: normalize(15), maxHeight: normalize(264) },
          ]}
          source={require("@assets/images/pod/sample_1.jpg")}
          resizeMode="cover"
        />
      </View> */}
      <View style={[styles.textContainer]}>
        <Text
          varient="h4"
          style={{ alignSelf: "center", paddingBottom: normalize(8) }}
        >
          วิธีการถ่ายรูปใบปะหน้า
        </Text>
        <Text
          varient="body1"
          color="primary"
          style={{ paddingBottom: normalize(16) }}
        >
          เพื่อให้การส่งมอบสำเร็จสมบูรณ์
          โปรดถ่ายรูปสินค้าที่ปลายทางให้ชัดเจนและถูกต้อง
        </Text>
        <View>
          <Text varient="body2" color="primary">
            · เห็นสินค้าและป้ายที่อยู่ชัดเจน
          </Text>
          <Text
            varient="body2"
            color="secondary"
            style={{
              paddingHorizontal: normalize(8),
              marginBottom: normalize(8),
            }}
          >
            จัดวางสินค้าให้เห็นครบทุกชิ้น
            และหันป้ายที่อยู่หรือใบนำส่งให้กล้องเห็นได้ชัด
          </Text>
        </View>
        <View>
          <Text varient="body2" color="primary">
            · ถ่ายในที่สว่าง ไม่เบลอ
          </Text>
          <Text
            varient="body2"
            color="secondary"
            style={{
              paddingHorizontal: normalize(8),
              marginBottom: normalize(8),
            }}
          >
            ตรวจสอบให้แน่ใจว่าภาพคมชัดและมีแสงสว่างเพียงพอ
          </Text>
        </View>
        <View>
          <Text varient="body2" color="primary">
            · เห็นสถานที่จัดส่ง
          </Text>
          <Text
            varient="body2"
            color="secondary"
            style={{
              paddingHorizontal: normalize(8),
              marginBottom: normalize(8),
            }}
          >
            ถ่ายภาพในมุมกว้างพอที่จะเห็นสภาพแวดล้อม เช่น หน้าประตูบ้าน,
            บริเวณหน้าออฟฟิศ หรือจุดที่ลูกค้าระบุไว้
          </Text>
        </View>
        {/* <View>
            <Text varient="body2" color="primary">
              · กรณีฝากส่งกับบุคคลอื่น
            </Text>
            <Text
              varient="body2"
              color="secondary"
              style={{
                paddingHorizontal: normalize(8),
                marginBottom: normalize(8),
              }}
            >
              หากลูกค้าไม่อยู่และอนุญาตให้ฝากของไว้กับบุคคลอื่น (เช่น นิติบุคคล,
              รปภ.) ควรถ่ายให้เห็นบุคคลนั้นกำลังรับของ (หากได้รับอนุญาต)
            </Text>
          </View> */}
      </View>
      <View style={styles.actionContainer}>
        <Button
          title="ดำเนินการต่อ"
          varient="soft"
          size="large"
          fullWidth
          onPress={handleContinue}
        />
      </View>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  wrapper: {},
  textContainer: {
    alignItems: "flex-start",
    gap: normalize(4),
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(16),
  },
  actionContainer: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(8),
    paddingBottom: normalize(32),
  },
});

const PressSwipe = () => {
  const PAGE_WIDTH = Dimensions.get("window").width;
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const pressAnim = useSharedValue<number>(0);
  const animationStyle = useCallback((value: number) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000]);
    const translateX = interpolate(
      value,
      [-1, 0, 1],
      [-PAGE_WIDTH, 0, PAGE_WIDTH]
    );

    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);

  return (
    <Carousel
      loop={true}
      // autoPlay={isAutoPlay}
      style={{ width: PAGE_WIDTH, height: normalize(264) }}
      width={PAGE_WIDTH}
      data={GUILD_IMAGES}
      onScrollBegin={() => {
        pressAnim.value = withTiming(1);
      }}
      onScrollEnd={() => {
        pressAnim.value = withTiming(0.72);
      }}
      renderItem={({ index }) => (
        <CustomItem index={index} key={index} pressAnim={pressAnim} />
      )}
      customAnimation={animationStyle}
      scrollAnimationDuration={1600}
    />
  );
};

interface ItemProps {
  pressAnim: SharedValue<number>;
  index: number;
}

const CustomItem = ({ pressAnim, index }: ItemProps) => {
  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressAnim.value, [0, 1], [1, 0.9]);
    const borderRadius = interpolate(pressAnim.value, [0, 1], [0, 30]);

    return {
      transform: [{ scale }],
      borderRadius,
    };
  }, []);

  return (
    <Animated.View style={[{ flex: 1, overflow: "hidden" }, animStyle]}>
      <SlideItem index={index} />
    </Animated.View>
  );
};

interface SlideItemProps extends AnimatedProps<ViewProps> {
  imageStyle?: StyleProp<ImageStyle>;
  index?: number;
  rounded?: boolean;
  source?: ImageSourcePropType;
}

const SlideItem = (props: SlideItemProps) => {
  const {
    imageStyle,
    index = 0,
    rounded = false,
    testID,
    ...animatedViewProps
  } = props;

  const source = useMemo(
    () => props.source || GUILD_IMAGES[index % GUILD_IMAGES.length],
    [index, props.source]
  );

  return (
    <Animated.View style={{ flex: 1 }} {...animatedViewProps}>
      <Animated.Image
        style={[
          imageStyle,
          slideitemstyles.container,
          rounded && { borderRadius: normalize(15) },
        ]}
        source={source}
        resizeMode="cover"
      />
      {/* <View style={slideitemstyles.overlay}>
        <View style={slideitemstyles.overlayTextContainer}>
          <Text varient="h4" style={slideitemstyles.overlayText}>
            {index}
          </Text>
        </View>
      </View> */}
    </Animated.View>
  );
};

const slideitemstyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  // Overay
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: colors.common.white,
  },
  overlayTextContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: normalize(10),
    borderRadius: normalize(10),
    minWidth: normalize(44),
    minHeight: normalize(44),
    justifyContent: "center",
    alignItems: "center",
  },
});
