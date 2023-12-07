import { acceptedLeaderboardDatabaseObject } from "../../assets/constants/constants";

export const capitalizeFirstLetter = (stringToCapitalize: string) => {
  const splitString = stringToCapitalize.split("");
  splitString[0] = splitString[0].toUpperCase();

  return splitString.join("");
};

export const convertSQLTimeIntoSeconds = (sqlTime: string) => {
  //sql time defualt is set to hh:mm:ss
  if (sqlTime.split("").length !== 0) {
    const sqlTimeSplit = sqlTime.split(":");
    const numberOfHours = +sqlTimeSplit[0];
    const numberOfMinutes = +sqlTimeSplit[1];
    const numberOfSeconds = +sqlTimeSplit[2];
    let totalTimeInSeconds = 0;
    if (numberOfHours !== 0) {
      totalTimeInSeconds = numberOfHours * 3600;
    }

    if (numberOfMinutes !== 0) {
      totalTimeInSeconds = totalTimeInSeconds + numberOfMinutes * 60;
    }
    totalTimeInSeconds = totalTimeInSeconds + numberOfSeconds;

    return totalTimeInSeconds;
  } else {
    return 1000000;
  }
};
const twoDigitTimeConverter = (numberToConvert: number) => {
  let returnString = "";
  if (numberToConvert < 10 && numberToConvert >= 0) {
    returnString = `0${numberToConvert}`;
  } else if (numberToConvert >= 10) {
    returnString = `${numberToConvert}`;
  } else {
    returnString = `00`;
  }
  return returnString;
};

export const secondsIntoHoursMinutesAndSecondsConverter = (
  timeInSeconds: number
) => {
  let numberOfMinutes = 0;
  let numberOfHours = 0;
  let remainingNumberOfSeconds = timeInSeconds;

  if (remainingNumberOfSeconds >= 3600) {
    numberOfHours = Math.floor(remainingNumberOfSeconds / 3600);
    remainingNumberOfSeconds = remainingNumberOfSeconds - numberOfHours * 3600;
  }

  if (remainingNumberOfSeconds >= 60) {
    numberOfMinutes = Math.floor(remainingNumberOfSeconds / 60);
    remainingNumberOfSeconds = remainingNumberOfSeconds - numberOfMinutes * 60;
  }

  return `${twoDigitTimeConverter(numberOfHours)}:${twoDigitTimeConverter(
    numberOfMinutes
  )}:${twoDigitTimeConverter(remainingNumberOfSeconds)}`;
};

export const secondsToSQLFormat = (timeInSecondsToConvert: number) => {
  //sql time defualt is set to hh:mm:ss
  let numberOfMinutes = 0;
  let numberOfHours = 0;
  let remainingNumberOfSeconds = timeInSecondsToConvert;

  if (remainingNumberOfSeconds >= 3600) {
    numberOfHours = Math.floor(remainingNumberOfSeconds / 3600);
    remainingNumberOfSeconds = remainingNumberOfSeconds - numberOfHours * 3600;
  }

  if (remainingNumberOfSeconds >= 60) {
    numberOfMinutes = Math.floor(remainingNumberOfSeconds / 60);
    remainingNumberOfSeconds = remainingNumberOfSeconds - numberOfMinutes * 60;
  }

  if (remainingNumberOfSeconds >= 0) {
    let hoursString = twoDigitTimeConverter(numberOfHours);
    let minutesString = twoDigitTimeConverter(numberOfMinutes);
    let secondsString = twoDigitTimeConverter(remainingNumberOfSeconds);

    return `${hoursString}:${minutesString}:${secondsString}`;
  } else {
    return "1000:00:00";
  }
};
export const leaderboardDatabaseNameGenerator = (
  gameDifficulty: string,
  numberOfQuestions: number
): string => {
  if (gameDifficulty === "easy") {
    if (numberOfQuestions === 5) {
      return acceptedLeaderboardDatabaseObject.easyFive;
    } else if (numberOfQuestions === 10) {
      return acceptedLeaderboardDatabaseObject.easyTen;
    } else if (numberOfQuestions === 20) {
      return acceptedLeaderboardDatabaseObject.eastTwenty;
    }
  } else if (gameDifficulty === "medium") {
    if (numberOfQuestions === 5) {
      return acceptedLeaderboardDatabaseObject.mediumFive;
    } else if (numberOfQuestions === 10) {
      return acceptedLeaderboardDatabaseObject.mediumTen;
    } else if (numberOfQuestions === 20) {
      return acceptedLeaderboardDatabaseObject.mediumTwenty;
    }
  } else if (gameDifficulty === "hard") {
    if (numberOfQuestions === 5) {
      return acceptedLeaderboardDatabaseObject.hardFive;
    } else if (numberOfQuestions === 10) {
      return acceptedLeaderboardDatabaseObject.hardTen;
    } else if (numberOfQuestions === 20) {
      return acceptedLeaderboardDatabaseObject.hardTwenty;
    }
  }
  return "no-database";
};
