import classes from "./racing-main.module.css";
import { useSetWindowScrollBarVar } from "../../utilities/media-queries/general-media-queries";

import RacingShipContainer from "./racing-ship/racing-ship";
import ScrollingStarBackground from "./scrolling-star-background/scrolling-star-background";

import { useAppDispatch, useAppSelector } from "../../store/typescript-hooks";
import FormGeneratorMainPage from "./forms/generator/form-generator";
import QuestionTimerWindow from "./forms/question-timer/question-timer";
import LivesTrackerComponent from "./lives-tracker/lives-tracker-component/lives-tracker-component";
import GameOverScreen from "./game-over-screen/game-over-screen";
import TestTimer from "./forms/test-timer/test-timer";
import TestCompleteScreen from "./test-complete-screen/test-complete-screen";

import HomeWorldImage from "../../assets/images/home-world-image/home_world.png";
import { useEffect } from "react";
import { formStoreActions } from "../../store/form-store";

const RacingTopElement = (): JSX.Element => {
  useSetWindowScrollBarVar();
  const dispatch = useAppDispatch();

  const movingBackgoundActive = useAppSelector(
    (state) => state.userInfo.movingBackgroundActive
  );
  const gameOverScreenActive = useAppSelector(
    (state) => state.formRacing.gameOverScreenActive
  );
  const endOfTestReached = useAppSelector(
    (state) => state.formRacing.endOfTestReached
  );

  const shipReturnedAnimationComplete = useAppSelector(
    (state) => state.formRacing.shipReturnedAnimationComplete
  );

  const userFailedGame = useAppSelector(
    (state) => state.formRacing.userFailedGame
  );
  const testResetTriggered = useAppSelector(
    (state) => state.formRacing.testResetTriggered
  );

  useEffect(() => {
    if (testResetTriggered) {
      dispatch(formStoreActions.setTestResetTriggered(false));
    }
  }, [dispatch, testResetTriggered]);

  return (
    <main className={classes.racingMainBackdrop}>
      {movingBackgoundActive && <ScrollingStarBackground />}
      {
        <img
          className={`${classes.homeWorldImage} ${
            endOfTestReached && !userFailedGame && classes.homeWorldMoveIn
          } ${shipReturnedAnimationComplete && classes.homeWorldFadeOut} ${
            testResetTriggered && classes.resetHomeWorld
          }`}
          alt="home world"
          src={HomeWorldImage}
        />
      }

      <div className={classes.racingMainContainer}>
        <FormGeneratorMainPage />
      </div>
      <RacingShipContainer />
      <div className={classes.timersContainer}>
        <LivesTrackerComponent />
        <TestTimer />
        <QuestionTimerWindow />
      </div>

      {gameOverScreenActive && userFailedGame && <GameOverScreen />}
      {endOfTestReached && !userFailedGame && <TestCompleteScreen />}
    </main>
  );
};
export default RacingTopElement;
