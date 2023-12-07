export type scoreboardDataType = {
  username: string;
  users_time: string;
  ranking: number;
};
type acceptedScoreboardDatabaseNamesType = {
  [key: string]: string;
};
export const acceptedScoreboardDatabaseNames: acceptedScoreboardDatabaseNamesType =
  {
    easy5: "easy_5_scoreboard",
    easy10: "easy_10_scoreboard",
    easy20: "easy_20_scoreboard",
    medium5: "medium_5_scoreboard",
    medium10: "medium_10_scoreboard",
    medium20: "medium_20_scoreboard",
    hard5: "hard_5_scoreboard",
    hard10: "hard_10_scoreboard",
    hard20: "hard_20_scoreboard",
  };
