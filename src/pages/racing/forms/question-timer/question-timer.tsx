import { useEffect, useState, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../store/typescript-hooks";
import classes from "./question-timer.module.css";
import { decreaseLivesTracker } from "../../lives-tracker/lives-tracker-functions";
import { formStoreActions } from "../../../../store/form-store";
const QuestionTimerWindow = (): JSX.Element => {
  const gameSettings = useAppSelector((state) => state.userInfo.gameSettings);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(
    gameSettings.timePerQuestionInSeconds
  );
  const astroidDestroyed = useAppSelector(
    (state) => state.formRacing.astroidDestroyed
  );
  const generatedQuestionData = useAppSelector(
    (state) => state.formRacing.generatedQuestionData
  );
  const astroidExplosionTriggered = useAppSelector(
    (state) => state.formRacing.astroidExplosionTriggered
  );
  const startQuestionTimer = useAppSelector(
    (state) => state.formRacing.startQuestionTimer
  );
  const dispatch = useAppDispatch();
  const activeLivesArray = useAppSelector(
    (state) => state.formRacing.activeLifesArray
  );
  const activeQuestionNumber = useAppSelector(
    (state) => state.formRacing.activeQuestionNumber
  );
  const userAnswersArray = useAppSelector(
    (state) => state.formRacing.userAnswersArray
  );
  const endOfTestReached = useAppSelector(
    (state) => state.formRacing.endOfTestReached
  );

  // useEffect To update the question timer when it changes

  useEffect(() => {
    setQuestionTimeRemaining(gameSettings.timePerQuestionInSeconds);
  }, [gameSettings.timePerQuestionInSeconds]);

  const failedQuestionHandler = useCallback(() => {
    decreaseLivesTracker(dispatch, activeLivesArray);
    const newPossibleActiveQuestion = activeQuestionNumber + 1;

    if (userAnswersArray.length <= newPossibleActiveQuestion) {
      dispatch(formStoreActions.setEndOfTestReached(true));
      dispatch(formStoreActions.setStartQuestionTimer(false));
    }
    dispatch(formStoreActions.setStartQuestionTimer(false));

    dispatch(
      formStoreActions.setActiveQuestionNumber(activeQuestionNumber + 1)
    );
    dispatch(formStoreActions.setActiveQuestionNumberUpdated(true));
  }, [
    activeLivesArray,
    activeQuestionNumber,
    dispatch,
    userAnswersArray.length,
  ]);

  useEffect(() => {
    if (startQuestionTimer) {
      const timeOutTimerUpdate = setTimeout(() => {
        const newQuestionTime = questionTimeRemaining - 1;

        if (newQuestionTime === 0) {
          failedQuestionHandler();
          setQuestionTimeRemaining(gameSettings.timePerQuestionInSeconds);
        } else {
          setQuestionTimeRemaining(questionTimeRemaining - 1);
        }
      }, 1000);

      return () => {
        clearTimeout(timeOutTimerUpdate);
      };
    }
  }, [
    questionTimeRemaining,
    startQuestionTimer,
    failedQuestionHandler,
    gameSettings.timePerQuestionInSeconds,
  ]);

  useEffect(() => {
    if (astroidDestroyed && astroidExplosionTriggered) {
      setQuestionTimeRemaining(gameSettings.timePerQuestionInSeconds);
    }
  }, [
    astroidDestroyed,
    dispatch,
    activeQuestionNumber,
    generatedQuestionData,
    astroidExplosionTriggered,
    gameSettings,
  ]);

  useEffect(() => {
    if (endOfTestReached) {
      setQuestionTimeRemaining(gameSettings.timePerQuestionInSeconds);
    }
  }, [endOfTestReached, gameSettings.timePerQuestionInSeconds]);

  return (
    <div
      className={`${classes.questionTimerTopContainer}  ${
        questionTimeRemaining <= 20 &&
        questionTimeRemaining > 10 &&
        classes.questionTimeCautionContainer
      } ${
        questionTimeRemaining <= 10 &&
        questionTimeRemaining !== 0 &&
        classes.questionTimeWarningContainer
      }`}
    >
      <p className={`${classes.questionTime}`}>
        {startQuestionTimer ? questionTimeRemaining : 0}s
      </p>
      <p className={classes.questionTimerLabel}>Question Timer</p>
    </div>
  );
};
export default QuestionTimerWindow;
