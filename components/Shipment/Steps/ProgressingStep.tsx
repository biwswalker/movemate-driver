import { EStepDefinition, Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { find, includes, last, map } from "lodash";
import { ProgressConfirmDatetime } from "./SectionConfirmDatetimeStep";
import { ProgressPOD } from "./SectionPODStep";
import { Refund } from "./SectionRefundStep";
import { Step } from "./Main";
import { OnLocation } from "./SectionOnLocation";
import { Fragment } from "react";

export interface ProgressingStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: Step;
  index: number;
}

export default function ProgressingSteps(props: ProgressingStepsProps) {
  const currentStep = props.shipment?.currentStepId as
    | StepDefinition
    | undefined;
  const isCurrentStep = includes(
    map(props.step?.definitions, (def) => def.seq),
    currentStep?.seq
  );
  const stepDefinition = (
    isCurrentStep ? currentStep : last(props.step?.definitions)
  ) as StepDefinition;

  switch (stepDefinition.step) {
    case EStepDefinition.CONFIRM_DATETIME:
      return <ProgressConfirmDatetime {...props} />;
    case EStepDefinition.ARRIVAL_PICKUP_LOCATION:
    case EStepDefinition.ARRIVAL_DROPOFF:
    case EStepDefinition.PICKUP:
    case EStepDefinition.DROPOFF:
      return <OnLocation {...props} />;
    case EStepDefinition.POD:
      return <ProgressPOD {...props} />;
    case EStepDefinition.REFUND:
      return <Refund {...props} />;
    default:
      return <Fragment />;
  }
}
