//racer one
import RacerOneBodyImage from "../../assets/images/racers/space-racer-1/space-racer-1-ship.png";
import RacerOneFlameImage from "../../assets/images/racers/space-racer-1/space-racer-1-fire.png";
// racer two
import RacerTwoBodyImage from "../../assets/images/racers/space-racer-2/space-racer-2-hull.png";
import RacerTwoFlameOneImage from "../../assets/images/racers/space-racer-2/space-racer-2-flame.png";
//racer three
import RacerThreeBodyImage from "../../assets/images/racers/space-racer-3/space-racer-3-hull.png";
import RacerThreeFlameOneImage from "../../assets/images/racers/space-racer-3/space-racer-3-flame.png";
//racer four
import RacerFourBodyImage from "../../assets/images/racers/space-racer-4/space-racer-4-hull.png";
import RacerFourFlameOneImage from "../../assets/images/racers/space-racer-4/space-racer-4-flame.png";
//racer five
import RacerFiveBodyImage from "../../assets/images/racers/space-racer-5/space-racer-5-hull.png";
import RacerFiveFlameOneImage from "../../assets/images/racers/space-racer-5/space-racer-5-flame-1.png";
import RacerFiveFlameTwoImage from "../../assets/images/racers/space-racer-5/space-racer-5-flame-2.png";
import RacerFiveFlameThreeImage from "../../assets/images/racers/space-racer-5/space-racer-5-flame-3.png";

export const racerData = [
  {
    racerBody: RacerOneBodyImage,
    racerEngineCenterFlame: RacerOneFlameImage,
    racerFlameCenterPopupId: "popup-space-racer-one-flame-center",
    racerFlameCenterMainPageId: "main-page-space-racer-one-flame-center",
    racerFlameCenterPopupAnimationClassName:
      "popup-space-racer-one-flame-center-animation",
    racerFlameCenterMainPageAnimationClassName:
      "main-page-space-racer-one-flame-center-animation",
  },
  {
    racerBody: RacerTwoBodyImage,
    racerEngineCenterFlame: RacerTwoFlameOneImage,
    racerFlameCenterPopupId: "popup-space-racer-two-flame-center",
    racerFlameCenterMainPageId: "main-page-space-racer-two-flame-center",
    racerFlameCenterPopupAnimationClassName:
      "popup-space-racer-two-flame-center-animation",
    racerFlameCenterMainPageAnimationClassName:
      "main-page-space-racer-two-flame-center-animation",
  },
  {
    racerBody: RacerThreeBodyImage,
    racerEngineCenterFlame: RacerThreeFlameOneImage,
    racerFlameCenterPopupId: "popup-space-racer-three-flame-center",
    racerFlameCenterMainPageId: "main-page-space-racer-three-flame-center",
    racerFlameCenterPopupAnimationClassName:
      "popup-space-racer-three-flame-center-animation",
    racerFlameCenterMainPageAnimationClassName:
      "main-page-space-racer-three-flame-center-animation",
  },
  {
    racerBody: RacerFourBodyImage,
    racerEngineCenterFlame: RacerFourFlameOneImage,
    racerFlameCenterPopupId: "popup-space-racer-four-flame-center",
    racerFlameCenterMainPageId: "main-page-space-racer-four-flame-center",
    racerFlameCenterPopupAnimationClassName:
      "popup-space-racer-four-flame-center-animation",
    racerFlameCenterMainPageAnimationClassName:
      "main-page-space-racer-four-flame-center-animation",
  },
  {
    racerBody: RacerFiveBodyImage,
    racerEngineLeftFlame: RacerFiveFlameOneImage,
    racerEngineCenterFlame: RacerFiveFlameTwoImage,
    racerEngineRightFlame: RacerFiveFlameThreeImage,
    racerFlameLeftPopupId: "popup-space-racer-five-flame-left",
    racerFlameLeftMainPageId: "main-page-space-racer-five-flame-left",
    racerFlameCenterPopupId: "popup-space-racer-five-flame-center",
    racerFlameCenterMainPageId: "main-page-space-racer-five-flame-center",
    racerFlameRightPopupId: "popup-space-racer-five-flame-right",
    racerFlameRightMainPageId: "main-page-space-racer-five-flame-right",
    racerFlameCenterPopupAnimationClassName:
      "popup-space-racer-five-flame-center-animation",
    racerFlameCenterMainPageAnimationClassName:
      "main-page-space-racer-five-flame-center-animation",
    racerFlameLeftPopupAnimationClassName:
      "popup-space-racer-five-flame-left-animation",
    racerFlameLeftMainPageAnimationClassName:
      "main-page-space-racer-five-flame-left-animation",
    racerFlameRightPopupAnimationClassName:
      "popup-space-racer-five-flame-right-animation",
    racerFlameRightMainPageAnimationClassName:
      "main-page-space-racer-five-flame-right-animation",
  },
];
export const lowerCaseLettersForMultipleChoiceArray = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export const acceptedNumberOfQuestionsValues = ["five", "ten", "twenty"];
export const acceptedDifficultyLevels = ["easy", "medium", "hard"];
export const acceptedQuestionDatabase = [
  "checkbox_question_data",
  "color_question_data",
  "date_question_data",
  "input_question_data",
  "multiple_choice_question_data",
  "slider_question_data",
];
export const acceptedLeaderboardDatabase = [
  "easy_five_questions_leaderboard",
  "easy_ten_questions_leaderboard",
  "easy_twenty_questions_leaderboard",
  "medium_five_questions_leaderboard",
  "medium_ten_questions_leaderboard",
  "medium_twenty_questions_leaderboard",
  "hard_five_questions_leaderboard",
  "hard_ten_questions_leaderboard",
  "hard_twenty_questions_leaderboard",
];

export const acceptedQuestionDatabaseObject = {
  checkbox: "checkbox_question_data",
  color: "color_question_data",
  date: "date_question_data",
  input: "input_question_data",
  multipleChoice: "multiple_choice_question_data",
  slider: "slider_question_data",
};

export const acceptedLeaderboardDatabaseObject = {
  easyFive: "easy_five_questions_leaderboard",
  easyTen: "easy_ten_questions_leaderboard",
  eastTwenty: "easy_twenty_questions_leaderboard",
  mediumFive: "medium_five_questions_leaderboard",
  mediumTen: "medium_ten_questions_leaderboard",
  mediumTwenty: "medium_twenty_questions_leaderboard",
  hardFive: "hard_five_questions_leaderboard",
  hardTen: "hard_ten_questions_leaderboard",
  hardTwenty: "hard_twenty_questions_leaderboard",
};

type acceptedDatabaseObjectType = {
  [key: string]: {
    databaseName: string;
    subURL: string;
    addURL: string;
  };
};
export const acceptedMongoDBAPICallObject: acceptedDatabaseObjectType = {
  multipleChoice: {
    databaseName: "multiple_choice_question_db",
    subURL: "/multiple-choice-questions",
    addURL: "/add-new-multiple-choice-question",
  },
  checkbox: {
    databaseName: "checkbox_question_db",
    subURL: "/checkbox-questions",
    addURL: "/add-new-checkbox-question",
  },
  input: {
    databaseName: "input_question_db",
    subURL: "/input-questions",
    addURL: "/add-new-input-question",
  },
  color: {
    databaseName: "color_question_db",
    subURL: "/color-questions",
    addURL: "/add-new-color-question",
  },
  date: {
    databaseName: "date_question_db",
    subURL: "/date-questions",
    addURL: "/add-new-date-question",
  },
  slider: {
    databaseName: "slider_question_db",
    subURL: "/slider-questions",
    addURL: "/add-new-slider-question",
  },
};
