import { ProgressingStepsProps } from "./ProgressingStep";
import { StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import { find, head, includes, last, map, tail } from "lodash";
import { EStepDefinition, Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { Step } from "./Main";
import { ActivityIndicator } from "react-native-paper";
import {
  DoneArrivalLocation,
  ProgressArrivalLocation,
} from "./SectionArrivalLocationStep";
import { DonePickAndDrop, ProgressPickAndDrop } from "./SectionPickAndDropStep";
import { CompletedStepsProps } from "./CompletedStep";
import Animated from "react-native-reanimated";

const getDirection = (step: Step, shipment: Shipment) => {
  const currentStep = find(shipment?.steps, ["seq", shipment?.currentStepSeq]);
  const isCurrentStep = includes(
    map(step.definitions, (def) => def.seq),
    shipment.currentStepSeq
  );
  const latestStep = last(step.definitions);
  const stepDefinition = (
    isCurrentStep ? currentStep : latestStep
  ) as StepDefinition;

  const isDropoff = includes(
    [EStepDefinition.ARRIVAL_DROPOFF, EStepDefinition.DROPOFF],
    stepDefinition.step
  );
  if (isDropoff) {
    const destinations = tail(shipment.destinations);
    const destination =
      destinations.length > 1
        ? destinations[(stepDefinition.meta || 0) - 1]
        : head(destinations);
    return destination;
  } else {
    const destination = head(shipment.destinations);
    return destination;
  }
};

export function OnLocation({
  shipment,
  refetch,
  step,
  index,
}: ProgressingStepsProps) {
  const currentStep = find(shipment.steps, ["seq", shipment.currentStepSeq]);
  const destination = getDirection(step, shipment);

  if (!currentStep || !destination) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const isActionStep = includes(
    [EStepDefinition.PICKUP, EStepDefinition.DROPOFF],
    currentStep.step
  );

  return (
    <Animated.View style={styles.wrapper}>
      <ProgressArrivalLocation
        done={isActionStep}
        destination={destination}
        definition={head(step.definitions)}
        shipment={shipment}
        refetch={refetch}
        index={index}
        step={step}
      />
      {isActionStep && (
        <ProgressPickAndDrop
          definition={last(step.definitions)}
          shipment={shipment}
          refetch={refetch}
          index={index}
          step={step}
        />
      )}
    </Animated.View>
  );
}

export function DoneOnLocation({
  shipment,
  refetch,
  step,
  index,
}: CompletedStepsProps) {
  const currentStep = find(shipment.steps, ["seq", shipment.currentStepSeq]);
  const destination = getDirection(step, shipment);

  if (!currentStep || !destination) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <DoneArrivalLocation
        destination={destination}
        definition={head(step.definitions)}
        shipment={shipment}
        refetch={refetch}
        index={index}
        step={step}
      />
      <DonePickAndDrop
        definition={last(step.definitions)}
        shipment={shipment}
        refetch={refetch}
        index={index}
        step={step}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // paddingHorizontal: normalize(16),
    gap: normalize(2),
  },
});
