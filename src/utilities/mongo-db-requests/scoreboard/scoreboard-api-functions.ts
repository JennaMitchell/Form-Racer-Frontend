import { scoreboardDataType } from "../../../assets/constants/scoreboardDataTypes";

import { acceptedScoreboardDatabaseNames } from "../../../assets/constants/scoreboardDataTypes";

// putting datat into descending order based on ranking

const orderByRanking = (scoreboardData: scoreboardDataType[]) => {
  const rankingsToFind = scoreboardData.map((val, index) => {
    return index + 1;
  });
  const orderedData = [];

  for (
    let indexOfRankingsToFind = 0;
    indexOfRankingsToFind < rankingsToFind.length;
    indexOfRankingsToFind++
  ) {
    for (
      let indexOfScoreboardData = 0;
      indexOfScoreboardData < scoreboardData.length;
      indexOfScoreboardData++
    ) {
      if (
        +scoreboardData[indexOfScoreboardData].ranking ===
        rankingsToFind[indexOfRankingsToFind]
      ) {
        orderedData.push(scoreboardData[indexOfScoreboardData]);
      }
    }
  }

  return orderedData;
};

// Updating Scoreboard

export const updateMongoDBScoreboardEntry = async (
  scoreboardDatabase: string,
  newDatabaseEntry: scoreboardDataType
) => {
  try {
    const acceptedDatabaseTypes = Object.values(
      acceptedScoreboardDatabaseNames
    );

    if (!acceptedDatabaseTypes.includes(scoreboardDatabase)) {
      throw new Error(`Invalid scoreboard_name !`);
    } else {
      const finalNewDatabaseEntry = {
        ...newDatabaseEntry,
        selected_scoreboard: scoreboardDatabase,
      };

      const fetchedResponse = await fetch(
        `${process.env.REACT_APP_DATABASE_URL}/scoreboards/update-leaderboard-entry`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(finalNewDatabaseEntry),
        }
      );

      const jsonedResponse = await fetchedResponse.json();

      return jsonedResponse;
    }
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    throw new Error(`${message}`);
  }
};
export const getAllMongoDBDataFromSelectedScoreboard = async (
  selectedDatabase: string
) => {
  try {
    const fetchedResponse = await fetch(
      `${process.env.REACT_APP_DATABASE_URL}/scoreboards/get-scoreboard-data/${selectedDatabase}`,
      {
        method: "GET",
      }
    );

    const jsonedResponse = await fetchedResponse.json();
    jsonedResponse.retrievedData = orderByRanking(jsonedResponse.retrievedData);

    return jsonedResponse;
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    throw new Error(`${message}`);
  }
};
