import classes from "./animated-board.module.css";
import { LeaderboardRetrievedDataType } from "../../../../../assets/sql-api-calls/form-api-calls";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../store/typescript-hooks";
import { acceptedScoreboardDatabaseNames } from "../../../../../assets/constants/scoreboardDataTypes";
import { updateMongoDBScoreboardEntry } from "../../../../../utilities/mongo-db-requests/scoreboard/scoreboard-api-functions";
// import { leaderboardDatabaseNameGenerator } from "../../../../../assets/general-functions/general-functions";
// import { updateLeaderboardData } from "../../../../../assets/sql-api-calls/form-api-calls";

type AnimatedBoardPropTypes = {
  previousLeaderboardData: LeaderboardRetrievedDataType[];
  newLeaderboardData: LeaderboardRetrievedDataType[];
  newUserRanking: number;
};

const AnimatedBoard = ({
  previousLeaderboardData,
  newLeaderboardData,
  newUserRanking,
}: AnimatedBoardPropTypes): JSX.Element => {
  console.log(newLeaderboardData);
  console.log(previousLeaderboardData);
  const [firstHalfOfLeaderboard, setFirstHalfOfLeaderboard] = useState<
    LeaderboardRetrievedDataType[]
  >([]);
  const [secondHalfOfLeadboard, setSecondHalfOfLeaderboard] = useState<
    LeaderboardRetrievedDataType[]
  >([]);
  const [scrollAnimationTrigger, setScrollAnimationTrigger] = useState(false);
  const [seperateAnimationTrigger, setSeperateAnimationTrigger] =
    useState(false);
  const [fadeUserScoreIn, setFadeUserScoreIn] = useState(false);
  const [hidePreviousLeaderboard, setHidePreviousLeaderboard] = useState(false);
  const [showNewLeaderBoard, setShowNewLeaderboard] = useState(false);
  const [leaderboardUpdated, setLeaderboardUpdated] = useState(false);

  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const gameSettings = useAppSelector((state) => state.userInfo.gameSettings);
  const testResetTriggered = useAppSelector(
    (state) => state.formRacing.testResetTriggered
  );

  const intersectionObeserverOptions = useMemo(() => {
    return {
      root: document.getElementById("animated-leaderboard-container"),
      rootMargin: "0px",
      threshold: 1.0,
    };
  }, []);

  const leaderboardEntryScrolledIntoView = useCallback(() => {
    setSeperateAnimationTrigger(true);
    setScrollAnimationTrigger(false);
  }, []);

  const observer = useMemo(() => {
    return new IntersectionObserver(
      leaderboardEntryScrolledIntoView,
      intersectionObeserverOptions
    );
  }, [leaderboardEntryScrolledIntoView, intersectionObeserverOptions]);

  useEffect(() => {
    const tempFirstHalfArray: LeaderboardRetrievedDataType[] = [];
    const tempSecondHalfArray: LeaderboardRetrievedDataType[] = [];
    const elementToScrollToId = `leaderboard-row-entry-${newUserRanking}`;
    const retrievedElement = document.getElementById(elementToScrollToId);

    if (retrievedElement) {
      const notNullTargetElement = retrievedElement as HTMLDivElement;
      observer.observe(notNullTargetElement);
    }

    if (newUserRanking === 1) {
      setSecondHalfOfLeaderboard(previousLeaderboardData);
      setFirstHalfOfLeaderboard([]);
    } else if (newUserRanking === 11) {
      setFirstHalfOfLeaderboard(previousLeaderboardData);
      setSecondHalfOfLeaderboard([]);
    } else {
      for (
        let previousLeaderboardDataIndex = 0;
        previousLeaderboardDataIndex < previousLeaderboardData.length;
        previousLeaderboardDataIndex++
      ) {
        const entry = previousLeaderboardData[previousLeaderboardDataIndex];
        if (newUserRanking > +entry.ranking) {
          tempFirstHalfArray.push(entry);
        } else {
          tempSecondHalfArray.push(entry);
        }
      }

      setFirstHalfOfLeaderboard(tempFirstHalfArray);
      setSecondHalfOfLeaderboard(tempSecondHalfArray);
    }
    setScrollAnimationTrigger(true);

    // setting up the scroll interscetion observer
  }, [newUserRanking, previousLeaderboardData, observer]);

  // Step 2. Scrolling To the Element if element is not already in View
  useEffect(() => {
    if (scrollAnimationTrigger) {
      // timeout is set so the leaderboard has time to fade in
      const scrollTimeout = setTimeout(() => {
        let elementToScrollToId = "";
        if (newUserRanking === 11) {
          elementToScrollToId = `leaderboard-row-entry-10`;
        } else {
          elementToScrollToId = `leaderboard-row-entry-${newUserRanking}`;
        }

        const retrievedElement = document.getElementById(elementToScrollToId);
        const currentParentElement = boardContainerRef.current;

        if (retrievedElement && currentParentElement) {
          const notNullRetrievedElement = retrievedElement as HTMLDivElement;

          const notNullParentElement = currentParentElement;

          const rankingEntryHeight = notNullRetrievedElement.offsetHeight;
          const parentElementHeight = notNullParentElement.offsetHeight;

          const scrollToHeight = rankingEntryHeight + newUserRanking;

          if (scrollToHeight < parentElementHeight) {
            setSeperateAnimationTrigger(true);
            setScrollAnimationTrigger(false);
          } else {
            notNullParentElement.scrollTo({
              top: scrollToHeight,
              left: 0,
              behavior: "smooth",
            });
          }
        }
      }, 2000);

      return () => {
        clearTimeout(scrollTimeout);
      };
    }
  }, [newUserRanking, scrollAnimationTrigger]);

  // Step 3 Fade User Score in
  useEffect(() => {
    if (seperateAnimationTrigger) {
      const fadeInTimeout = setTimeout(() => {
        setFadeUserScoreIn(true);
      }, 1500);

      return () => {
        clearTimeout(fadeInTimeout);
      };
    }
  }, [seperateAnimationTrigger]);

  // Step 4. Fade In New Leaderboard;
  useEffect(() => {
    if (fadeUserScoreIn) {
      const fadeNewUserScoreIn = setTimeout(() => {
        setShowNewLeaderboard(true);
        setHidePreviousLeaderboard(true);
        setFadeUserScoreIn(false);
        setSeperateAnimationTrigger(false);
      }, 1000);
      return () => {
        clearTimeout(fadeNewUserScoreIn);
      };
    }
  }, [fadeUserScoreIn, showNewLeaderBoard]);
  //Step 5. Update the SQL/MongoDB Database
  useEffect(() => {
    if (
      showNewLeaderBoard &&
      hidePreviousLeaderboard &&
      !fadeUserScoreIn &&
      !seperateAnimationTrigger &&
      !leaderboardUpdated
    ) {
      const usersData = newLeaderboardData[newUserRanking - 1];

      const updateDatabase = async () => {
        const scoreboardKeyValue = `${gameSettings.difficulty}${gameSettings.numberOfQuestions}`;

        const databaseTableName =
          acceptedScoreboardDatabaseNames[scoreboardKeyValue];
        await updateMongoDBScoreboardEntry(databaseTableName, {
          username: usersData.username,
          users_time: usersData.users_time,
          ranking: +usersData.ranking,
        });
      };
      updateDatabase();
      setLeaderboardUpdated(true);
    }
  }, [
    dispatch,
    fadeUserScoreIn,
    gameSettings.difficulty,
    gameSettings.numberOfQuestions,
    hidePreviousLeaderboard,
    newLeaderboardData,
    newUserRanking,
    seperateAnimationTrigger,
    showNewLeaderBoard,
    leaderboardUpdated,
  ]);

  useEffect(() => {
    if (testResetTriggered) {
      setFirstHalfOfLeaderboard([]);
      setSecondHalfOfLeaderboard([]);
      setScrollAnimationTrigger(false);
      setSeperateAnimationTrigger(false);
      setFadeUserScoreIn(false);
      setHidePreviousLeaderboard(false);
      setShowNewLeaderboard(false);
      setLeaderboardUpdated(false);
    }
  }, [testResetTriggered]);

  return (
    <div
      className={`${classes.animatedLeaderboardContainer}`}
      ref={boardContainerRef}
      id="animated-leaderboard-container"
    >
      {newLeaderboardData.length !== 0 && (
        <div className={`${classes.newLeaderBoardContainer}   `}>
          {newLeaderboardData.map((entry, index) => {
            return (
              <div
                className={`${classes.leaderboardRowEntry} ${
                  classes.newLeaderboardEntry
                } ${index + 1 === newUserRanking && classes.userEntry} ${
                  index + 1 === newUserRanking &&
                  fadeUserScoreIn &&
                  classes.showEntry
                } ${showNewLeaderBoard && classes.showEntry}`}
                id={`new-leaderboard-row-entry-${index + 1}`}
                key={`new-leaderboard-row-entry-${index + 1}-key`}
              >
                <p>{entry.ranking}</p>

                <p>{entry.username}</p>
                <p>{entry.users_time}</p>
              </div>
            );
          })}
        </div>
      )}

      {firstHalfOfLeaderboard.length !== 0 && (
        <div
          className={`${classes.seperatingLeaderboard} ${
            classes.higherLeaderboard
          }  ${hidePreviousLeaderboard && classes.hideOldLeaderboard}`}
        >
          {firstHalfOfLeaderboard.map((entry, index) => {
            return (
              <div
                className={`${classes.leaderboardRowEntry}`}
                id={`leaderboard-row-entry-${index + 1}`}
                key={`leaderboard-row-entry-${index + 1}-key`}
              >
                <p>{entry.ranking}</p>

                <p>{entry.username}</p>
                <p>{entry.users_time}</p>
              </div>
            );
          })}
        </div>
      )}

      {secondHalfOfLeadboard.length !== 0 && (
        <div
          className={`${classes.seperatingLeaderboard}  ${
            seperateAnimationTrigger && classes.moveDown
          }
          ${fadeUserScoreIn && classes.moveDown} 
          ${classes.lowerLeaderboard}
          ${hidePreviousLeaderboard && classes.hideOldLeaderboard}
        `}
        >
          {secondHalfOfLeadboard.map((entry, index) => {
            return (
              <div
                className={`${classes.leaderboardRowEntry}  `}
                id={`leaderboard-row-entry-${
                  index + 1 + firstHalfOfLeaderboard.length
                }`}
                key={`leaderboard-row-entry-${
                  index + 1 + firstHalfOfLeaderboard.length
                }-key`}
              >
                <p>{entry.ranking}</p>

                <p>{entry.username}</p>
                <p>{entry.users_time}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default AnimatedBoard;
