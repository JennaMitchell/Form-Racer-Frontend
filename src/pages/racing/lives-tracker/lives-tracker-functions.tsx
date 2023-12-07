import { formStoreActions } from "../../../store/form-store";

export const decreaseLivesTracker = (
  dispatch: any,
  userLivesArray: boolean[]
) => {
  let userHasRemainingLives = false;
  let indexOfNextAvailableLife = 0;

  for (
    let indexOfUserLivesArray = 0;
    indexOfUserLivesArray < userLivesArray.length;
    indexOfUserLivesArray++
  ) {
    if (userLivesArray[indexOfUserLivesArray]) {
      userHasRemainingLives = true;
      indexOfNextAvailableLife = indexOfUserLivesArray;
      break;
    }
  }

  if (userHasRemainingLives) {
    const copyOfUserLivesArray = JSON.parse(JSON.stringify(userLivesArray));
    copyOfUserLivesArray[indexOfNextAvailableLife] = false;
    dispatch(formStoreActions.setActiveLifesArray(copyOfUserLivesArray));
    dispatch(formStoreActions.setActiveLifesArrayDecreased(true));
  } else {
    dispatch(formStoreActions.setUserFailedGame(true));
    dispatch(formStoreActions.setEndOfTestReached(true));
    dispatch(formStoreActions.setGameOverScreenActive(true));
  }
};
