import {
  EStepStatus,
  Shipment,
  StepDefinition,
} from "@/graphql/generated/graphql";
import IdleSteps from "./IdleStep";
import { find, get, includes, last, map } from "lodash";
import ProgressingSteps from "./ProgressingStep";
import CompletedSteps from "./CompletedStep";
import CancelledSteps from "./CancelledStep";
import { View } from "react-native";
import { Step } from "./Main";

interface StepContentProps {
  shipment: Shipment;
  refetch: Function;
  index: number;
  step: Step;
}

export default function StepContent(props: StepContentProps) {
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

  const status = get(stepDefinition, "stepStatus", "");

  return (
    <View>
      {status === EStepStatus.IDLE && <IdleSteps {...props} />}
      {status === EStepStatus.PROGRESSING && <ProgressingSteps {...props} />}
      {status === EStepStatus.DONE && <CompletedSteps {...props} />}
      {(status === EStepStatus.CANCELLED || status === EStepStatus.EXPIRE) && (
        <CancelledSteps {...props} />
      )}
    </View>
  );
}
