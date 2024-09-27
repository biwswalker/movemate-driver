import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { get } from "lodash";
import { EStepDefinition } from "./constants";
import { SafeAreaView } from "react-native-safe-area-context";

interface CancelledStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: StepDefinition;
  index: number;
}

export default function CancelledSteps(props: CancelledStepsProps) {
  const step = get(props, "step.step", "");
  switch (step) {
    case EStepDefinition.CONFIRM_DATETIME:
      return <ConfirmDatetime {...props} />;
    case EStepDefinition.ARRIVAL_PICKUP_LOCATION:
    case EStepDefinition.ARRIVAL_DROPOFF:
      return <ArrivalLocation {...props} />;
    case EStepDefinition.PICKUP:
    case EStepDefinition.DROPOFF:
      return <PickAndDrop {...props} />;
    case EStepDefinition.POD:
      return <POD {...props} />;
    default:
      return <></>;
  }
}

function ConfirmDatetime({
  shipment,
  refetch,
  step,
  index,
}: CancelledStepsProps) {
  return <SafeAreaView></SafeAreaView>;
}

function ArrivalLocation({
  shipment,
  refetch,
  step,
  index,
}: CancelledStepsProps) {
  return <SafeAreaView></SafeAreaView>;
}

function PickAndDrop({ shipment, refetch, step, index }: CancelledStepsProps) {
  return <SafeAreaView></SafeAreaView>;
}

function POD({ shipment, refetch, step, index }: CancelledStepsProps) {
  return <SafeAreaView></SafeAreaView>;
}
