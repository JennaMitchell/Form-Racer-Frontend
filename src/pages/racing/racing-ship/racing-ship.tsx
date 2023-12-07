import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/typescript-hooks";
import classes from "./racing-ship.module.css";
import { racerData } from "../../../assets/constants/constants";
import { useState, useCallback, useEffect } from "react";
import RacingShipEngines from "./ship-engines/racing-ship-engines";
import ShipExplosion from "../../../components/animations/ship-explosion/ship-explosion";

import ShipMissilesAnimation from "../../../components/animations/ship-missles/ship-missles-animation";
import { formStoreActions } from "../../../store/form-store";
const RacingShipContainer = () => {
  const dispatch = useAppDispatch();
  const userSelectedRacerNumber = useAppSelector(
    (state) => state.userInfo.userSelectedRacerNumber
  );
  const [racerTopContainerShakePosition, setRacerTopContainerShakePosition] =
    useState("");

  const endOfTestReached = useAppSelector(
    (state) => state.formRacing.endOfTestReached
  );
  const userFailedTest = useAppSelector(
    (state) => state.formRacing.userFailedGame
  );

  const activeQuestionNumber = useAppSelector(
    (state) => state.formRacing.activeQuestionNumber
  );
  const generatedQuestionData = useAppSelector(
    (state) => state.formRacing.generatedQuestionData
  );
  const fireShipWeapons = useAppSelector(
    (state) => state.formRacing.fireShipWeapon
  );
  const testResetTriggered = useAppSelector(
    (state) => state.formRacing.testResetTriggered
  );
  const returnShipHome = useAppSelector(
    (state) => state.formRacing.returnShipHome
  );

  const activeQuestionNumberUpdated = useAppSelector(
    (state) => state.formRacing.activeQuestionNumberUpdated
  );
  const shipReturnedAnimationComplete = useAppSelector(
    (state) => state.formRacing.shipReturnedAnimationComplete
  );
  const homeWorldAnimationComplete = useAppSelector(
    (state) => state.formRacing.homeWorldAnimationComplete
  );
  const weaponFireDestroyedAstroid = useAppSelector(
    (state) => state.formRacing.weaponFireDestroyedAstroid
  );
  /// Handeling the Collision between the ship fired Weapon and the

  const astroidWeaponFireCollisionHandler = useCallback(() => {
    const weaponFireElement = document.getElementById("fired_weapons_image");

    if (generatedQuestionData.length !== 0) {
      const activeQuestionElement = document.getElementById(
        `${generatedQuestionData[activeQuestionNumber - 1].id}`
      );

      if (weaponFireElement && activeQuestionElement) {
        const weaponFireBoundingRect =
          weaponFireElement.getBoundingClientRect();
        const activeQuestionBoundingRect =
          activeQuestionElement.getBoundingClientRect();

        const weaponFireTopPosition = weaponFireBoundingRect.top;
        const activeQuestionBoundingRectTopPosition =
          activeQuestionBoundingRect.top;
        const activeQuestionElementHeightWithPixel =
          activeQuestionElement.style.height;
        let activeQuestionElementHeightArray =
          activeQuestionElementHeightWithPixel.split("");
        activeQuestionElementHeightArray.splice(
          activeQuestionElementHeightArray.length - 3,
          2
        );

        const activeQuestionHeight = +activeQuestionElementHeightArray.join("");
        const activeQuestionBottomEdgeFromTop =
          activeQuestionHeight + activeQuestionBoundingRectTopPosition;

        if (weaponFireTopPosition <= activeQuestionBottomEdgeFromTop) {
          dispatch(formStoreActions.setAstroidExplosionTriggered(true));
          dispatch(formStoreActions.setWeaponFireDestroyedAstroid(true));
        }
      }
    }
  }, [activeQuestionNumber, dispatch, generatedQuestionData]);

  useEffect(() => {
    if (fireShipWeapons && !weaponFireDestroyedAstroid) {
      const collisionCheckTimeout = setInterval(() => {
        astroidWeaponFireCollisionHandler();
      }, 100);

      return () => {
        clearInterval(collisionCheckTimeout);
      };
    }
  }, [
    astroidWeaponFireCollisionHandler,
    fireShipWeapons,
    weaponFireDestroyedAstroid,
  ]);

  // reset function
  useEffect(() => {
    if (activeQuestionNumberUpdated || endOfTestReached) {
      dispatch(formStoreActions.setWeaponFireDestroyedAstroid(false));
      dispatch(formStoreActions.setFireShipWeapons(false));
    }
  }, [activeQuestionNumberUpdated, dispatch, endOfTestReached]);

  const selectedShipShakeHandler = useCallback(() => {
    if (racerTopContainerShakePosition === "left") {
      setRacerTopContainerShakePosition("center");
    } else if (racerTopContainerShakePosition === "center") {
      setRacerTopContainerShakePosition("right");
    } else {
      setRacerTopContainerShakePosition("left");
    }
  }, [racerTopContainerShakePosition]);

  useEffect(() => {
    const shipAnimationInterval = setTimeout(() => {
      selectedShipShakeHandler();
    }, 2000);

    return () => clearTimeout(shipAnimationInterval);
  }, [selectedShipShakeHandler]);

  useEffect(() => {
    if (endOfTestReached && !userFailedTest && homeWorldAnimationComplete) {
      dispatch(formStoreActions.setReturnShipHome(true));

      const returnShipAnimationTimeOut = setTimeout(() => {
        dispatch(formStoreActions.setShipReturnedAnimationComplete(true));
      }, 2500);

      return () => {
        clearTimeout(returnShipAnimationTimeOut);
      };
    }
  }, [endOfTestReached, userFailedTest, dispatch, homeWorldAnimationComplete]);

  return (
    <div
      className={`${classes.shipContainer} ${
        racerTopContainerShakePosition === "right" && classes.shipMoveRight
      }  ${racerTopContainerShakePosition === "left" && classes.shipMoveLeft}
      ${returnShipHome && classes.returnShipHome}
      ${shipReturnedAnimationComplete && classes.hideShip}
      ${testResetTriggered && classes.resetShip}
   `}
    >
      {endOfTestReached && userFailedTest && <ShipExplosion />}

      {!userFailedTest && !shipReturnedAnimationComplete && (
        <>
          <img
            className={classes.shipHull}
            src={racerData[userSelectedRacerNumber].racerBody}
            alt="ship racer hull"
          />
          <RacingShipEngines />
        </>
      )}

      <ShipMissilesAnimation fireShipMissle={fireShipWeapons} />
    </div>
  );
};
export default RacingShipContainer;
