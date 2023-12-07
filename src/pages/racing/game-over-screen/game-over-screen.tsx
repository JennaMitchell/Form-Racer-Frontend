import { useAppDispatch } from "../../../store/typescript-hooks";
import { testResetFunction } from "../../../assets/test-functions/test-function";
import classes from "./game-over-screen.module.css";
const GameOverScreen = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const continueButtonHandler = () => {
    testResetFunction(dispatch);
  };

  return (
    <div className={classes.gameOverScreenTopContainer}>
      <p className={classes.gameOverTitle}> GAME OVER</p>
      <button className={classes.newGameButton} onClick={continueButtonHandler}>
        Continue ?
      </button>
    </div>
  );
};
export default GameOverScreen;
