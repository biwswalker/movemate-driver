import colors from "@constants/colors";
import {
  EStepDefinition,
  Shipment,
  StepDefinition,
} from "@/graphql/generated/graphql";
import {
  filter,
  find,
  findIndex,
  includes,
  isEmpty,
  isEqual,
  map,
} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import Accordion from "react-native-collapsible/Accordion";
import StepHeader from "@/components/Shipment/Steps/StepHeader";
import StepContent from "@/components/Shipment/Steps/StepContent";

export interface Step {
  seq: number;
  definitions: StepDefinition[];
}

interface IShipmentStep {
  steps: StepDefinition[];
  shipment: Shipment;
  refetch: Function;
}

export function MainStep({ steps, shipment, refetch }: IShipmentStep) {
  const accordionRef = useRef<Accordion<Step>>(null);
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const contents = useMemo(() => {
    const filterCotents = filter(
      steps,
      (step: StepDefinition) =>
        !includes([EStepDefinition.PICKUP, EStepDefinition.DROPOFF], step.step)
    );
    const recontents = map<StepDefinition, Step>(
      filterCotents || [],
      (step, index) => {
        if (isEqual(step.step, EStepDefinition.ARRIVAL_PICKUP_LOCATION)) {
          const pickupDefinition = find(steps, [
            "step",
            EStepDefinition.PICKUP,
          ]);
          return {
            definitions: [
              step,
              ...(pickupDefinition ? [pickupDefinition] : []),
            ],
            seq: index,
          };
        }
        if (isEqual(step.step, EStepDefinition.ARRIVAL_DROPOFF)) {
          const nextStep = step.seq + 1;
          const dropoffDefinition = find(steps, ["seq", nextStep]);
          return {
            definitions: [
              step,
              ...(dropoffDefinition ? [dropoffDefinition] : []),
            ],
            seq: index,
          };
        }
        return {
          definitions: [step],
          seq: index,
        };
      }
    );
    return recontents;
  }, [steps]);

  useEffect(() => {
    setTimeout(() => {
      const contentStep = findIndex(contents, (content) => {
        const def = find(content.definitions, [
          "seq",
          shipment.currentStepId?.seq,
        ]);
        return !isEmpty(def);
      });
      setActiveSections([contentStep]);
      if (accordionRef.current) {
        accordionRef.current.forceUpdate();
      }
    }, 10);
  }, [shipment.currentStepId]);

  function _renderHeader(
    content: Step,
    index: number,
    isActive: boolean,
    sections: Step[]
  ) {
    return (
      <StepHeader
        step={content}
        index={index}
        isActive={isActive}
        shipment={shipment}
      />
    );
  }

  function _renderContent(
    content: Step,
    index: number,
    isActive: boolean,
    sections: Step[]
  ) {
    return (
      <StepContent
        step={content}
        index={index}
        shipment={shipment}
        refetch={refetch}
      />
    );
  }

  function handleChangeSection(indexs: number[]) {
    setActiveSections(indexs);
  }

  return (
    <Accordion<Step>
      ref={accordionRef}
      sections={contents}
      activeSections={activeSections}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={handleChangeSection}
      containerStyle={{ backgroundColor: colors.background.paper }}
      touchableProps={{ activeOpacity: colors.action.hoverOpacity }}
      underlayColor={colors.action.hover}
      // renderAsFlatList
    />
  );
}
