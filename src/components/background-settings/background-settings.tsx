import { PlayIcon, StopIcon } from "@heroicons/react/24/solid";
import classes from "./background-settings.module.css";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/typescript-hooks";
import { userInfoStoreActions } from "../../store/user-info-store";
import BackgroundSpeedSlider from "./background-speed-slider/background-speed-slider";
const BackgroundSettings = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [dropdownOptionsActive, setDropdownOptionsActive] = useState(false);

  const backgroundClickHandler = () => {
    setDropdownOptionsActive(!dropdownOptionsActive);
  };

  const movingBackgoundActive = useAppSelector(
    (state) => state.userInfo.movingBackgroundActive
  );

  const stopButtonHandler = () => {
    dispatch(
      userInfoStoreActions.setMovingBackgoundActive(!movingBackgoundActive)
    );
  };
  return (
    <div className={classes.backgroundDropdownMenuTopContainer}>
      <button
        className={classes.backgroundDropdownMenuButton}
        onClick={backgroundClickHandler}
      >
        Settings
      </button>
      <div className={classes.contentContainer}>
        {dropdownOptionsActive && movingBackgoundActive && (
          <button
            className={classes.backgroundStopButton}
            onClick={stopButtonHandler}
          >
            <StopIcon className={classes.backgroundStopIcon} />
            <p className={classes.stopButtonText}>STOP</p>
          </button>
        )}
        {dropdownOptionsActive && !movingBackgoundActive && (
          <button
            className={classes.backgroundStartButton}
            onClick={stopButtonHandler}
          >
            <PlayIcon className={classes.backgroundStopIcon} />
            <p className={classes.stopButtonText}>START</p>
          </button>
        )}
        {dropdownOptionsActive && <BackgroundSpeedSlider />}
      </div>
    </div>
  );
};
export default BackgroundSettings;
