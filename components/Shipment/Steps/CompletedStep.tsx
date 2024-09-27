import { Shipment, StepDefinition } from "@/graphql/generated/graphql";
import { get, head, replace, tail, toNumber } from "lodash";
import { EStepDefinition } from "./constants";
import { DoneConfirmDatetime } from "./SectionConfirmDatetimeStep";
import { DoneArrivalLocation } from "./SectionArrivalLocationStep";
import { DonePickAndDrop } from "./SectionPickAndDropStep";
import { DonePOD } from "./SectionPODStep";

interface CompletedStepsProps {
  shipment: Shipment;
  refetch: Function;
  step: StepDefinition;
  index: number;
}

export default function CompletedSteps(props: CompletedStepsProps) {
  const shipment = props.shipment;
  const step = get(props, "step.step", "");

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

  // Return
  switch (step) {
    case EStepDefinition.CONFIRM_DATETIME:
      return <DoneConfirmDatetime {...props} />;
    case EStepDefinition.ARRIVAL_PICKUP_LOCATION:
    case EStepDefinition.ARRIVAL_DROPOFF:
      const destination = getDirection(isDropoff);
      if (!destination) {
        return <></>;
      }
      return <DoneArrivalLocation {...props} destination={destination} />;
    case EStepDefinition.PICKUP:
    case EStepDefinition.DROPOFF:
      return <DonePickAndDrop {...props} />;
    case EStepDefinition.POD:
      return <DonePOD {...props} />;
    default:
      return <></>;
  }
}
