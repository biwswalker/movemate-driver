import Text from "@/components/Text";
import colors from "@/constants/colors";
import { StepDefinition } from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { EStepStatus } from "./constants";
import Iconify from "@/components/Iconify";

interface StepHeaderProps {
  step: StepDefinition;
  index: number;
}

export default function StepHeader({ step, index }: StepHeaderProps) {
  function colorSetStatus() {
    switch (step.stepStatus) {
      case EStepStatus.IDLE:
        return {
          circleColor: colors.grey[500],
          stepNumberColor: "disabled" as TTextColor,
          messageColor: "secondary" as TTextColor,
        };
      case EStepStatus.PROGRESSING:
        return {
          circleColor: colors.primary.main,
          stepNumberColor: "secondary" as TTextColor,
          messageColor: "primary" as TTextColor,
        };
      case EStepStatus.DONE:
        return {
          circleColor: colors.success.main,
          stepNumberColor: "secondary" as TTextColor,
          messageColor: "primary" as TTextColor,
        };
      case EStepStatus.CANCELLED:
      case EStepStatus.EXPIRE:
        return {
          circleColor: colors.error.main,
          stepNumberColor: "secondary" as TTextColor,
          messageColor: "primary" as TTextColor,
        };
      default:
        return {
          circleColor: colors.grey[500],
          stepNumberColor: "disabled" as TTextColor,
          messageColor: "secondary" as TTextColor,
        };
    }
  }

  const colorSet = colorSetStatus();

  return (
    <Fragment>
      <View
        style={[
          styles.stepWrapperInactive,
          { paddingHorizontal: 16, paddingVertical: 8 },
        ]}
      >
        <View
          style={[
            styles.boxStepWrapperInactive,
            { backgroundColor: hexToRgba(colorSet.circleColor, 0.08) },
          ]}
        >
          {step.stepStatus === EStepStatus.DONE ? (
            <Iconify
              icon="octicon:check-16"
              size={normalize(16)}
              color={colorSet.circleColor}
            />
          ) : (
            <Text varient="h5" style={{ color: colorSet.circleColor }}>
              {index + 1}
            </Text>
          )}
        </View>
        <View style={styles.stepTextWrapper}>
          <View>
            <Text varient="caption" color={colorSet.stepNumberColor}>
              ขั้นตอนที่ {index + 1}
              {step.stepStatus === "progressing" && (
                <Text varient="caption" style={{ color: colors.warning.main }}>
                  {" "}
                  กำลังดำเนินการ
                </Text>
              )}
            </Text>
            <Text varient="subtitle2" color={colorSet.messageColor}>
              {step.driverMessage}
            </Text>
          </View>
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  stepWrapperInactive: {
    flexDirection: "row",
    gap: normalize(8),
    paddingVertical: normalize(4),
  },
  boxStepWrapperInactive: {
    width: normalize(32),
    height: normalize(32),
    backgroundColor: hexToRgba(colors.grey[500], 0.08),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: normalize(16),
  },
  stepTextWrapper: {
    gap: normalize(4),
    flex: 1,
  },
});
