import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { formStoreActions } from "../../../../../../store/form-store";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../../store/typescript-hooks";
import { updateActiveQuestionNumber } from "../shared-components-functions";
import AstroidExplosion from "../../../../../../components/animations/astroid-explosion/astroid-explosion";
import AstroidImage from "../astroid-image/astroid-image";
import classes from "./generated-dates.module.css";
import PressEnterMessage from "../press-enter-message/press-enter-message";
import { KeyboardEvent } from "react";
import { decreaseLivesTracker } from "../../../../lives-tracker/lives-tracker-functions";

import { updateUserAnswers } from "../shared-components-functions";
import sharedClasses from "../components-shared-css.module.css";

type Props = {
  questionId: string;
  questionNumber: number;
  dateQuestion: string;
  totalNumberOfQuestions: number;
  startDate: string;
  endDate: string;
};
const GeneratedDate = ({
  questionId,
  questionNumber,
  dateQuestion,
  totalNumberOfQuestions,
  startDate,
  endDate,
}: Props): JSX.Element => {
  const dateInputRef = useRef<null | HTMLInputElement>(null);
  const topContainerRef = useRef<null | HTMLDivElement>(null);

  const [resetIntermVar, setResetIntermVar] = useState(false);
  // resetIntermVar is to allow the astroid to re-render at the top of the page then trigger the move animation

  const [resetTimeoutTriggered, setResetTimeoutTriggered] = useState(false);
  // resetTimeout is here so that the reset timeout only triggers once giving time for the astroid to move back to the top before
  // refreshing
  // issue arising when the moving backend can refrest trigger when

  const [submitMessageActive, setSubmitMessageActive] = useState(false);

  const userAnswersArray = useAppSelector(
    (state) => state.formRacing.userAnswersArray
  );
  const userLivesArray = useAppSelector(
    (state) => state.formRacing.activeLifesArray
  );
  const gameSettings = useAppSelector((state) => state.userInfo.gameSettings);
  const astroidDestroyed = useAppSelector(
    (state) => state.formRacing.astroidDestroyed
  );
  const activeQuestionNumberUpdated = useAppSelector(
    (state) => state.formRacing.activeQuestionNumberUpdated
  );
  const astroidExplosionTriggered = useAppSelector(
    (state) => state.formRacing.astroidExplosionTriggered
  );
  const testResetTriggered = useAppSelector(
    (state) => state.formRacing.testResetTriggered
  );

  const timePerQuestionInSeconds = useMemo(() => {
    return gameSettings.timePerQuestionInSeconds;
  }, [gameSettings.timePerQuestionInSeconds]);

  const dispatch = useAppDispatch();
  const [questionAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [triggerAnimation, setTriggerAnimation] = useState(false);

  // Handeling question Timer
  const questionTimerHandler = useCallback(() => {
    const topContainerRefCurrent = topContainerRef.current;
    if (topContainerRefCurrent) {
      const topContainerDivElement = topContainerRefCurrent;

      topContainerDivElement.style.transition = `all ${timePerQuestionInSeconds}s ease-in`;
      topContainerDivElement.style.top = `calc(100vh - 450px)`;
    }
    dispatch(formStoreActions.setStartQuestionTimer(true));
  }, [timePerQuestionInSeconds, dispatch]);

  // useEffect below is used to initalize the astroid to move on the first render
  useEffect(() => {
    setTimeout(
      () => {
        setTriggerAnimation(true);
        dispatch(formStoreActions.setStartQuestionTimer(true));
      },

      100
    );
  }, [dispatch]);

  // useEffect used to trigger the astroid to move
  useEffect(() => {
    if (triggerAnimation) {
      setTriggerAnimation(false);
      questionTimerHandler();
    }
  }, [triggerAnimation, dispatch, questionTimerHandler]);

  useEffect(() => {
    if (astroidDestroyed) {
      const updateTimeout = setTimeout(() => {
        updateActiveQuestionNumber(
          dispatch,
          questionNumber,
          totalNumberOfQuestions
        );
        dispatch(formStoreActions.setAstroidDestroyed(false));
      }, 5000);

      return () => {
        clearTimeout(updateTimeout);
      };
    }
  }, [astroidDestroyed, dispatch, questionNumber, totalNumberOfQuestions]);

  // reset astroid position when active question number is updated

  useEffect(() => {
    if (activeQuestionNumberUpdated) {
      const topContainerCurrent = topContainerRef.current;
      if (topContainerCurrent) {
        const notNullCurrentRef = topContainerCurrent;
        // moving next question to the top of the viewport and transition none so its instantaneous
        notNullCurrentRef.style.top = "0px";
        notNullCurrentRef.style.transition = `none`;
      }

      setResetIntermVar(true);

      dispatch(formStoreActions.setActiveQuestionNumberUpdated(false));
    }
  }, [dispatch, activeQuestionNumberUpdated]);

  useEffect(() => {
    if (resetIntermVar && !resetTimeoutTriggered) {
      setTimeout(
        () => {
          setTriggerAnimation(true);
          setResetIntermVar(false);
          setResetTimeoutTriggered(false);
          setQuestionAnsweredCorrectly(false);
        },

        100
      );

      setResetTimeoutTriggered(true);
    }
  }, [resetIntermVar, resetTimeoutTriggered]);

  useEffect(() => {
    if (testResetTriggered) {
      const topContainerCurrent = topContainerRef.current;
      if (topContainerCurrent) {
        const notNullCurrentRef = topContainerCurrent;
        notNullCurrentRef.style.top = "0px";
      }
    }
  }, [testResetTriggered]);

  const databaseDateChecker = (dateToCheck: string) => {
    // end date & start date formatted mm/dd/yyyy
    if (typeof dateToCheck !== "string") {
      return false;
    }
    const splitInput = dateToCheck.split("/");
    if (splitInput.length !== 3) {
      return false;
    }

    // check for invalid inputs

    const datesYear = splitInput[2];
    const datesMonth = splitInput[0];
    const datesDay = splitInput[1];

    // Year Check
    if (datesYear.length !== 4) {
      return false;
    }

    if (typeof +datesYear !== "number" || +datesYear < 0) {
      return false;
    }
    // Month Check

    if (datesMonth.length > 2 || datesMonth.length === 0) {
      return false;
    }

    if (
      typeof +datesMonth !== "number" ||
      +datesMonth < 0 ||
      +datesMonth > 12
    ) {
      return false;
    }

    // Day Check
    if (datesDay.length > 2 || datesDay.length === 0) {
      return false;
    }
    if (typeof +datesDay !== "number" || +datesDay < 0 || +datesDay > 32) {
      return false;
    }

    return true;
  };

  const userInputDateChecker = (userInputToCheck: any) => {
    // date formatted into yyyy-mm-dd

    if (typeof userInputToCheck !== "string") {
      return false;
    }
    const splitInput = userInputToCheck.split("-");
    if (splitInput.length !== 3) {
      return false;
    }

    // check for invalid inputs

    const datesYear = splitInput[0];
    const datesMonth = splitInput[1];
    const datesDay = splitInput[2];

    // Year Check
    if (datesYear.length !== 4) {
      return false;
    }

    if (typeof +datesYear !== "number" || +datesYear < 0) {
      return false;
    }

    // Month Check
    if (datesMonth.length !== 2) {
      return false;
    }

    if (
      typeof +datesMonth !== "number" ||
      +datesMonth < 0 ||
      +datesMonth > 12
    ) {
      return false;
    }
    // Day Check
    if (typeof +datesDay !== "number" || +datesDay < 0 || +datesDay > 32) {
      return false;
    }

    return true;
  };

  const dateWithinBoundary = (dateToCheck: string) => {
    const userEnteredValidDate = userInputDateChecker(dateToCheck);

    const endDateIsValid = databaseDateChecker(endDate);
    const startDateIsValid = databaseDateChecker(startDate);

    if (userEnteredValidDate && endDateIsValid && startDateIsValid) {
      // users date formatted into yyyy-mm-dd
      // end date& start date formatted mm/dd/yyyy
      const splitStartDate = startDate.split("/");
      const splitEndDate = endDate.split("/");
      const splitDateToCheck = dateToCheck.split("-");

      const startDateObject = {
        day: +splitStartDate[1],
        month: +splitStartDate[0],
        year: +splitStartDate[2],
      };

      const endDateObject = {
        day: +splitEndDate[1],
        month: +splitEndDate[0],
        year: +splitEndDate[2],
      };

      const dateToCheckObject = {
        day: +splitDateToCheck[2],
        month: +splitDateToCheck[1],
        year: +splitDateToCheck[0],
      };

      // Step 1. Check Year

      if (
        dateToCheckObject.year >= startDateObject.year &&
        dateToCheckObject.year <= endDateObject.year
      ) {
        // Step 2. Month Check
        if (dateToCheckObject.year === startDateObject.year) {
          if (dateToCheckObject.month < startDateObject.month) {
            return false;
            // else if check if the users days comes before the start day
          } else if (
            dateToCheckObject.month === startDateObject.month &&
            dateToCheckObject.day < startDateObject.day
          ) {
            return false;
          }
        }

        if (dateToCheckObject.year === startDateObject.year) {
          if (dateToCheckObject.month > endDateObject.month) {
            return false;
          }
          // else if check if users day comes after the end day
          else if (
            dateToCheckObject.month === endDateObject.month &&
            dateToCheckObject.day > endDateObject.day
          ) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }

      // Step 3. If Months are the Same Check Year
    } else {
      return false;
    }
  };

  const enterPressHandler = (
    event: KeyboardEvent<HTMLInputElement>,
    inputValue: string,
    dispatch: any,
    userLivesArray: boolean[]
  ) => {
    const keyCode = event.key;

    if (inputValue) {
      // const regexPattern = new RegExp(pattern);
      const validDate = userInputDateChecker(inputValue);

      if (validDate && keyCode === "Enter") {
        const answerIsWithinBoundary = dateWithinBoundary(inputValue);
        if (keyCode === "Enter" && answerIsWithinBoundary) {
          return { enterPressed: true, patternMet: true };
        } else if (!answerIsWithinBoundary && keyCode === "Enter") {
          decreaseLivesTracker(dispatch, userLivesArray);
          return { enterPressed: false, patternMet: false };
        }
      } else if (keyCode !== "Enter" && validDate) {
        return { enterPressed: false, patternMet: true };
      }
    }
  };

  const keyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const inputValue = dateInputRef?.current?.value;

    if (inputValue) {
      const valueCorrect = enterPressHandler(
        event,
        inputValue,
        dispatch,
        userLivesArray
      );

      if (valueCorrect?.patternMet && valueCorrect?.enterPressed) {
        updateUserAnswers(
          dispatch,
          userAnswersArray,
          questionNumber,
          inputValue
        );
        setQuestionAnsweredCorrectly(true);

        dispatch(formStoreActions.setFireShipWeapons(true));
        if (submitMessageActive) {
          setSubmitMessageActive(false);
        }
        errorMessage.length !== 0 && setErrorMessage("");
      } else if (!valueCorrect?.enterPressed && valueCorrect?.patternMet) {
        if (!submitMessageActive) {
          setSubmitMessageActive(true);
        }
      } else if (!valueCorrect?.enterPressed && !valueCorrect?.patternMet) {
        if (submitMessageActive) {
          setSubmitMessageActive(false);
        }
        setErrorMessage("Please Enter A Valid Date");
      }
    }
  };

  return (
    <div
      className={`${sharedClasses.topContainer} ${
        astroidExplosionTriggered && sharedClasses.hideQuestion
      }`}
      ref={topContainerRef}
      id={questionId}
    >
      {astroidExplosionTriggered && <AstroidExplosion />}

      {!astroidExplosionTriggered && <AstroidImage />}
      {submitMessageActive && !astroidExplosionTriggered && (
        <PressEnterMessage />
      )}

      <div
        className={`${sharedClasses.questionContainer} ${
          astroidExplosionTriggered && sharedClasses.hideQuestion
        } ${questionAnsweredCorrectly && sharedClasses.hideQuestion}`}
      >
        <label className={sharedClasses.questionLabel} htmlFor={"date-id"}>
          Question {questionNumber}.
        </label>
        <p className={classes.dateQuestion}>{dateQuestion}</p>
        <input
          type="date"
          className={classes.dateInput}
          id="date-id"
          ref={dateInputRef}
          onKeyUp={keyUpHandler}
        />
      </div>

      {errorMessage.length !== 0 && (
        <p className={sharedClasses.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};
export default GeneratedDate;
