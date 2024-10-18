import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { find, includes, last, map } from "lodash";
import { EStepDefinition } from "./constants";
import { Step } from "./Main";

interface IdleStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: Step;
  index: number;
}

export default function IdleSteps(props: IdleStepsProps) {
  const currentStep = find(props.shipment?.steps, [
    "seq",
    props.shipment?.currentStepSeq,
  ]);
  const isCurrentStep = includes(
    map(props.step?.definitions, (def) => def.seq),
    props.shipment?.currentStepSeq
  );
  const latestStep = last(props.step?.definitions);
  const stepDefinition = (
    isCurrentStep ? currentStep : latestStep
  ) as StepDefinition;

  switch (stepDefinition.stepStatus) {
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

function ConfirmDatetime({ shipment, refetch, step, index }: IdleStepsProps) {
  return <></>;
}

function ArrivalLocation({ shipment, refetch, step, index }: IdleStepsProps) {
  return <></>;
}

function PickAndDrop({ shipment, refetch, step, index }: IdleStepsProps) {
  return <></>;
}

function POD({ shipment, refetch, step, index }: IdleStepsProps) {
  return <></>;
}
