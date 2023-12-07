import { formStoreActions } from "../../../../../store/form-store";
export const updateUserAnswers = (
  dispatch: any,
  currentUserArray: any[],
  questionNumber: number,
  userValue: string | number | boolean
) => {
  const copyOfUserAnswers = JSON.parse(JSON.stringify(currentUserArray));
  copyOfUserAnswers[questionNumber - 1] = userValue;
  dispatch(formStoreActions.setUserAnswersArray(copyOfUserAnswers));
};

export const updateActiveQuestionNumber = (
  dispatch: any,
  currentQuestionNumber: number,
  numberOfQuestions: number
) => {
  const newQuestionNumber = currentQuestionNumber + 1;

  if (numberOfQuestions < newQuestionNumber) {
    dispatch(formStoreActions.setEndOfTestReached(true));
    dispatch(formStoreActions.setStartQuestionTimer(false));
  } else {
    dispatch(formStoreActions.setActiveQuestionNumber(newQuestionNumber));
    dispatch(formStoreActions.setActiveQuestionNumberUpdated(true));
  }
};
