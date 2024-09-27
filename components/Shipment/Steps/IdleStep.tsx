import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { get } from "lodash";
import { EStepDefinition } from "./constants";

interface IdleStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: StepDefinition;
  index: number;
}

export default function IdleSteps(props: IdleStepsProps) {
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
