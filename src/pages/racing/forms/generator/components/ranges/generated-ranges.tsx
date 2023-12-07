import {
  ChangeEvent,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { formStoreActions } from "../../../../../../store/form-store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../store/typescript-hooks";
import { updateActiveQuestionNumber } from "../shared-components-functions";
import classes from "./generated-ranges.module.css";
import AstroidImage from "../astroid-image/astroid-image";
import AstroidExplosion from "../../../../../../components/animations/astroid-explosion/astroid-explosion";
import sharedClasses from "../components-shared-css.module.css";
import { updateUserAnswers } from "../shared-components-functions";
import { decreaseLivesTracker } from "../../../../lives-tracker/lives-tracker-functions";
type Props = {
  questionNumber: number;
  questionText: string;
  slideMin: number;
  slideMax: number;
  totalNumberOfQuestions: number;
  questionId: string;
  questionTextMinValue: number;
  questionTextMaxValue: number;
};
const GeneratedRangeInput = ({
  questionNumber,
  questionText,
  slideMin,
  slideMax,
  totalNumberOfQuestions,
  questionId,
  questionTextMinValue,
  questionTextMaxValue,
}: Props): JSX.Element => {
  const [sliderValue, setSliderValue] = useState("1");
  const topContainerRef = useRef<null | HTMLDivElement>(null);

  const [resetIntermVar, setResetIntermVar] = useState(false);
  // resetIntermVar is to allow the astroid to re-render at the top of the page then trigger the move animation

  const [resetTimeoutTriggered, setResetTimeoutTriggered] = useState(false);
  // resetTImeout is here so that the reset timeout only triggers once giving time for the astroid to move back to the top before
  // refreshing
  // issue arising when the moving backend can refrest trigger when

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

  const submitButtonClickHandler = () => {
    if (
      +sliderValue >= questionTextMinValue &&
      +sliderValue <= questionTextMaxValue
    ) {
      updateUserAnswers(
        dispatch,
        userAnswersArray,
        questionNumber,
        +sliderValue
      );
      dispatch(formStoreActions.setFireShipWeapons(true));
      errorMessage.length !== 0 && setErrorMessage("");
      setSliderValue("1");
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
          errorMessage.length !== 0 && setErrorMessage("");
        },

        100
      );

      setResetTimeoutTriggered(true);
    }
  }, [resetIntermVar, resetTimeoutTriggered, errorMessage]);

  useEffect(() => {
    if (testResetTriggered) {
      const topContainerCurrent = topContainerRef.current;
      if (topContainerCurrent) {
        const notNullCurrentRef = topContainerCurrent;
        notNullCurrentRef.style.top = "0px";
      }
    }
  }, [testResetTriggered]);

  const sliderInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const targetValue = event?.target.value;

    if (targetValue) {
      setSliderValue(targetValue);
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
      >
        <label
          className={sharedClasses.questionLabel}
          htmlFor={`${questionNumber}-range-input`}
        >
          Question {questionNumber}.
        </label>

        <p className={classes.questionText}>{questionText}</p>
        <div className={classes.rangeInputContainer}>
          <input
            className={classes.rangeInput}
            type="range"
            id={`${questionNumber}-range-input`}
            min={slideMin}
            max={slideMax}
            onChange={sliderInputChangeHandler}
            defaultValue={"1"}
          />
          <p className={classes.rangInputValue}>{sliderValue}</p>
        </div>
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
export default GeneratedRangeInput;
