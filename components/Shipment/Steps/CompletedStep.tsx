import { EStepDefinition, Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { find, includes, last, map } from "lodash";
import { DoneConfirmDatetime } from "./SectionConfirmDatetimeStep";
import { DonePOD } from "./SectionPODStep";
import { Step } from "./Main";
import { DoneOnLocation } from "./SectionOnLocation";
import { Fragment } from "react";

export interface CompletedStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: Step;
  index: number;
}

export default function CompletedSteps(props: CompletedStepsProps) {
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
      return <DoneConfirmDatetime {...props} />;
    case EStepDefinition.ARRIVAL_PICKUP_LOCATION:
    case EStepDefinition.ARRIVAL_DROPOFF:
    case EStepDefinition.PICKUP:
    case EStepDefinition.DROPOFF:
      return <DoneOnLocation {...props} />;
    case EStepDefinition.POD:
      return <DonePOD {...props} />;
    default:
      return <Fragment />;
  }
}
