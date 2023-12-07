import classes from "./game-setup-popup.module.css";
import sharedClasses from "../shared-popups-css.module.css";

import { useAppDispatch } from "../../../store/typescript-hooks";
import { popupsStoreActions } from "../../../store/popups-store";
// Black Icons
import BlackEasyDiffIcon from "../../../assets/images/icons/setup-popup/black-icons/black-easy-diff-icon.png";
import BlackMediumDiffIcon from "../../../assets/images/icons/setup-popup/black-icons/black-medium-diff-icon.png";
import BlackHardDiffIcon from "../../../assets/images/icons/setup-popup/black-icons/black-hard-diff-icon.png";
import BlackColorInputsIcon from "../../../assets/images/icons/setup-popup/black-icons/black-color-inputs.png";
import BlackCommentInputsIcon from "../../../assets/images/icons/setup-popup/black-icons/black-comment-inputs.png";
import BlackDateInputsIcon from "../../../assets/images/icons/setup-popup/black-icons/black-date-inputs.png";
import BlackPictureInputsIcon from "../../../assets/images/icons/setup-popup/black-icons/black-picture-inputs.png";
import BlackTextInputsIcon from "../../../assets/images/icons/setup-popup/black-icons/black-text-inputs.png";
import BlackMultipleChoiceIcon from "../../../assets/images/icons/setup-popup/black-icons/black-multiple-choice-icon.png";
//White Icons
import WhiteEasyDiffIcon from "../../../assets/images/icons/setup-popup/white-icons/white-easy-diff-icon.png";
import WhiteMediumDiffIcon from "../../../assets/images/icons/setup-popup/white-icons/white-medium-diff-icon.png";
import WhiteHardDiffIcon from "../../../assets/images/icons/setup-popup/white-icons/white-hard-diff-icon.png";
import WhiteColorInputsIcon from "../../../assets/images/icons/setup-popup/white-icons/white-color-inputs.png";
import WhiteCommentInputsIcon from "../../../assets/images/icons/setup-popup/white-icons/white-comment-inputs.png";
import WhiteDateInputsIcon from "../../../assets/images/icons/setup-popup/white-icons/white-date-inputs.png";
import WhitePictureInputsIcon from "../../../assets/images/icons/setup-popup/white-icons/white-picture-inputs.png";
import WhiteTextInputsIcon from "../../../assets/images/icons/setup-popup/white-icons/white-text-inputs.png";
import WhiteMultipleChoiceIcon from "../../../assets/images/icons/setup-popup/white-icons/white-multiple-choice-icon.png";

import { useState, MouseEvent, useMemo, useCallback, useEffect } from "react";
import { testResetFunction } from "../../../assets/test-functions/test-function";
import { formStoreActions } from "../../../store/form-store";
import { userInfoStoreActions } from "../../../store/user-info-store";
const GameSetupPopup = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const closingButtonHandler = () => {
    dispatch(popupsStoreActions.setLockViewportActive(false));
    dispatch(popupsStoreActions.setGameSetupActive(false));
  };
  const [gameSetupFormData, setGameSetupFormData] = useState<{
    difficulty: string;
    numberOfQuestions: number;
    selectedQuestionTypes: string[];
    timePerQuestionInSeconds: number;
  }>({
    difficulty: "",
    numberOfQuestions: 5,
    selectedQuestionTypes: [],
    timePerQuestionInSeconds: 30,
  });

  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const questionTypesButtonData = [
    {
      buttonName: "Multiple Choice",
      blackIcon: BlackMultipleChoiceIcon,
      whiteIcon: WhiteMultipleChoiceIcon,
      altText: "multiple choice input icon",
      id: "popup-input-type-button-multiple choice",
    },
    {
      buttonName: "Dates",
      blackIcon: BlackDateInputsIcon,
      whiteIcon: WhiteDateInputsIcon,
      altText: "dates input icon",
      id: "popup-input-type-button-dates",
    },
    {
      buttonName: "Inputs",
      blackIcon: BlackTextInputsIcon,
      whiteIcon: WhiteTextInputsIcon,
      altText: "text input icon",
      id: "popup-input-type-button-inputs",
    },
    {
      buttonName: "Color",
      blackIcon: BlackColorInputsIcon,
      whiteIcon: WhiteColorInputsIcon,
      altText: "color input icon",
      id: "popup-input-type-button-color",
    },
    {
      buttonName: "Slider",
      blackIcon: BlackCommentInputsIcon,
      whiteIcon: WhiteCommentInputsIcon,
      altText: "comments input icon",
      id: "popup-input-type-button-slider",
    },
    {
      buttonName: "Checkbox",
      blackIcon: BlackPictureInputsIcon,
      whiteIcon: WhitePictureInputsIcon,
      altText: "pictures input icon",
      id: "popup-input-type-button-checkbox",
    },
  ];
  const arrayOfAcceptedValues = useMemo(() => {
    return ["easy", "medium", "hard"];
  }, []);

  const diffucultyClickButtonHandler = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    let targetElement = event.target as HTMLButtonElement;

    let targetId = targetElement?.id;

    if (targetId.length === 0 && targetElement.parentElement) {
      targetElement = targetElement?.parentElement as HTMLButtonElement;
      targetId = targetElement?.id;
    }
    const splitId = targetId.split("-");

    const selectedDifficultyLevel = splitId[splitId.length - 1];
    let timePerQuestionInSeconds = 0;

    switch (selectedDifficultyLevel) {
      case "easy":
        timePerQuestionInSeconds = 30;
        break;
      case "medium":
        timePerQuestionInSeconds = 20;
        break;
      case "hard":
        timePerQuestionInSeconds = 15;
        break;
      default:
        break;
    }

    if (arrayOfAcceptedValues.includes(selectedDifficultyLevel)) {
      setGameSetupFormData({
        ...gameSetupFormData,
        difficulty: selectedDifficultyLevel,
        timePerQuestionInSeconds: timePerQuestionInSeconds,
      });
    }
  };

  const numberOfInputsClickButtonHandler = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    let targetElement = event.target as HTMLButtonElement;

    let targetId = targetElement?.id;

    const splitId = targetId.split("-");

    const selectedNumberOfQuestions = splitId[splitId.length - 1];
    const arrayOfAcceptedValues = ["5", "10", "20"];

    if (arrayOfAcceptedValues.includes(selectedNumberOfQuestions)) {
      setGameSetupFormData({
        ...gameSetupFormData,
        numberOfQuestions: +selectedNumberOfQuestions,
      });
    }
  };

  const questionTypeSelectionClickHandler = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    let targetElement = event.target as HTMLButtonElement;

    let targetId = targetElement?.id;

    if (targetId.length === 0 && targetElement.parentElement) {
      targetElement = targetElement?.parentElement as HTMLButtonElement;
      targetId = targetElement?.id;
    }
    const splitId = targetId.split("-");

    const selectedQuestionType = splitId[splitId.length - 1];

    const acceptedQuestionTypes = questionTypesButtonData.map((buttonData) => {
      return buttonData.buttonName.toLowerCase();
    });

    if (acceptedQuestionTypes.includes(selectedQuestionType)) {
      let copyOfSelectedQuestionTypes =
        gameSetupFormData.selectedQuestionTypes.slice();

      if (copyOfSelectedQuestionTypes.includes(selectedQuestionType)) {
        const indexOfSelectedType =
          copyOfSelectedQuestionTypes.indexOf(selectedQuestionType);
        copyOfSelectedQuestionTypes.splice(indexOfSelectedType, 1);
      } else {
        copyOfSelectedQuestionTypes.push(selectedQuestionType);
      }

      setGameSetupFormData({
        ...gameSetupFormData,
        selectedQuestionTypes: copyOfSelectedQuestionTypes,
      });
    }
  };

  const submitButtonValidation = useCallback(() => {
    const difficultyCheck = arrayOfAcceptedValues.includes(
      gameSetupFormData.difficulty
    );

    if (difficultyCheck) {
      const numberOfQuestionsCheck = gameSetupFormData.numberOfQuestions >= 1;
      if (numberOfQuestionsCheck) {
        const selectedQuestionsTypeCheck =
          gameSetupFormData.selectedQuestionTypes.length !== 0;
        if (selectedQuestionsTypeCheck) {
          setSubmitButtonActive(true);
        }
      }
    }
  }, [
    arrayOfAcceptedValues,
    gameSetupFormData.difficulty,
    gameSetupFormData.numberOfQuestions,
    gameSetupFormData.selectedQuestionTypes.length,
  ]);
  useEffect(() => {
    submitButtonValidation();
  }, [submitButtonValidation]);

  const startButtonHandler = () => {
    if (submitButtonActive) {
      dispatch(userInfoStoreActions.setGameSettings(gameSetupFormData));
      closingButtonHandler();
      testResetFunction(dispatch);

      dispatch(formStoreActions.setStartTest(true));
    }
  };

  return (
    <div className={sharedClasses.backdrop}>
      <div className={sharedClasses.popupMainContainer}>
        <button
          className={sharedClasses.closingPopupButton}
          onClick={closingButtonHandler}
        >
          X
        </button>
        <p className={sharedClasses.popupTitle}>Setup</p>

        <p className={classes.popupSectionTitle}>Difficulty</p>
        <button
          className={`${classes.popupDifficultyButton} ${
            gameSetupFormData.difficulty === "easy" &&
            classes.activeDifficultyButton
          }`}
          id={"popup-difficulty-button-easy"}
          onClick={diffucultyClickButtonHandler}
        >
          <img
            src={BlackEasyDiffIcon}
            alt="easy difficulty icon"
            className={`${classes.difficultyButtonIcon} ${classes.difficultyButtonBlackIcon}`}
          />
          <img
            src={WhiteEasyDiffIcon}
            alt="easy difficulty icon"
            className={`${classes.difficultyButtonIcon} ${classes.difficultyButtonWhiteIcon}`}
          />
          <p className={classes.popupButtonText}>Easy</p>
        </button>
        <button
          className={`${classes.popupDifficultyButton} ${
            gameSetupFormData.difficulty === "medium" &&
            classes.activeDifficultyButton
          }`}
          id={"popup-difficulty-button-medium"}
          onClick={diffucultyClickButtonHandler}
        >
          <img
            src={BlackMediumDiffIcon}
            alt="medium difficulty icon"
            className={`${classes.difficultyButtonIcon} ${classes.difficultyButtonBlackIcon}`}
          />
          <img
            src={WhiteMediumDiffIcon}
            alt="medium difficulty icon"
            className={`${classes.difficultyButtonIcon} ${classes.difficultyButtonWhiteIcon}`}
          />

          <p className={classes.popupButtonText}>Medium</p>
        </button>
        <button
          className={`${classes.popupDifficultyButton} ${
            gameSetupFormData.difficulty === "hard" &&
            classes.activeDifficultyButton
          }`}
          id={"popup-difficulty-button-hard"}
          onClick={diffucultyClickButtonHandler}
        >
          <img
            src={BlackHardDiffIcon}
            alt="hard dificulty icon"
            className={`${classes.difficultyButtonIcon} ${classes.difficultyButtonBlackIcon}`}
          />
          <img
            src={WhiteHardDiffIcon}
            alt="hard dificulty icon"
            className={`${classes.difficultyButtonIcon} ${classes.difficultyButtonWhiteIcon}`}
          />
          <p className={classes.popupButtonText}>Hard</p>
        </button>
        <p className={classes.popupSectionTitle}>Number Of Questions</p>
        <div className={classes.popupNumberOfQuestions}>
          <button
            className={`${classes.popupNumberOfQuestionsButton} ${
              gameSetupFormData.numberOfQuestions === 5 &&
              classes.popupNumberOfQuestionsButtonActive
            }`}
            id={"popup-difficulty-button-5"}
            onClick={numberOfInputsClickButtonHandler}
          >
            5
          </button>
          <button
            className={`${classes.popupNumberOfQuestionsButton} ${
              gameSetupFormData.numberOfQuestions === 10 &&
              classes.popupNumberOfQuestionsButtonActive
            }`}
            id={"popup-difficulty-button-10"}
            onClick={numberOfInputsClickButtonHandler}
          >
            10
          </button>
          <button
            className={`${classes.popupNumberOfQuestionsButton} ${
              gameSetupFormData.numberOfQuestions === 20 &&
              classes.popupNumberOfQuestionsButtonActive
            }`}
            id={"popup-difficulty-button-20"}
            onClick={numberOfInputsClickButtonHandler}
          >
            20
          </button>
        </div>
        <p className={classes.popupSectionTitle}>Question Types</p>
        <div className={classes.questionsTypesContainer}>
          {questionTypesButtonData.map((buttonData) => {
            return (
              <button
                className={`${classes.popupQuestionTypeButton} ${
                  gameSetupFormData.selectedQuestionTypes.includes(
                    buttonData.buttonName.toLowerCase()
                  ) && classes.popupQuestionTypeButtonActive
                }`}
                key={`${buttonData.id}-key`}
                id={buttonData.id}
                onClick={questionTypeSelectionClickHandler}
              >
                <img
                  src={buttonData.blackIcon}
                  alt={buttonData.altText}
                  className={classes.popupQuestionTypeBlackIcon}
                />
                <img
                  src={buttonData.whiteIcon}
                  alt={buttonData.altText}
                  className={classes.popupQuestionTypeWhiteIcon}
                />
                <p>{buttonData.buttonName}</p>
              </button>
            );
          })}
        </div>

        <button
          className={`${classes.startButton} ${
            submitButtonActive && classes.activeStartButton
          }`}
          disabled={!submitButtonActive}
          onClick={startButtonHandler}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default GameSetupPopup;
