import { useCallback, useEffect, useState } from "react";
import { formStoreActions } from "../../../../store/form-store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../store/typescript-hooks";
import classes from "./test-timer.module.css";
const TestTimer = (): JSX.Element => {
  const resetTestTimer = useAppSelector(
    (state) => state.formRacing.resetTestTimer
  );
  const testStarted = useAppSelector((state) => state.formRacing.testStarted);
  const endOfTestReached = useAppSelector(
    (state) => state.formRacing.endOfTestReached
  );
  const testResetTriggered = useAppSelector(
    (state) => state.formRacing.testResetTriggered
  );

  const dispatch = useAppDispatch();

  const [overallQuestionTimeInSeconds, setOverallQuestionTimeInSeconds] =
    useState(0);

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

  useEffect(() => {
    if (resetTestTimer) {
      setOverallQuestionTimeInSeconds(0);
      dispatch(formStoreActions.setResetTestTimer(false));
      const overAllTimeOut = setTimeout(() => {
        setOverallQuestionTimeInSeconds(overallQuestionTimeInSeconds + 1);
      }, 1000);
      return () => {
        clearTimeout(overAllTimeOut);
      };
    } else if (testStarted && !endOfTestReached) {
      const overAllTimeOut = setTimeout(() => {
        setOverallQuestionTimeInSeconds(overallQuestionTimeInSeconds + 1);
      }, 1000);
      return () => {
        clearTimeout(overAllTimeOut);
      };
    } else if (endOfTestReached) {
      dispatch(
        formStoreActions.setCompletionTime(overallQuestionTimeInSeconds)
      );
    }
  }, [
    resetTestTimer,
    overallQuestionTimeInSeconds,
    dispatch,
    testStarted,
    endOfTestReached,
  ]);

  useEffect(() => {
    if (testResetTriggered) {
      setOverallQuestionTimeInSeconds(0);
    }
  }, [testResetTriggered, dispatch]);

  return (
    <div className={classes.testTimerContainer}>
      <p className={classes.testTimerLabel}>Overall Timer</p>
      <p className={classes.testTimerTime}>
        {secondsToMinutesAndHoursConvertor(overallQuestionTimeInSeconds)}
      </p>
    </div>
  );
};
export default TestTimer;
