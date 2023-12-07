import { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "../../../store/typescript-hooks";
import classes from "./scrolling-star-background.module.css";

const ScrollingStarBackground = () => {
  const backgroundScrollContainerZero = useRef<HTMLDivElement | null>(null);
  const backgroundScrollContainerOne = useRef<HTMLDivElement | null>(null);
  const backgroundScrollContainerTwo = useRef<HTMLDivElement | null>(null);

  const backgroundSpeed = useAppSelector(
    (state) => state.userInfo.backgroundSpeed
  );
  const intervalToMove = backgroundSpeed * 2.5;

  const [viewportHeight, viewportHeightTimesTwo] = useMemo(() => {
    return [window.innerHeight, window.innerHeight * 2];
  }, []);

  useEffect(() => {
    if (
      backgroundScrollContainerZero.current &&
      backgroundScrollContainerOne.current &&
      backgroundScrollContainerTwo.current
    ) {
      backgroundScrollContainerZero.current.style.top = `-${viewportHeight}px`;
      backgroundScrollContainerOne.current.style.top = `${0}px`;
      backgroundScrollContainerTwo.current.style.top = `${viewportHeight}px`;
    }
  }, [viewportHeight]);

  useEffect(() => {
    const downwardMovementInterval = setInterval(() => {
      if (
        backgroundScrollContainerZero.current &&
        backgroundScrollContainerOne.current &&
        backgroundScrollContainerTwo.current
      ) {
        let numberizedZeroTopPositionString =
          backgroundScrollContainerZero.current.style.top;

        numberizedZeroTopPositionString = numberizedZeroTopPositionString.slice(
          0,
          numberizedZeroTopPositionString.length - 2
        );

        const numberizedZeroTopPosition = +numberizedZeroTopPositionString;

        const numberizedOneTopPosition =
          +backgroundScrollContainerOne.current.style.top.slice(
            0,
            backgroundScrollContainerOne.current.style.top.length - 2
          );
        const numberizedTwoTopPosition =
          +backgroundScrollContainerTwo.current.style.top.slice(
            0,
            backgroundScrollContainerTwo.current.style.top.length - 2
          );

        const newBackgroundImageZeroTopPosition =
          numberizedZeroTopPosition + intervalToMove;
        const newBackgroundImageOneTopPosition =
          numberizedOneTopPosition + intervalToMove;
        const newBackgroundImageTwoTopPosition =
          numberizedTwoTopPosition + intervalToMove;

        backgroundScrollContainerZero.current.style.top =
          newBackgroundImageZeroTopPosition >= viewportHeightTimesTwo
            ? `-${viewportHeight}px`
            : `${numberizedZeroTopPosition + intervalToMove}px`;

        newBackgroundImageZeroTopPosition >= viewportHeightTimesTwo
          ? (backgroundScrollContainerZero.current.style.transition = "all 0s")
          : (backgroundScrollContainerZero.current.style.transition =
              "all 0.1s");
        newBackgroundImageZeroTopPosition >= viewportHeightTimesTwo
          ? (backgroundScrollContainerZero.current.style.visibility = "hidden")
          : (backgroundScrollContainerZero.current.style.visibility =
              "visible");
        // transition: all 0s;

        // visibility: hidden;

        backgroundScrollContainerOne.current.style.top =
          newBackgroundImageOneTopPosition >= viewportHeightTimesTwo
            ? `-${viewportHeight}px`
            : `${numberizedOneTopPosition + intervalToMove}px`;

        newBackgroundImageOneTopPosition >= viewportHeightTimesTwo
          ? (backgroundScrollContainerOne.current.style.transition = "all 0s")
          : (backgroundScrollContainerOne.current.style.transition =
              "all 0.1s");
        newBackgroundImageOneTopPosition >= viewportHeightTimesTwo
          ? (backgroundScrollContainerOne.current.style.visibility = "hidden")
          : (backgroundScrollContainerOne.current.style.visibility = "visible");
        backgroundScrollContainerTwo.current.style.top =
          newBackgroundImageTwoTopPosition >= viewportHeightTimesTwo
            ? `-${viewportHeight}px`
            : `${numberizedTwoTopPosition + intervalToMove}px`;

        newBackgroundImageTwoTopPosition >= viewportHeightTimesTwo
          ? (backgroundScrollContainerTwo.current.style.transition = "all 0s")
          : (backgroundScrollContainerTwo.current.style.transition =
              "all 0.1s");
        newBackgroundImageTwoTopPosition >= viewportHeightTimesTwo
          ? (backgroundScrollContainerTwo.current.style.visibility = "hidden")
          : (backgroundScrollContainerTwo.current.style.visibility = "visible");
      }
    }, 100);

    return () => {
      clearInterval(downwardMovementInterval);
    };
  }, [viewportHeight, viewportHeightTimesTwo, intervalToMove]);

  return (
    <>
      <div
        className={`${classes.backgroundScroll}`}
        id={`${classes.backgroundScrollImageZero}`}
        key="background-scroll-image-1-key"
        ref={backgroundScrollContainerZero}
      />
      <div
        className={`${classes.backgroundScroll}  `}
        id={`${classes.backgroundScrollImageOne}`}
        key="background-scroll-image-2-key"
        ref={backgroundScrollContainerOne}
      />
      <div
        className={`${classes.backgroundScroll}`}
        id={`${classes.backgroundScrollImageTwo}`}
        key="background-scroll-image-3-key"
        ref={backgroundScrollContainerTwo}
      />
    </>
  );
};
export default ScrollingStarBackground;
