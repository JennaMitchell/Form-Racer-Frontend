import { formStoreActions } from "../../store/form-store";

export const testResetFunction = (dispatch: any) => {
  dispatch(formStoreActions.setGeneratedQuestionData([]));
  dispatch(formStoreActions.setUserAnswersArray([]));
  dispatch(formStoreActions.setActiveLifesArray([true, true, true]));
  dispatch(formStoreActions.setUserFailedGame(false));
  dispatch(formStoreActions.setActiveQuestionNumber(1));
  dispatch(formStoreActions.setActiveQuestionNumberUpdated(false));
  dispatch(formStoreActions.setStartTest(false));
  dispatch(formStoreActions.setEndOfTestReached(false));
  dispatch(formStoreActions.setStartQuestionTimer(false));
  dispatch(formStoreActions.setAstroidExplosionTriggered(false));
  dispatch(formStoreActions.setGameOverScreenActive(false));
  dispatch(formStoreActions.setFireShipWeapons(false));
  dispatch(formStoreActions.setAstroidDestroyed(false));
  dispatch(formStoreActions.setResetTestTimer(false));
  dispatch(formStoreActions.setCompletionTime(0));
  dispatch(formStoreActions.setTestStarted(false));
  dispatch(formStoreActions.setHomeWorldAnimationComplete(false));
  dispatch(formStoreActions.setShipReturnedAnimationComplete(false));
  dispatch(formStoreActions.setTestResetTriggered(true));
  dispatch(formStoreActions.setShipReturnedAnimationComplete(false));
  dispatch(formStoreActions.setReturnShipHome(false));
};
