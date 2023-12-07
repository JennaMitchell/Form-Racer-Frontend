import sharedClasses from "../shared-leaderboard.module.css";
import classes from "./animated-leaderboard.module.css";
import { useEffect, useState, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../store/typescript-hooks";
// import { getLeaderboardData } from "../../../../assets/sql-api-calls/form-api-calls";
import { getAllMongoDBDataFromSelectedScoreboard } from "../../../../utilities/mongo-db-requests/scoreboard/scoreboard-api-functions";
import { acceptedScoreboardDatabaseNames } from "../../../../assets/constants/scoreboardDataTypes";
import { popupsStoreActions } from "../../../../store/popups-store";
import {
  acceptedNumberOfQuestionsValues,
  acceptedDifficultyLevels,
} from "../../../../assets/constants/constants";
import { LeaderboardRetrievedDataType } from "../../../../assets/sql-api-calls/form-api-calls";

import {
  capitalizeFirstLetter,
  convertSQLTimeIntoSeconds,
  secondsIntoHoursMinutesAndSecondsConverter,
} from "../../../../assets/general-functions/general-functions";

import AnimatedBoard from "./animated-board/animated-board";

type AnimatedLeaderboardProps = {
  submittedUsername: string;
  usersTimeInSeconds: number;
};

const AnimatedLeaderboard = ({
  submittedUsername,
  usersTimeInSeconds,
}: AnimatedLeaderboardProps): JSX.Element => {
  const gameSettings = useAppSelector((state) => state.userInfo.gameSettings);
  const [retrievedLeaderBoardData, setRetrievedLeaderBoardData] = useState<
    LeaderboardRetrievedDataType[]
  >([]);
  const [newLeaderboardData, setNewLeaderboardData] = useState<
    LeaderboardRetrievedDataType[]
  >([]);
  const [usersNewRanking, setUsersNewRanking] = useState(-1);
  const dispatch = useAppDispatch();
  const leaderBoardAPICaller = useCallback(async (databaseString: string) => {
    const retrievedLeaderBoardData =
      await getAllMongoDBDataFromSelectedScoreboard(databaseString);

    return retrievedLeaderBoardData;
  }, []);

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
      const databaseStringToRetrieve = `${gameDifficulty}${numberOfQuestions}`;
      const databaseString = `${acceptedScoreboardDatabaseNames[databaseStringToRetrieve]}`;
      const retrievedData = await leaderBoardAPICaller(databaseString);
      console.log(retrievedData);
      if (retrievedData !== undefined) {
        console.log(100);
        setRetrievedLeaderBoardData(retrievedData.retrievedData);
      }
    } else {
      dispatch(popupsStoreActions.setServerMessagePopupActive(true));
      dispatch(
        popupsStoreActions.setServerMessageData({
          message: `Leaderboard Not Retrieved`,
          messageType: "error",
        })
      );
    }
  }, [dispatch, gameSettings, leaderBoardAPICaller]);

  const calculateUsersRanking = useCallback(() => {
    let usersNewRanking = -1;
    if (retrievedLeaderBoardData.length !== 0) {
      for (
        let retrievedLeaderBoardDataIndex = 0;
        retrievedLeaderBoardDataIndex < retrievedLeaderBoardData.length;
        retrievedLeaderBoardDataIndex++
      ) {
        const entry = retrievedLeaderBoardData[retrievedLeaderBoardDataIndex];
        const currentRankingTime = convertSQLTimeIntoSeconds(entry.users_time);
        if (usersTimeInSeconds <= currentRankingTime) {
          usersNewRanking = +entry.ranking;
          break;
        }
      }
    }
    return usersNewRanking;
  }, [retrievedLeaderBoardData, usersTimeInSeconds]);

  useEffect(() => {
    leaderboardDataRetriever();
  }, [dispatch, leaderboardDataRetriever]);

  useEffect(() => {
    if (retrievedLeaderBoardData.length !== 0) {
      const usersNewRanking = calculateUsersRanking();
      console.log(140);

      if (usersNewRanking !== -1 && usersNewRanking <= 10) {
        const copyOfRetrievedLeaderBoardData = JSON.parse(
          JSON.stringify(retrievedLeaderBoardData)
        );
        console.log(copyOfRetrievedLeaderBoardData);

        copyOfRetrievedLeaderBoardData[usersNewRanking - 1] = {
          username: submittedUsername,
          users_time: secondsIntoHoursMinutesAndSecondsConverter(
            +usersTimeInSeconds
          ),
          ranking: usersNewRanking,
        };
        console.log(usersNewRanking);

        setUsersNewRanking(usersNewRanking);

        setNewLeaderboardData(copyOfRetrievedLeaderBoardData);
      } else if (usersNewRanking === -1) {
        const copyOfRetrievedData = JSON.parse(
          JSON.stringify(retrievedLeaderBoardData)
        );
        copyOfRetrievedData.push({
          username: submittedUsername,
          users_time: secondsIntoHoursMinutesAndSecondsConverter(
            +usersTimeInSeconds
          ),
          ranking: `11`,
        });

        setNewLeaderboardData(copyOfRetrievedData);
        setUsersNewRanking(11);
      }
    }
  }, [
    calculateUsersRanking,
    retrievedLeaderBoardData,
    submittedUsername,
    usersTimeInSeconds,
  ]);

  return (
    <div className={`${classes.animatedLeaderboardTopContainer}`}>
      <p className={sharedClasses.leaderboardTitle}>
        {`   ${capitalizeFirstLetter(gameSettings.difficulty)} ${
          gameSettings.numberOfQuestions
        }`}
        <br></br>Leaderboard
      </p>
      {retrievedLeaderBoardData.length !== 0 &&
        newLeaderboardData.length !== 0 &&
        usersNewRanking !== -1 && (
          <AnimatedBoard
            previousLeaderboardData={retrievedLeaderBoardData}
            newLeaderboardData={newLeaderboardData}
            newUserRanking={usersNewRanking}
          />
        )}
    </div>
  );
};
export default AnimatedLeaderboard;
