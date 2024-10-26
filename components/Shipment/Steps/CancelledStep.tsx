import { EStepDefinition, Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { find, includes, last, map } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";
import { Step } from "./Main";

export interface CancelledStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: Step;
  index: number;
}

export default function CancelledSteps(props: CancelledStepsProps) {
  const currentStepSeq = props.shipment?.currentStepSeq;
  const currentStep = find(props.shipment?.steps, ["seq", currentStepSeq]);
  const isCurrentStep = includes(
    map(props.step?.definitions, (def) => def.seq),
    currentStepSeq
  );
  const stepDefinition = (
    isCurrentStep ? currentStep : last(props.step?.definitions)
  ) as StepDefinition;

  switch (stepDefinition.step) {
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
