import { useState } from "react";
import classes from "./nav-bar.module.css";
import { MouseEvent } from "react";
import { useAppDispatch } from "../../store/typescript-hooks";
import { popupsStoreActions } from "../../store/popups-store";

import BackgroundSettings from "../background-settings/background-settings";
const NavBar = (): JSX.Element => {
  const buttonIdsList = [
    "nav-bar-start-button",
    "nav-bar-settings-button",
    "nav-bar-racer-button",
  ];
  const [activeButtonsIdsArray, setActiveButtonsIdsArray] = useState([
    "nav-bar-settings-button",
    "nav-bar-start-button",
    "nav-bar-racer-button",
  ]);
  const [animationReadyToTrigger, setAnimationReadyToTrigger] = useState(true);
  const dispatch = useAppDispatch();

  const mouseEnterButton = (event: MouseEvent<HTMLElement>) => {
    const targetElement = event.target as HTMLButtonElement;
    const targetId = targetElement.id;

    if (animationReadyToTrigger) {
      if (buttonIdsList.includes(targetId)) {
        const hoveredButtonIdCurrentPosition =
          activeButtonsIdsArray.indexOf(targetId);

        if (hoveredButtonIdCurrentPosition === 2) {
          // move left
          const newButtonIdsList = activeButtonsIdsArray.slice();

          newButtonIdsList[0] = activeButtonsIdsArray[1];
          newButtonIdsList[1] = activeButtonsIdsArray[2];
          newButtonIdsList[2] = activeButtonsIdsArray[0];
          setActiveButtonsIdsArray(newButtonIdsList);
        } else if (hoveredButtonIdCurrentPosition === 0) {
          //move right
          const newButtonIdsList = buttonIdsList.slice();

          newButtonIdsList[0] = activeButtonsIdsArray[2];
          newButtonIdsList[1] = activeButtonsIdsArray[0];
          newButtonIdsList[2] = activeButtonsIdsArray[1];

          setActiveButtonsIdsArray(newButtonIdsList);
        }
      }

      setAnimationReadyToTrigger(false);
      setTimeout(() => {
        setAnimationReadyToTrigger(true);
      }, 500);
    }
  };
  // const signUpButtonClickHandler = () => {
  //   dispatch(popupsStoreActions.setLockViewportActive(true));
  //   dispatch(popupsStoreActions.setSignupPopupActive(true));
  // };
  const startButtonHandler = () => {
    dispatch(popupsStoreActions.setGameSetupActive(true));
    dispatch(popupsStoreActions.setLockViewportActive(true));
  };

  // const loginButtonClickHandler = () => {
  //   dispatch(popupsStoreActions.setLockViewportActive(true));
  //   dispatch(popupsStoreActions.setLoginPopupActive(true));
  // };

  const changeRacerButtonClickHandler = () => {
    dispatch(popupsStoreActions.setLockViewportActive(true));
    dispatch(popupsStoreActions.setChangeRacerPopupActive(true));
  };

  return (
    <>
      {/* <button
        className={`${classes.navBarButton} 
          ${
            activeButtonsIdsArray[0] === buttonIdsList[0] &&
            classes.navBarButtonLeft
          } 
          ${
            activeButtonsIdsArray[1] === buttonIdsList[0] &&
            classes.navBarButtonCenter
          }
          ${
            activeButtonsIdsArray[2] === buttonIdsList[0] &&
            classes.navBarButtonRight
          }`}
        key="nav-bar-signup-button-key"
        id={buttonIdsList[0]}
        onMouseEnter={mouseEnterButton}
        onClick={signUpButtonClickHandler}
      >
        Signup
      </button> */}
      <button
        className={`${classes.navBarButton} 
          ${
            activeButtonsIdsArray[0] === buttonIdsList[0] &&
            classes.startButtonLeft
          } 
          ${
            activeButtonsIdsArray[1] === buttonIdsList[0] &&
            classes.navBarButtonCenter
          }
          ${
            activeButtonsIdsArray[2] === buttonIdsList[0] &&
            classes.navBarButtonRight
          }`}
        key="nav-bar-start-button-key"
        id={buttonIdsList[0]}
        onMouseEnter={mouseEnterButton}
        onClick={startButtonHandler}
      >
        Start
      </button>
      <div
        className={`${classes.navBarButton} 
            ${
              activeButtonsIdsArray[0] === buttonIdsList[1] &&
              classes.settingBarButtonLeft
            } 
            ${
              activeButtonsIdsArray[1] === buttonIdsList[1] &&
              classes.navBarButtonCenter
            }
            ${
              activeButtonsIdsArray[2] === buttonIdsList[1] &&
              classes.navBarButtonRight
            }`}
        key="nav-bar-background-button-key"
        id={buttonIdsList[1]}
        onMouseEnter={mouseEnterButton}
      >
        <BackgroundSettings />
      </div>
      <button
        className={`${classes.navBarButton} 
              ${
                activeButtonsIdsArray[0] === buttonIdsList[2] &&
                classes.navBarButtonLeft
              } 
              ${
                activeButtonsIdsArray[1] === buttonIdsList[2] &&
                classes.navBarButtonCenter
              }
              ${
                activeButtonsIdsArray[2] === buttonIdsList[2] &&
                classes.navBarButtonRight
              }`}
        key="nav-bar-racer-button-key"
        id={buttonIdsList[2]}
        onMouseEnter={mouseEnterButton}
        onClick={changeRacerButtonClickHandler}
      >
        Racer
      </button>
    </>
  );
};
export default NavBar;
