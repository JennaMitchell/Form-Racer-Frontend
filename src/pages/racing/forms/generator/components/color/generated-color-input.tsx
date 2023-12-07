import classes from "./generated-color-input.module.css";
import sharedClasses from "../components-shared-css.module.css";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../../../../store/typescript-hooks";
import { formStoreActions } from "../../../../../../store/form-store";
import { decreaseLivesTracker } from "../../../../lives-tracker/lives-tracker-functions";
import { updateActiveQuestionNumber } from "../shared-components-functions";
import AstroidExplosion from "../../../../../../components/animations/astroid-explosion/astroid-explosion";
import { hexColorToArrayConverter } from "../../../../../../assets/sql-api-calls/sql-data-refactors/color-data-refactor";
import { updateUserAnswers } from "../shared-components-functions";
import AstroidImage from "../astroid-image/astroid-image";
import {
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  useMemo,
  useCallback,
} from "react";

type Props = {
  circleColorOneHexCode: string;
  circleColorTwoHexCode: string;
  resultColorLowerEnd: { r: string; g: string; b: string };
  resultColorHigherEnd: { r: string; g: string; b: string };
  questionNumber: number;
  totalNumberOfQuestions: number;
  questionId: string;
};
const GeneratedColorInput = ({
  circleColorOneHexCode,
  circleColorTwoHexCode,
  resultColorLowerEnd,
  resultColorHigherEnd,
  questionNumber,
  totalNumberOfQuestions,
  questionId,
}: Props): JSX.Element => {
  const topContainerRef = useRef<null | HTMLDivElement>(null);
  const colorInputRef = useRef<null | HTMLInputElement>(null);
  const [userSelectedColor, setUserSelectedColor] = useState<string>("#008000");
  const [resetIntermVar, setResetIntermVar] = useState(false);
  // resetIntermVar is to allow the astroid to re-render at the top of the page then trigger the move animation

  const [resetTimeoutTriggered, setResetTimeoutTriggered] = useState(false);
  // resetTImeout is here so that the reset timeout only triggers once giving time for the astroid to move back to the top before
  // refreshing
  // issue arising when the moving backend can refrest trigger when

  const [questionAnsweredCorrectly, setQuestionAnsweredCorrectly] =
    useState(false);

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
    // userSelectedColor - #rrggbb;

    const convertedColor = hexColorToArrayConverter(userSelectedColor);
    //converting to base ten for comparison
    const reformatedUserColors = {
      r: convertedColor[0],
      g: convertedColor[1],
      b: convertedColor[2],
    };

    if (
      reformatedUserColors.r < +resultColorLowerEnd.r ||
      reformatedUserColors.g < +resultColorLowerEnd.g ||
      reformatedUserColors.b < +resultColorLowerEnd.b
    ) {
      decreaseLivesTracker(dispatch, userLivesArray);

      if (reformatedUserColors.r < +resultColorLowerEnd.r) {
        setErrorMessage("Add more Red");
      } else if (reformatedUserColors.g < +resultColorLowerEnd.g) {
        setErrorMessage("Add More Green");
      } else {
        setErrorMessage("Add more Blue");
      }
    } else if (
      reformatedUserColors.r > +resultColorHigherEnd.r ||
      reformatedUserColors.g > +resultColorHigherEnd.g ||
      reformatedUserColors.b > +resultColorHigherEnd.b
    ) {
      decreaseLivesTracker(dispatch, userLivesArray);
      if (reformatedUserColors.r > +resultColorLowerEnd.r) {
        setErrorMessage("Add Less Red");
      } else if (reformatedUserColors.g > +resultColorLowerEnd.g) {
        setErrorMessage("Add Less Green");
      } else {
        setErrorMessage("Add Less Blue");
      }
    } else {
      dispatch(formStoreActions.setFireShipWeapons(true));
      setQuestionAnsweredCorrectly(true);
      // see the ship fire file to see how the astroid collison works
      updateUserAnswers(
        dispatch,
        userAnswersArray,
        questionNumber,
        JSON.stringify(reformatedUserColors)
      );
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

  const colorInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const currentColorInputRef = colorInputRef.current;
    if (currentColorInputRef) {
      setUserSelectedColor(event?.target.value);
    }
  };

  return (
    <div
      className={`${sharedClasses.topContainer} ${
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
        <label className={sharedClasses.questionLabel}>
          Question {questionNumber}.
        </label>

        <div className={classes.questionColorWindow}>
          <div
            className={classes.questionColorCircleOne}
            style={{ backgroundColor: circleColorOneHexCode }}
          />
          <p className={classes.questionPlusIcon}>+</p>
          <div
            className={classes.questionColorCircleTwo}
            style={{ backgroundColor: circleColorTwoHexCode }}
          />
        </div>

        <div className={classes.colorInputContainer}>
          <input
            type="color"
            id="result-color"
            name="color-hexCode-"
            value={`${userSelectedColor}`}
            className={classes.colorInput}
            onChange={colorInputChangeHandler}
            ref={colorInputRef}
          />
          <label htmlFor="result-color" className={classes.colorInputLabel}>
            Result
          </label>
        </div>
        <button
          className={sharedClasses.submitButton}
          onClick={submitButtonClickHandler}
        >
          Submit
        </button>
      </div>

      {errorMessage.length !== 0 && (
        <p className={sharedClasses.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};
export default GeneratedColorInput;
