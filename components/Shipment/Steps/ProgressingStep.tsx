import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { get, head, replace, tail, toNumber } from "lodash";
import { EStepDefinition } from "./constants";
import { ProgressConfirmDatetime } from "./SectionConfirmDatetimeStep";
import { ProgressArrivalLocation } from "./SectionArrivalLocationStep";
import { ProgressPickAndDrop } from "./SectionPickAndDropStep";
import { DonePOD } from "./SectionPODStep";
import { Refund } from "./SectionRefundStep";

export interface ProgressingStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: StepDefinition;
  index: number;
}

export default function ProgressingSteps(props: ProgressingStepsProps) {
  const step = get(props, "step.step", "");
  const shipment = props.shipment;
  switch (step) {
    case EStepDefinition.CONFIRM_DATETIME:
      return <ProgressConfirmDatetime {...props} />;
    case EStepDefinition.ARRIVAL_PICKUP_LOCATION:
    case EStepDefinition.ARRIVAL_DROPOFF:
      const getDirection = (isDropoff: boolean) => {
        if (isDropoff) {
          const getNumberReplaced = replace(
            props.step.driverMessage,
            "จัดส่งสินค้าจุดที่",
            ""
          );
          const findex = toNumber(getNumberReplaced) - 1;
          const destinations = tail(shipment.destinations);
          const destination =
            destinations.length > 1 ? destinations[findex] : destinations[0];
          return destination;
        } else {
          const destination = head(shipment.destinations);
          return destination;
        }
      };
      const isDropoff = step === EStepDefinition.ARRIVAL_DROPOFF;
      const destination = getDirection(isDropoff);
      if (!destination) {
        return <></>;
      }
      return <ProgressArrivalLocation {...props} destination={destination} />;
    case EStepDefinition.PICKUP:
    case EStepDefinition.DROPOFF:
      return <ProgressPickAndDrop {...props} />;
    case EStepDefinition.POD:
      return <DonePOD {...props} />;
    case EStepDefinition.REFUND:
      return <Refund {...props} />;
    default:
      return <></>;
  }
}
