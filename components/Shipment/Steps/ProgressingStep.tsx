import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { find, includes, last, map } from "lodash";
import { EStepDefinition } from "./constants";
import { ProgressConfirmDatetime } from "./SectionConfirmDatetimeStep";
import { ProgressPOD } from "./SectionPODStep";
import { Refund } from "./SectionRefundStep";
import { Step } from "./Main";
import { OnLocation } from "./SectionOnLocation";

export interface ProgressingStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: Step;
  index: number;
}

export default function ProgressingSteps(props: ProgressingStepsProps) {
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
      return <></>;
  }
}
