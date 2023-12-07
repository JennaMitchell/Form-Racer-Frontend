import axios from "axios";

import { apiErrorHandler } from "./api-error-handler";

export type LeaderboardRetrievedDataType = {
  username: string;
  users_time: string;
  ranking: string;
};

// export type LeaderboardRetrievedDataTypeDate = {
//   username: string;
//   users_time: Date;
//   ranking: string;
// };

export const getAllQuestionData = async (databaseExtension: string) => {
  try {
    const returnedData = await axios.get(
      `sql-url/question-data/get-all-question-data${databaseExtension}`
    );
    const errorPresent = apiErrorHandler(returnedData);
    if (errorPresent) {
      throw new Error(`${returnedData?.data?.code}`);
    } else {
      return {
        data: returnedData.data,
        errorPresent: false,
      };
    }
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    return {
      data: message,
      errorPresent: true,
    };
  }
};
export const getAllQuestionDataWithLimit = async (
  databaseExtension: string,
  limit: number
) => {
  try {
    const requestData = {
      database: databaseExtension,
      limit: limit,
    };

    const returnedData = await axios.get(
      `sql-url/question-data/get-question-data-with-limit${JSON.stringify(
        requestData
      )}`
    );

    const errorPresent = apiErrorHandler(returnedData);
    if (errorPresent) {
      throw new Error(`${returnedData?.data?.code}`);
    } else {
      return {
        data: returnedData.data,
        errorPresent: false,
      };
    }
  } catch (err) {
    let message;
    if (err instanceof Error) message = err.message;
    else message = String(err);
    return {
      data: message,
      errorPresent: true,
    };
  }
};

export const getLeaderboardData = async (leaderboard: string) => {
  try {
    const returnedData = await axios.get(
      `sql-url/leaderboard-data/get-leaderboard-data${leaderboard}`
    );
    const errorPresent = apiErrorHandler(returnedData);
    if (errorPresent) {
      throw new Error(`${returnedData?.data?.code}`);
    } else {
      const returnedDataTyped: LeaderboardRetrievedDataType[] =
        returnedData.data;
      return {
        data: returnedDataTyped,
        errorPresent: false,
      };
    }
  } catch (err) {
    let message;

    if (err instanceof Error) message = err.message;
    else message = String(err);
    return {
      data: message,
      errorPresent: true,
    };
  }
};
export const updateLeaderboardData = async (
  leaderboard: string,
  data: LeaderboardRetrievedDataType
) => {
  try {
    const returnedData = await axios.put(
      `sql-url/leaderboard-data/update-leader-board-data${leaderboard}`,
      data
    );
    console.log(returnedData);
    const errorPresent = apiErrorHandler(returnedData);
    if (errorPresent) {
      throw new Error(`${returnedData?.data?.code}`);
    } else {
      const returnedDataTyped: LeaderboardRetrievedDataType[] =
        returnedData.data;
      return {
        data: returnedDataTyped,
        errorPresent: false,
      };
    }
  } catch (err) {
    let message;

    if (err instanceof Error) message = err.message;
    else message = String(err);
    return {
      data: message,
      errorPresent: true,
    };
  }
};
