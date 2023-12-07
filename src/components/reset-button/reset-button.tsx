import classes from "./reset-button.module.css";
import { testResetFunction } from "../../assets/test-functions/test-function";
import { useAppDispatch } from "../../store/typescript-hooks";
const ResetButton = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const resetButtonClickHandler = () => {
    testResetFunction(dispatch);
  };
  return (
    <button className={classes.resetButton} onClick={resetButtonClickHandler}>
      Reset
    </button>
  );
};
export default ResetButton;
