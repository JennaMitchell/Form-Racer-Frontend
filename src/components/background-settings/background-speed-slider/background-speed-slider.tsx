import classes from "./background-speed-slider.module.css";
import { useEffect, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/typescript-hooks";
import { userInfoStoreActions } from "../../../store/user-info-store";
const BackgroundSpeedSlider = (): JSX.Element => {
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const backgroundSpeed = useAppSelector(
    (state) => state.userInfo.backgroundSpeed
  );
  useEffect(() => {
    const currentSliderRef = sliderRef.current;
    if (currentSliderRef) {
      const hueStepsArray = [];
      for (let i = 0; i < 10; i++) {
        hueStepsArray[i] = (i + 1) * 12;
      }
      const reversedHueArray = hueStepsArray.reverse();
      const newSliderValue = currentSliderRef.valueAsNumber;
      currentSliderRef.style.backgroundSize = `${
        (newSliderValue * 100) / 10
      }% 100%`;
      currentSliderRef.style.backgroundImage = `linear-gradient(hsl(${
        reversedHueArray[newSliderValue - 1]
      }, 100%, 50%) , hsl(${
        reversedHueArray[newSliderValue - 1]
      } , 100%, 50%))`;
    }
  }, []);

  const sliderOnChangeHandler = () => {
    const currentSliderRef = sliderRef.current;
    if (currentSliderRef) {
      const hueStepsArray = [];
      for (let i = 0; i < 10; i++) {
        hueStepsArray[i] = (i + 1) * 12;
      }
      const reversedHueArray = hueStepsArray.reverse();
      const newSliderValue = currentSliderRef.valueAsNumber;
      currentSliderRef.style.backgroundSize = `${
        (newSliderValue * 100) / 10
      }% 100%`;
      currentSliderRef.style.backgroundImage = `linear-gradient(hsl(${
        reversedHueArray[newSliderValue - 1]
      }, 100%, 50%) , hsl(${
        reversedHueArray[newSliderValue - 1]
      } , 100%, 50%))`;

      dispatch(userInfoStoreActions.setBackgroundSpeed(newSliderValue));
    }
  };

  return (
    <div className={classes.sliderContainer}>
      <label className={classes.sliderLabel} htmlFor="speedRange">
        Speed
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={backgroundSpeed}
        className={classes.speedSlider}
        id="speedRange"
        onChange={sliderOnChangeHandler}
        ref={sliderRef}
      />
      <p className={classes.sliderValue}>{backgroundSpeed}</p>
    </div>
  );
};
export default BackgroundSpeedSlider;
