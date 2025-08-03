import {
  EStepDefinition,
  Shipment,
  StepDefinition,
} from "@/graphql/generated/graphql";
import { find, includes, last, map } from "lodash";
import { Step } from "./Main";
import { Fragment } from "react";

interface IdleStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: Step;
  index: number;
}

export default function IdleSteps(props: IdleStepsProps) {
  const currentStep = props.shipment?.currentStepId as
    | StepDefinition
    | undefined;
  const isCurrentStep = includes(
    map(props.step?.definitions, (def) => def.seq),
    currentStep?.seq
  );
  const latestStep = last(props.step?.definitions);
  const stepDefinition = (
    isCurrentStep ? currentStep : latestStep
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
      return <Fragment />;
  }
}

function ConfirmDatetime({ shipment, refetch, step, index }: IdleStepsProps) {
  return <Fragment />;
}

function ArrivalLocation({ shipment, refetch, step, index }: IdleStepsProps) {
  return <Fragment />;
}

function PickAndDrop({ shipment, refetch, step, index }: IdleStepsProps) {
  return <Fragment />;
}

function POD({ shipment, refetch, step, index }: IdleStepsProps) {
  return <Fragment />;
}
