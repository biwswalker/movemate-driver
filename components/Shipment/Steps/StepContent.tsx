import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { EStepStatus } from "./constants";
import IdleSteps from "./IdleStep";
import { get } from "lodash";
import ProgressingSteps from "./ProgressingStep";
import CompletedSteps from "./CompletedStep";
import CancelledSteps from "./CancelledStep";
import { View } from "react-native";

interface StepContentProps {
  shipment: Shipment;
  step: StepDefinition;
  refetch: Function;
  index: number;
}

export default function StepContent(props: StepContentProps) {
  const status = get(props, "step.stepStatus", "");

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
