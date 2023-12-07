import classes from "./change-racer-window.module.css";
import { racerData } from "../../assets/constants/constants";
import { useCallback, useState, useMemo, useEffect } from "react";

import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import "./popup-racer-ids.css";

const ChangeRacerWindow = ({
  racingShipNumberExtractor,
}: {
  racingShipNumberExtractor: (selectedRacer: number) => void;
}): JSX.Element => {
  const [selectedRacerIndex, setSelectedRacerIndex] = useState(4);

  const [activeRacerData, activeRacerBodyImage, keysOfActiveRacerObject] =
    useMemo(() => {
      const activeRacerData = racerData[selectedRacerIndex];
      const activeRacerBodyImage = activeRacerData.racerBody;
      const keysOfActiveRacerObject = Object.keys(activeRacerData);
      return [activeRacerData, activeRacerBodyImage, keysOfActiveRacerObject];
    }, [selectedRacerIndex]);

  const [racerPulseActive, setRacerPulseActive] = useState(false);
  const [renderReadyShipFlames, setRenderReadyShipFlames] = useState<
    JSX.Element[]
  >([]);
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setTimeout(() => {
        setRacerPulseActive(!racerPulseActive);
      }, 200);
    }, 250);

    return () => clearInterval(animationInterval);
  }, [racerPulseActive]);

  const leftArrowButtonHandler = () => {
    if (selectedRacerIndex === 0) {
      setSelectedRacerIndex(racerData.length - 1);
      racingShipNumberExtractor(racerData.length - 1);
    } else {
      setSelectedRacerIndex(selectedRacerIndex - 1);
      racingShipNumberExtractor(selectedRacerIndex - 1);
    }
  };
  const rightArrowButtonHandler = () => {
    if (selectedRacerIndex === racerData.length - 1) {
      setSelectedRacerIndex(0);
      racingShipNumberExtractor(0);
    } else {
      setSelectedRacerIndex(selectedRacerIndex + 1);
      racingShipNumberExtractor(selectedRacerIndex + 1);
    }
  };

  const setShipFlamesJSXElements = useCallback(() => {
    const tempRenderReadyShipFlames: JSX.Element[] = [];
    for (
      let indexOfKeysOfActiveRacerObject = 0;
      indexOfKeysOfActiveRacerObject < keysOfActiveRacerObject.length;
      indexOfKeysOfActiveRacerObject++
    ) {
      if (
        keysOfActiveRacerObject[indexOfKeysOfActiveRacerObject] ===
          "racerFlameLeftPopupId" &&
        keysOfActiveRacerObject.includes("racerEngineLeftFlame") &&
        keysOfActiveRacerObject.includes(
          "racerFlameLeftPopupAnimationClassName"
        )
      ) {
        tempRenderReadyShipFlames.push(
          <img
            className={`${classes.racerFlame} ${
              racerPulseActive &&
              activeRacerData.racerFlameLeftPopupAnimationClassName
            }`}
            id={activeRacerData.racerFlameLeftPopupId}
            src={activeRacerData.racerEngineLeftFlame}
            key={`${activeRacerData.racerFlameLeftPopupId}-key`}
            alt="left ship engine flame"
          />
        );
      }
      if (
        keysOfActiveRacerObject[indexOfKeysOfActiveRacerObject] ===
          "racerFlameCenterPopupId" &&
        keysOfActiveRacerObject.includes("racerEngineCenterFlame") &&
        keysOfActiveRacerObject.includes(
          "racerFlameCenterPopupAnimationClassName"
        )
      ) {
        tempRenderReadyShipFlames.push(
          <img
            className={`${classes.racerFlame} ${
              racerPulseActive &&
              activeRacerData.racerFlameCenterPopupAnimationClassName
            }`}
            id={activeRacerData.racerFlameCenterPopupId}
            src={activeRacerData.racerEngineCenterFlame}
            key={`${activeRacerData.racerFlameCenterPopupId}-key`}
            alt="center ship engine flame"
          />
        );
      }
      if (
        keysOfActiveRacerObject[indexOfKeysOfActiveRacerObject] ===
          "racerFlameRightPopupId" &&
        keysOfActiveRacerObject.includes("racerEngineRightFlame") &&
        keysOfActiveRacerObject.includes(
          "racerFlameRightPopupAnimationClassName"
        )
      ) {
        tempRenderReadyShipFlames.push(
          <img
            className={`${classes.racerFlame} ${
              racerPulseActive &&
              activeRacerData.racerFlameRightPopupAnimationClassName
            }`}
            id={activeRacerData.racerFlameRightPopupId}
            src={activeRacerData.racerEngineRightFlame}
            key={`${activeRacerData.racerFlameRightPopupId}-key`}
            alt="right ship engine flame"
          />
        );
      }
    }
    setRenderReadyShipFlames(tempRenderReadyShipFlames);
  }, [
    activeRacerData.racerEngineLeftFlame,
    activeRacerData.racerEngineCenterFlame,
    activeRacerData.racerEngineRightFlame,
    activeRacerData.racerFlameCenterPopupAnimationClassName,
    activeRacerData.racerFlameCenterPopupId,
    activeRacerData.racerFlameLeftPopupAnimationClassName,
    activeRacerData.racerFlameLeftPopupId,
    activeRacerData.racerFlameRightPopupAnimationClassName,
    activeRacerData.racerFlameRightPopupId,
    racerPulseActive,
    keysOfActiveRacerObject,
  ]);

  useEffect(() => {
    setShipFlamesJSXElements();
  }, [setShipFlamesJSXElements]);

  return (
    <div className={classes.changeRacerWindowMainContainer}>
      <button
        className={`${classes.arrowButton} ${classes.leftArrowButton}`}
        onClick={leftArrowButtonHandler}
      >
        <ChevronLeftIcon className={classes.arrowButtonIcon} />
      </button>

      <img
        className={classes.racerBodyImage}
        src={activeRacerBodyImage}
        alt="racer-body"
      />
      {renderReadyShipFlames}

      <button
        className={`${classes.arrowButton} ${classes.rightArrowButton}`}
        onClick={rightArrowButtonHandler}
      >
        <ChevronRightIcon className={classes.arrowButtonIcon} />
      </button>
    </div>
  );
};
export default ChangeRacerWindow;
