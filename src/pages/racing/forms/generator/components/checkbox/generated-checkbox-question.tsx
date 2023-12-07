import {
  ChangeEvent,
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import classes from "./generated-checkbox-question.module.css";
import sharedClasses from "../components-shared-css.module.css";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../../store/typescript-hooks";
import { lowerCaseLettersForMultipleChoiceArray } from "../../../../../../assets/constants/constants";

import AstroidImage from "../astroid-image/astroid-image";
import { formStoreActions } from "../../../../../../store/form-store";
import { updateActiveQuestionNumber } from "../shared-components-functions";

import { decreaseLivesTracker } from "../../../../lives-tracker/lives-tracker-functions";
import { updateUserAnswers } from "../shared-components-functions";
import AstroidExplosion from "../../../../../../components/animations/astroid-explosion/astroid-explosion";
type Props = {
  questionNumber: number;
  questionText: string;
  possibleAnswersArray: string[];
  totalNumberOfQuestions: number;
  correctCheckBoxOptions: string[];
  questionId: string;
};
const GeneratedCheckboxQuestion = ({
  questionNumber,
  questionText,
  possibleAnswersArray,
  totalNumberOfQuestions,
  correctCheckBoxOptions,
  questionId,
}: Props): JSX.Element => {
  const topContainerRef = useRef<null | HTMLDivElement>(null);

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
  const [questionAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    useState(false);

  const timePerQuestionInSeconds = useMemo(() => {
    return gameSettings.timePerQuestionInSeconds;
  }, [gameSettings.timePerQuestionInSeconds]);

  const dispatch = useAppDispatch();

  const [errorMessage, setErrorMessage] = useState("");

  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const [clickedCheckedBoxArray, setClickedCheckedBoxArray] = useState<
    number[]
  >([]);
  const [resetIntermVar, setResetIntermVar] = useState(false);
  // resetIntermVar is to allow the astroid to re-render at the top of the page then trigger the move animation

  const [resetTimeoutTriggered, setResetTimeoutTriggered] = useState(false);
  // resetTImeout is here so that the reset timeout only triggers once giving time for the astroid to move back to the top before
  // refreshing
  // issue arising when the moving backend can refrest trigger when

  // Handeling question Timer
  const questionTimerHandler = useCallback(() => {
    const topContainerRefCurrent = topContainerRef?.current;
    if (topContainerRefCurrent) {
      const topContainerDivElement = topContainerRefCurrent;

      topContainerDivElement.style.transition = `all ${timePerQuestionInSeconds}s ease-in`;
      topContainerDivElement.style.top = `calc(100vh - 450px)`;
    }
    dispatch(formStoreActions.setStartQuestionTimer(true));
  }, [timePerQuestionInSeconds, dispatch]);

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

  // useEffect used to trigger the astroid to move
  useEffect(() => {
    if (triggerAnimation) {
      setTriggerAnimation(false);
      questionTimerHandler();
    }
  }, [triggerAnimation, dispatch, questionTimerHandler]);

  const submitButtonClickHandler = () => {
    if (clickedCheckedBoxArray.length === 0) {
      decreaseLivesTracker(dispatch, userLivesArray);
      setErrorMessage("Check a box before submitting");
    } else {
      const indexOfCorrectVariables = [];
      for (
        let indexOfCorrectEntrys = 0;
        indexOfCorrectEntrys < correctCheckBoxOptions.length;
        indexOfCorrectEntrys++
      ) {
        if (correctCheckBoxOptions[indexOfCorrectEntrys]) {
          indexOfCorrectVariables.push(indexOfCorrectEntrys);
        }
      }
      clickedCheckedBoxArray.sort();
      if (clickedCheckedBoxArray.length !== indexOfCorrectVariables.length) {
        decreaseLivesTracker(dispatch, userLivesArray);
        setErrorMessage("Incorrect Try Again");
      } else {
        let numberOfCorrectResponse = 0;
        for (
          let indexToCompare = 0;
          indexToCompare < clickedCheckedBoxArray.length;
          indexToCompare++
        ) {
          if (
            clickedCheckedBoxArray[indexToCompare] ===
            indexOfCorrectVariables[indexToCompare]
          ) {
            numberOfCorrectResponse++;
          } else {
            break;
          }
        }
        if (numberOfCorrectResponse === indexOfCorrectVariables.length) {
          dispatch(formStoreActions.setFireShipWeapons(true));
          updateUserAnswers(dispatch, userAnswersArray, questionNumber, true);
          setClickedCheckedBoxArray([]);
          errorMessage.length !== 0 && setErrorMessage("");
          setQuestionAnsweredCorrectly(true);
        } else {
          decreaseLivesTracker(dispatch, userLivesArray);
          setErrorMessage("Incorrect Try Again");
        }
      }
    }
  };

  const checkBoxChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event?.target.checked;
    const checkBoxName = event?.target.name;
    if (checkBoxName) {
      const splitName = checkBoxName.split("-");
      const textIndex = +splitName[splitName.length - 1];

      if (checked) {
        setClickedCheckedBoxArray([...clickedCheckedBoxArray, textIndex]);
      } else {
        const indexOfIndexToRemove = clickedCheckedBoxArray.indexOf(textIndex);
        const copyOfClickedCheckedBoxArray = clickedCheckedBoxArray.slice();
        copyOfClickedCheckedBoxArray.splice(indexOfIndexToRemove, 1);
        setClickedCheckedBoxArray(copyOfClickedCheckedBoxArray);
      }
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

  return (
    <div
      className={`${sharedClasses.topContainer}  ${
        astroidExplosionTriggered && sharedClasses.hideQuestion
      } `}
      ref={topContainerRef}
      id={questionId}
    >
      {astroidExplosionTriggered && <AstroidExplosion />}

      {!astroidExplosionTriggered && <AstroidImage />}

      <div
        className={`${sharedClasses.questionContainer} ${
          astroidExplosionTriggered && sharedClasses.hideQuestion
        } ${questionAnsweredCorrectly && sharedClasses.hideQuestion}`}
      >
        <p className={sharedClasses.questionLabel}>
          Question {questionNumber}.
        </p>
        <p className={classes.generatedCheckBoxQuestion}>{questionText}</p>

        {possibleAnswersArray.length !== 0 &&
          possibleAnswersArray.map((optionText, index) => {
            return (
              <div
                className={classes.generatedCheckboxInputContainer}
                key={`question-${questionNumber}-index-${index}-key`}
              >
                <label
                  htmlFor={`question-${questionNumber}-index-${index}`}
                  className={classes.generatedCheckboxInputLabel}
                >
                  {lowerCaseLettersForMultipleChoiceArray[index]}.
                </label>
                <input
                  className={classes.checkBoxInput}
                  type="checkbox"
                  id={`question-${questionNumber}-index-${index}`}
                  onChange={checkBoxChangeHandler}
                  name={`question-${questionNumber}-index-${index}`}
                />
                <p className={classes.checkboxTextValue}>{optionText}</p>
              </div>
            );
          })}
        {errorMessage.length !== 0 && (
          <p className={sharedClasses.errorMessage}>{errorMessage}</p>
        )}
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
export default GeneratedCheckboxQuestion;
