import { useState, useEffect, useCallback } from "react";
import { racerData } from "../../../../assets/constants/constants";
import classes from "./racing-ship-engines.module.css";
import { useAppSelector } from "../../../../store/typescript-hooks";
import "./main-space-racer-ids.css";
const RacingShipEngines = (): JSX.Element => {
  const userSelectedRacerNumber = useAppSelector(
    (state) => state.userInfo.userSelectedRacerNumber
  );
  const activeRacerData = racerData[userSelectedRacerNumber];

  const keysOfActiveRacerObject = Object.keys(activeRacerData);
  const [racerPulseActive, setRacerPulseActive] = useState(false);

  const enginePulseHandler = useCallback(() => {
    setRacerPulseActive(!racerPulseActive);
  }, [racerPulseActive]);

  useEffect(() => {
    const animationInterval = setTimeout(() => {
      enginePulseHandler();
    }, 200);

    return () => clearTimeout(animationInterval);
  }, [enginePulseHandler]);

  return (
    <>
      {keysOfActiveRacerObject.includes("racerFlameLeftMainPageId") &&
        keysOfActiveRacerObject.includes("racerEngineLeftFlame") &&
        keysOfActiveRacerObject.includes(
          "racerFlameLeftMainPageAnimationClassName"
        ) && (
          <img
            className={`${classes.racerFlame} ${
              racerPulseActive &&
              activeRacerData.racerFlameLeftMainPageAnimationClassName
            }`}
            id={activeRacerData.racerFlameLeftMainPageId}
            src={activeRacerData.racerEngineLeftFlame}
            key={`${activeRacerData.racerFlameLeftMainPageId}-key`}
            alt="left ship engine flame"
          />
        )}
      {keysOfActiveRacerObject.includes("racerFlameCenterMainPageId") &&
        keysOfActiveRacerObject.includes("racerEngineCenterFlame") &&
        keysOfActiveRacerObject.includes(
          "racerFlameCenterMainPageAnimationClassName"
        ) && (
          <img
            className={`${classes.racerFlame} ${
              racerPulseActive &&
              activeRacerData.racerFlameCenterMainPageAnimationClassName
            }`}
            id={activeRacerData.racerFlameCenterMainPageId}
            src={activeRacerData.racerEngineCenterFlame}
            key={`${activeRacerData.racerFlameCenterMainPageId}-key`}
            alt="center ship engine flame"
          />
        )}
      {keysOfActiveRacerObject.includes("racerFlameRightMainPageId") &&
        keysOfActiveRacerObject.includes("racerEngineRightFlame") &&
        keysOfActiveRacerObject.includes(
          "racerFlameRightMainPageAnimationClassName"
        ) && (
          <img
            className={`${classes.racerFlame} ${
              racerPulseActive &&
              activeRacerData.racerFlameRightMainPageAnimationClassName
            }`}
            id={activeRacerData.racerFlameRightMainPageId}
            src={activeRacerData.racerEngineRightFlame}
            key={`${activeRacerData.racerFlameRightMainPageId}-key`}
            alt="right ship engine flame"
          />
        )}
    </>
  );
};
export default RacingShipEngines;
