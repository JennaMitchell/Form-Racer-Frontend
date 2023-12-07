import { useRef } from "react";
import classes from "./score-submitter.module.css";

type ScoreSubmitterProps = {
  scoreSubmitHandler: (enteredUsername: string) => void;
};
const ScoreSubmitter = ({
  scoreSubmitHandler,
}: ScoreSubmitterProps): JSX.Element => {
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const submitButtonHandler = () => {
    const currentUsernameInputRef = usernameInputRef.current;

    if (currentUsernameInputRef) {
      const notNullCurrentUsernameInputRef = currentUsernameInputRef;

      const enteredUsername = notNullCurrentUsernameInputRef.value;
      if (enteredUsername.split("").length !== 0) {
        scoreSubmitHandler(enteredUsername);
      }
    }
  };

  return (
    <div className={classes.scoreSubmitterMainContainer}>
      <label htmlFor="leaderboard-username-to-submit">Username</label>
      <input
        maxLength={3}
        id="leaderboard-username-to-submit"
        ref={usernameInputRef}
        defaultValue={"AAA"}
      />

      <button onClick={submitButtonHandler}> Submit</button>
    </div>
  );
};
export default ScoreSubmitter;
