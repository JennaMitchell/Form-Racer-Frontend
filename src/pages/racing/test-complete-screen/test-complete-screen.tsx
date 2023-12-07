import classes from "./test-complete-screen.module.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/typescript-hooks";

import { formStoreActions } from "../../../store/form-store";
import ScoreSubmitter from "./score-submitter/score-submitter";
import AnimatedLeaderboard from "../leaderboards/animated-leaderboard/animated-leaderboard";
import { testResetFunction } from "../../../assets/test-functions/test-function";
const TestCompleteScreen = (): JSX.Element => {
  const username = useAppSelector((state) => state.userInfo.username);
  const testCompletionTime = useAppSelector(
    (state) => state.formRacing.completionTime
  );
  const dispatch = useAppDispatch();
  const endOfTestReached = useAppSelector(
    (state) => state.formRacing.endOfTestReached
  );

  const [currentAnimationPhase, setCurrentAnimationPhase] = useState(0);
  const [userEnteredUsername, setUserEnteredUsername] = useState("");
  const [submitUserScoreWindowActive, setSubmitUserScoreWindowActive] =
    useState(false);
  const secondsToMinutesAndHoursConvertor = useCallback(
    (timeInSeconds: number) => {
      let numberOfSeconds = timeInSeconds;
      let numberOfMinutes = 0;
      let numberOfHours = 0;
      let returnString = "";
      if (timeInSeconds >= 60) {
        numberOfMinutes = Math.floor(timeInSeconds / 60);
        if (numberOfMinutes >= 60) {
          numberOfHours = Math.floor(numberOfMinutes / 60);
          numberOfMinutes = numberOfMinutes - numberOfHours * 60;
          numberOfSeconds =
            numberOfSeconds - numberOfMinutes * 60 - numberOfHours * 3600;
        }

        if (numberOfHours === 0) {
          numberOfSeconds = numberOfSeconds - numberOfMinutes * 60;
        }
      }
      if (numberOfHours !== 0) {
        returnString = returnString + `${numberOfHours}h`;
      }

      if (numberOfMinutes !== 0) {
        returnString = returnString + ` ${numberOfMinutes}m`;
      }
      returnString = returnString + ` ${numberOfSeconds}s`;

      return returnString.trim();
    },
    []
  );
  const textToBeRendered = useMemo(() => {
    return [
      `Congratulations ${username.length !== 0 ? username : "User"} !`,

      `You Returned Home !`,
      `Your Time: ${secondsToMinutesAndHoursConvertor(testCompletionTime)}`,
    ];
  }, [username, testCompletionTime, secondsToMinutesAndHoursConvertor]);

  const [displayStrings, setDisplayStrings] = useState(["", "", ""]);
  const [typingInterval, setTypingInterval] = useState(0);
  const [flashTypeBar, setFlashTypeBar] = useState(false);
  const [animationEnd, setAnimationEnd] = useState(false);
  const shipReturnedAnimationComplete = useAppSelector(
    (state) => state.formRacing.shipReturnedAnimationComplete
  );

  useEffect(() => {
    if (!animationEnd && shipReturnedAnimationComplete) {
      const splitStringToBeTyped =
        textToBeRendered[currentAnimationPhase].split("");

      const animationTimeoutInterval = setTimeout(() => {
        if (typingInterval < splitStringToBeTyped.length) {
          const tempString =
            displayStrings[currentAnimationPhase] +
            splitStringToBeTyped[typingInterval];
          const tempCopyOfDisplayStrings = JSON.parse(
            JSON.stringify(displayStrings)
          );

          tempCopyOfDisplayStrings[currentAnimationPhase] = tempString;
          setTypingInterval(typingInterval + 1);
          setDisplayStrings(tempCopyOfDisplayStrings);
        } else {
          const nextAnimationPhase = currentAnimationPhase + 1;

          if (nextAnimationPhase >= textToBeRendered.length) {
            setAnimationEnd(true);
          } else {
            setCurrentAnimationPhase(nextAnimationPhase);
            setTypingInterval(0);
          }
        }
      }, 150);
      return () => {
        clearTimeout(animationTimeoutInterval);
      };
    } else if (animationEnd && shipReturnedAnimationComplete) {
      setCurrentAnimationPhase(4);
      setSubmitUserScoreWindowActive(true);
    }
  }, [
    animationEnd,
    currentAnimationPhase,
    displayStrings,
    textToBeRendered,
    typingInterval,
    shipReturnedAnimationComplete,
  ]);

  // flashing Typing Bar

  useEffect(() => {
    if (!animationEnd) {
      const flashInterval = setTimeout(() => {
        setFlashTypeBar(!flashTypeBar);
      }, 150);

      return () => {
        clearTimeout(flashInterval);
      };
    }
  }, [animationEnd, flashTypeBar]);

  // moving the homeworld into view once the test is complete

  useEffect(() => {
    if (endOfTestReached) {
      const homePlanetAnimationTimeOut = setTimeout(() => {
        dispatch(formStoreActions.setHomeWorldAnimationComplete(true));
      }, 5000);
      return () => {
        return clearTimeout(homePlanetAnimationTimeOut);
      };
    }
  }, [endOfTestReached, dispatch]);

  // user submitting score

  const userSubmitInputHandler = (enteredUsername: string) => {
    setSubmitUserScoreWindowActive(false);
    setUserEnteredUsername(enteredUsername);
  };

  const tryAgainButtonHandler = () => {
    testResetFunction(dispatch);
  };

  return (
    <div className={classes.testCompleteMainContainer}>
      {shipReturnedAnimationComplete && currentAnimationPhase >= 0 && (
        <div className={classes.typingdAnimationContainer}>
          <p className={classes.testString}>{displayStrings[0]}</p>
          {currentAnimationPhase === 0 && (
            <div
              className={`${classes.typingBar} ${
                flashTypeBar ? classes.typeBarActive : classes.typeBarInactive
              } `}
            ></div>
          )}
        </div>
      )}
      {shipReturnedAnimationComplete && currentAnimationPhase >= 1 && (
        <div className={classes.typingdAnimationContainer}>
          <p className={classes.testString}>{displayStrings[1]}</p>
          {currentAnimationPhase === 1 && (
            <div
              className={`${classes.typingBar} ${
                flashTypeBar ? classes.typeBarActive : classes.typeBarInactive
              } `}
            ></div>
          )}
        </div>
      )}
      {shipReturnedAnimationComplete && currentAnimationPhase >= 2 && (
        <div className={classes.typingdAnimationContainer}>
          <p className={classes.testString}>{displayStrings[2]}</p>
          {currentAnimationPhase === 2 && (
            <div
              className={`${classes.typingBar} ${
                flashTypeBar ? classes.typeBarActive : classes.typeBarInactive
              } `}
            ></div>
          )}
        </div>
      )}
      {shipReturnedAnimationComplete && currentAnimationPhase >= 3 && (
        <div className={classes.typingdAnimationContainer}>
          <p className={classes.testString}>{displayStrings[3]}</p>
          {currentAnimationPhase === 3 && (
            <div
              className={`${classes.typingBar} ${
                flashTypeBar ? classes.typeBarActive : classes.typeBarInactive
              } `}
            ></div>
          )}
        </div>
      )}
      {shipReturnedAnimationComplete &&
        currentAnimationPhase === 4 &&
        submitUserScoreWindowActive && (
          <ScoreSubmitter scoreSubmitHandler={userSubmitInputHandler} />
        )}
      {shipReturnedAnimationComplete &&
        currentAnimationPhase === 4 &&
        !submitUserScoreWindowActive && (
          <button
            className={classes.playAgainButton}
            onClick={tryAgainButtonHandler}
          >
            Try Again ?
          </button>
        )}

      {shipReturnedAnimationComplete &&
        currentAnimationPhase === 4 &&
        !submitUserScoreWindowActive && (
          <AnimatedLeaderboard
            submittedUsername={userEnteredUsername}
            usersTimeInSeconds={testCompletionTime}
          />
        )}
    </div>
  );
};
export default TestCompleteScreen;
