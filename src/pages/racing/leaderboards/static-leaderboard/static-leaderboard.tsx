import sharedClasses from "../shared-leaderboard.module.css";
import { useEffect, useState, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../store/typescript-hooks";
import { getLeaderboardData } from "../../../../assets/sql-api-calls/form-api-calls";
import { popupsStoreActions } from "../../../../store/popups-store";
import {
  acceptedNumberOfQuestionsValues,
  acceptedDifficultyLevels,
} from "../../../../assets/constants/constants";
import { LeaderboardRetrievedDataType } from "../../../../assets/sql-api-calls/form-api-calls";

import { capitalizeFirstLetter } from "../../../../assets/general-functions/general-functions";
const StaticLeaderboard = (): JSX.Element => {
  const gameSettings = useAppSelector((state) => state.userInfo.gameSettings);
  const [retrievedLeaderBoardData, setRetrievedLeaderBoardData] = useState<
    LeaderboardRetrievedDataType[]
  >([]);
  const dispatch = useAppDispatch();
  const leaderBoardAPICaller = useCallback(
    async (databaseString: string) => {
      const retrievedLeaderBoardData = await getLeaderboardData(databaseString);

      if (retrievedLeaderBoardData.errorPresent) {
        dispatch(popupsStoreActions.setServerMessagePopupActive(true));
        dispatch(
          popupsStoreActions.setServerMessageData({
            message: `${retrievedLeaderBoardData.data}`,
            messageType: "error",
          })
        );
      } else {
        dispatch(popupsStoreActions.setServerMessagePopupActive(true));
        dispatch(
          popupsStoreActions.setServerMessageData({
            message: `Data Retrieved`,
            messageType: "success",
          })
        );
        if (typeof retrievedLeaderBoardData.data !== "string") {
          return retrievedLeaderBoardData.data;
        }
      }
    },
    [dispatch]
  );

  const leaderboardDataRetriever = useCallback(async () => {
    const gameDifficulty = gameSettings.difficulty;
    const numberOfQuestions = gameSettings.numberOfQuestions;
    let gameDifficultyText = gameDifficulty.toLowerCase();
    let numberOfQuestionText = "";
    switch (numberOfQuestions) {
      case 5:
        numberOfQuestionText = "five";
        break;
      case 10:
        numberOfQuestionText = "ten";
        break;
      case 20:
        numberOfQuestionText = "twenty";
        break;

      default:
        break;
    }
    if (
      acceptedDifficultyLevels.includes(gameDifficultyText) &&
      acceptedNumberOfQuestionsValues.includes(numberOfQuestionText)
    ) {
      const databaseString = `${gameDifficultyText}_${numberOfQuestionText}_questions_leaderboard`;
      const retrievedData = await leaderBoardAPICaller(databaseString);
      if (retrievedData !== undefined) {
        setRetrievedLeaderBoardData(retrievedData);
      }
    } else {
      dispatch(popupsStoreActions.setServerMessagePopupActive(true));
      dispatch(
        popupsStoreActions.setServerMessageData({
          message: `Leaderboard Error`,
          messageType: "error",
        })
      );
    }
  }, [dispatch, gameSettings, leaderBoardAPICaller]);

  useEffect(() => {
    leaderboardDataRetriever();
  }, [dispatch, leaderboardDataRetriever]);

  return (
    <div className={sharedClasses.leaderboardTopContainer}>
      <p className={sharedClasses.leaderboardTitle}>
        {`   ${capitalizeFirstLetter(gameSettings.difficulty)} ${
          gameSettings.numberOfQuestions
        }`}
        <br></br>Leaderboard
      </p>

      <div className={sharedClasses.leaderboardContents}>
        {retrievedLeaderBoardData.length !== 0 &&
          retrievedLeaderBoardData.map((entry) => {
            return (
              <>
                <p>{entry.ranking}</p>

                <p>{entry.username}</p>
                <p>{entry.users_time}</p>
              </>
            );
          })}
      </div>
    </div>
  );
};
export default StaticLeaderboard;
