import {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { MouseEvent, KeyboardEvent } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../store/typescript-hooks";

import classes from "./generated-input.module.css";
import sharedClasses from "../components-shared-css.module.css";
import { decreaseLivesTracker } from "../../../../lives-tracker/lives-tracker-functions";

import {
  updateUserAnswers,
  updateActiveQuestionNumber,
} from "../shared-components-functions";
import PressEnterMessage from "../press-enter-message/press-enter-message";
import AstroidImage from "../astroid-image/astroid-image";
import { formStoreActions } from "../../../../../../store/form-store";
import AstroidExplosion from "../../../../../../components/animations/astroid-explosion/astroid-explosion";

type Props = {
  label: string;
  id: string;
  inputProps: InputProps;
  questionText: string;
  questionNumber: number;
  totalNumberOfQuestions: number;
};

type InputProps = {
  name: string;
  type: string;
  placeholder: string;
  pattern: string;
  required: boolean;
  min: number;
  max: number;
};

const GeneratedInput = ({
  label,
  id,
  inputProps,
  questionText,
  questionNumber,
  totalNumberOfQuestions,
}: Props): JSX.Element => {
  const inputRef = useRef<null | HTMLInputElement>(null);
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
  const [questionAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    useState(false);

  const timePerQuestionInSeconds = useMemo(() => {
    return gameSettings.timePerQuestionInSeconds;
  }, [gameSettings.timePerQuestionInSeconds]);

  const topContainerRef = useRef<null | HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const [errorMessageActive, setErrorMessageActive] = useState(false);
  const [submitMessageActive, setSubmitMessageActive] = useState(false);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  const [resetIntermVar, setResetIntermVar] = useState(false);
  // resetIntermVar is to allow the astroid to re-render at the top of the page then trigger the move animation

  const [resetTimeoutTriggered, setResetTimeoutTriggered] = useState(false);
  // resetTimeout is here so that the reset timeout only triggers once giving time for the astroid to move back to the top before
  // refreshing

  const astroidExplosionTriggered = useAppSelector(
    (state) => state.formRacing.astroidExplosionTriggered
  );
  const testResetTriggered = useAppSelector(
    (state) => state.formRacing.testResetTriggered
  );

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
  useEffect(() => {
    if (triggerAnimation) {
      setTriggerAnimation(false);
      questionTimerHandler();
    }
  }, [triggerAnimation, dispatch, questionTimerHandler]);

  const enterPressHandler = (
    event: KeyboardEvent<HTMLInputElement>,
    inputValue: string,
    pattern: string,
    dispatch: any,
    userLivesArray: boolean[]
  ) => {
    const keyCode = event.key;

    if (inputValue) {
      const regexPattern = new RegExp(pattern);
      const patternMet = regexPattern.test(inputValue);

      if (keyCode === "Enter" && patternMet) {
        return { enterPressed: true, patternMet: true };
      } else if (!patternMet && keyCode === "Enter") {
        decreaseLivesTracker(dispatch, userLivesArray);
        return { enterPressed: false, patternMet: false };
      } else if (keyCode !== "Enter" && patternMet) {
        return { enterPressed: false, patternMet: true };
      }
    }
  };

  // Handeling User Inputs

  const usernameInputClickElementsHandler = (
    event: MouseEvent<HTMLElement>
  ) => {
    const targetElement = event.currentTarget;
    const currentInputRef = inputRef.current;

    if (currentInputRef) {
      const inputRefNotNull = currentInputRef;
      if (targetElement.id.length === 0) {
        inputRefNotNull.focus();
      }
    }
  };
  const blurErrorHandler = () => {
    const currentInputRef = inputRef.current;

    if (currentInputRef) {
      const inputRefNotNull = currentInputRef;
      const regToTest = new RegExp(`${inputProps.pattern}`);
      const inputValue = inputRefNotNull.value;

      setErrorMessageActive(!regToTest.test(inputValue));
    }
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const targetElement = e.target;

    if (targetElement) {
      const notNullTargetElement = targetElement as HTMLInputElement;

      const regexPattern = new RegExp(inputProps.pattern);

      const patternMet = regexPattern.test(notNullTargetElement.value);

      if (!patternMet && submitMessageActive) {
        setSubmitMessageActive(false);
      }
    }
  };

  const keyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    const inputValue = inputRef?.current?.value;

    if (inputValue) {
      const valueCorrect = enterPressHandler(
        event,
        inputValue,
        inputProps.pattern,
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
      } else if (!valueCorrect?.enterPressed && valueCorrect?.patternMet) {
        if (!submitMessageActive) {
          setSubmitMessageActive(true);
        }
      } else if (!valueCorrect?.enterPressed && !valueCorrect?.patternMet) {
        if (submitMessageActive) {
          setSubmitMessageActive(false);
        }
      }
    }
  };

  useEffect(() => {
    if (astroidDestroyed) {
      setTimeout(() => {
        updateActiveQuestionNumber(
          dispatch,
          questionNumber,
          totalNumberOfQuestions
        );
        dispatch(formStoreActions.setAstroidDestroyed(false));
      }, 5000);
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
    >
      {astroidExplosionTriggered && <AstroidExplosion />}
      {submitMessageActive && !astroidExplosionTriggered && (
        <PressEnterMessage />
      )}
      {!astroidExplosionTriggered && <AstroidImage />}

      <div
        className={`${sharedClasses.questionContainer} ${
          astroidExplosionTriggered && sharedClasses.hideQuestion
        } ${questionAnsweredCorrectly && sharedClasses.hideQuestion}`}
      >
        <p className={sharedClasses.questionLabel}>
          Question {questionNumber}.
        </p>

        <p className={classes.generatedInputQuestion}>{questionText}</p>

        <div className={classes.generatedInputContainer}>
          <label
            className={`${classes.inputLabel} `}
            htmlFor={id}
            onClick={usernameInputClickElementsHandler}
            key={`${id}-${label}-label-key`}
          >
            {label}
          </label>
          <input
            className={classes.generatedInput}
            id={id}
            maxLength={inputProps.max}
            ref={inputRef}
            onClick={usernameInputClickElementsHandler}
            onBlur={blurErrorHandler}
            key={`${id}-${label}-input-key`}
            min={inputProps.min}
            max={inputProps.max}
            type={inputProps.type}
            onChange={inputChangeHandler}
            onKeyUp={keyUpHandler}
          />
        </div>
        {errorMessageActive && (
          <span
            className={sharedClasses.errorMessage}
            key={`${id}-${label}-span-key`}
          >
            Incorrect Answer
          </span>
        )}
      </div>
    </div>
  );
};
export default GeneratedInput;
