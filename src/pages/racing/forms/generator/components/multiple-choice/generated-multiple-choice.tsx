import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import classes from "./generated-multiple-choice.module.css";
import sharedClasses from "../components-shared-css.module.css";
import { lowerCaseLettersForMultipleChoiceArray } from "../../../../../../assets/constants/constants";
import { MouseEvent } from "react";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../../store/typescript-hooks";
import { updateUserAnswers } from "../shared-components-functions";
import { decreaseLivesTracker } from "../../../../lives-tracker/lives-tracker-functions";
import { formStoreActions } from "../../../../../../store/form-store";
import { updateActiveQuestionNumber } from "../shared-components-functions";
import AstroidExplosion from "../../../../../../components/animations/astroid-explosion/astroid-explosion";
import AstroidImage from "../astroid-image/astroid-image";
import { CheckIcon } from "@heroicons/react/24/solid";
type Props = {
  questionId: string;
  possibleAnswersArray: string[];
  questionNumber: number;
  totalNumberOfQuestions: number;
  correctAnswerIndex: number;
  questionText: string;
};

const GeneratedMultipleChoice = ({
  questionId,
  possibleAnswersArray,
  questionNumber,
  totalNumberOfQuestions,
  correctAnswerIndex,
  questionText,
}: Props): JSX.Element => {
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState<number>();
  const topContainerRef = useRef<null | HTMLDivElement>(null);
  const [questionAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    useState(false);
  const [resetIntermVar, setResetIntermVar] = useState(false);
  // resetIntermVar is to allow the astroid to re-render at the top of the page then trigger the move animation

  const [resetTimeoutTriggered, setResetTimeoutTriggered] = useState(false);
  // resetTimeout is here so that the reset timeout only triggers once giving time for the astroid to move back to the top before
  // refreshing

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
    setTriggerAnimation(true);
    dispatch(formStoreActions.setStartQuestionTimer(true));
  }, [dispatch]);

  // useEffect used to trigger the astroid to move
  useEffect(() => {
    if (triggerAnimation) {
      setTriggerAnimation(false);
      questionTimerHandler();
    }
  }, [triggerAnimation, dispatch, questionTimerHandler]);

  const submitButtonClickHandler = () => {
    if (clickedQuestionIndex === correctAnswerIndex) {
      updateUserAnswers(
        dispatch,
        userAnswersArray,
        questionNumber,
        clickedQuestionIndex
      );
      dispatch(formStoreActions.setFireShipWeapons(true));
      errorMessage.length !== 0 && setErrorMessage("");
      setClickedQuestionIndex(-1);
      setQuestionAnsweredCorrectly(true);
    } else {
      decreaseLivesTracker(dispatch, userLivesArray);
      setErrorMessage("Incorrect Please Try Again");
    }
  };

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

  // handeling test resting

  useEffect(() => {
    if (testResetTriggered) {
      const topContainerCurrent = topContainerRef.current;
      if (topContainerCurrent) {
        const notNullCurrentRef = topContainerCurrent;
        notNullCurrentRef.style.top = "0px";
      }
    }
  }, [testResetTriggered]);

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

  // useEffect below is used to initalize the astroid to move on the first render
  useEffect(() => {
    const topContainerCurrent = topContainerRef.current;

    if (topContainerCurrent) {
      const notNullCurrentRef = topContainerCurrent;
      // moving next question to the top of the viewport and transition none so its instantaneous
      notNullCurrentRef.style.top = "0px";
      notNullCurrentRef.style.transition = `none`;
    }
    setTimeout(
      () => {
        setTriggerAnimation(true);
        dispatch(formStoreActions.setStartQuestionTimer(true));
      },

      100
    );
  }, [dispatch, questionTimerHandler]);
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
  }, [triggerAnimation, questionTimerHandler]);
  const radioButtonClickHandler = (e: MouseEvent<HTMLElement>) => {
    let targetElement = e.target as HTMLElement;
    let targetId = targetElement.id;
    if (targetElement.id.length === 0) {
      targetElement = targetElement.parentElement as HTMLElement;
      targetId = targetElement.id;
    }

    if (targetId) {
      const splitId = targetId.split("-");
      const extractedSelectedQuestionLetter = splitId[splitId.length - 1];
      if (
        lowerCaseLettersForMultipleChoiceArray.includes(
          extractedSelectedQuestionLetter
        )
      ) {
        const indexOfLetter = lowerCaseLettersForMultipleChoiceArray.indexOf(
          extractedSelectedQuestionLetter
        );
        setClickedQuestionIndex(indexOfLetter);
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
      {errorMessage.length !== 0 && (
        <p className={sharedClasses.errorMessage}>{errorMessage}</p>
      )}
      <div
        className={`${sharedClasses.questionContainer} ${
          astroidExplosionTriggered && sharedClasses.hideQuestion
        } ${questionAnsweredCorrectly && sharedClasses.hideQuestion}`}
        id={classes.questionId}
      >
        <span className={sharedClasses.questionLabel}>
          Question {questionNumber}.
        </span>
        <p className={classes.questionText}>{questionText}</p>
        {possibleAnswersArray.length !== 0 &&
          possibleAnswersArray.map((answer: string, index: number) => {
            return (
              <div
                className={`${classes.multipleChoiceAnswerContainer} ${
                  clickedQuestionIndex === index &&
                  classes.activeMultipleChoiceAnswerContainer
                }`}
                onClick={radioButtonClickHandler}
                id={`${questionId}-main-container-${lowerCaseLettersForMultipleChoiceArray[index]}`}
                key={`${questionId}-main-container-${lowerCaseLettersForMultipleChoiceArray[index]}-key`}
              >
                <button
                  className={classes.multipleChoiceRadioButton}
                  id={`${questionId}-choice-${lowerCaseLettersForMultipleChoiceArray[index]}`}
                >
                  {clickedQuestionIndex === index && (
                    <CheckIcon className={classes.checkMarkIcon} />
                  )}
                </button>
                <label
                  className={classes.multipleChoiceRadioButtonLabel}
                  htmlFor={`${questionId}-choice-${lowerCaseLettersForMultipleChoiceArray[index]}`}
                  onClick={radioButtonClickHandler}
                >
                  {lowerCaseLettersForMultipleChoiceArray[index]}.
                </label>
                <p className={classes.multipleChoiceAnswerText}>{answer}</p>
              </div>
            );
          })}
        <button
          className={sharedClasses.submitButton}
          onClick={submitButtonClickHandler}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default GeneratedMultipleChoice;
