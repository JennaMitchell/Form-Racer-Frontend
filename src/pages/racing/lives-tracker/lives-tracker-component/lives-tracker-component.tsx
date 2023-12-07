import {
  useAppDispatch,
  useAppSelector,
} from "../../../../store/typescript-hooks";
import classes from "./lives-tracker-component.module.css";
import FullHeart from "../../../../assets/images/heart-images/full_heart.png";
import EmptyHeart from "../../../../assets/images/heart-images/empty_heart.png";
import { useEffect } from "react";
import { formStoreActions } from "../../../../store/form-store";
const LivesTrackerComponent = (): JSX.Element => {
  const activeLivesArray = useAppSelector(
    (state) => state.formRacing.activeLifesArray
  );
  const activeLifesArrayDecreased = useAppSelector(
    (state) => state.formRacing.activeLifesArrayDecreased
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (activeLifesArrayDecreased) {
      const flashLifesContainerTimeout = setTimeout(() => {
        dispatch(formStoreActions.setActiveLifesArrayDecreased(false));
      }, 3000);

      return () => {
        clearTimeout(flashLifesContainerTimeout);
      };
    }
  }, [dispatch, activeLifesArrayDecreased]);

  return (
    <div
      className={`${classes.livesTrackerContainer} ${
        activeLifesArrayDecreased && classes.lifesContainerFlash
      }`}
    >
      <span className={classes.livesLabel}>Lives</span>
      {activeLivesArray.map((lifeActive: boolean, index: number) => {
        if (lifeActive) {
          return (
            <img
              src={FullHeart}
              alt="full life point heart"
              className={classes.heartImage}
              key={`full-heart-${index}`}
            />
          );
        } else {
          return (
            <img
              src={EmptyHeart}
              alt="empty life point heart"
              className={classes.heartImage}
              key={`empty-heart-${index}`}
            />
          );
        }
      })}
    </div>
  );
};
export default LivesTrackerComponent;
