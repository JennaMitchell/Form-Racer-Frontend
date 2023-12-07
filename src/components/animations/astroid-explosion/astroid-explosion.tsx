import AstroidExplosionPhaseOne from "../../../assets/images/astroid-explosion/astroid_explosion_phase_1.png";
import AstroidExplosionPhaseTwo from "../../../assets/images/astroid-explosion/astroid_explosion_phase_2.png";
import AstroidExplosionPhaseThree from "../../../assets/images/astroid-explosion/astroid_explosion_phase_3.png";
import AstroidExplosionPhaseFour from "../../../assets/images/astroid-explosion/astroid_explosion_phase_4.png";
import classes from "./astroid-explosion.module.css";
import { useEffect, useState } from "react";
import { formStoreActions } from "../../../store/form-store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/typescript-hooks";
const AstroidExplosion = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [activeAstroidExplosionPhase, setActiveAstroidExplosionPhase] =
    useState(1);

  const astroidDestroyed = useAppSelector(
    (state) => state.formRacing.astroidDestroyed
  );

  const astroidExplosionTriggered = useAppSelector(
    (state) => state.formRacing.astroidExplosionTriggered
  );

  useEffect(() => {
    if (
      activeAstroidExplosionPhase !== 4 &&
      !astroidDestroyed &&
      astroidExplosionTriggered
    ) {
      const changeAstroidImageTimeOut = setTimeout(() => {
        setActiveAstroidExplosionPhase(activeAstroidExplosionPhase + 1);
      }, 500);
      return () => {
        clearTimeout(changeAstroidImageTimeOut);
      };
    } else if (
      !astroidDestroyed &&
      activeAstroidExplosionPhase === 4 &&
      astroidExplosionTriggered
    ) {
      dispatch(formStoreActions.setAstroidDestroyed(true));
      setActiveAstroidExplosionPhase(1);
    }
  }, [
    activeAstroidExplosionPhase,
    dispatch,
    astroidDestroyed,
    astroidExplosionTriggered,
  ]);

  return (
    <div className={classes.astroidExplosionMainContainer}>
      <img
        src={AstroidExplosionPhaseOne}
        alt="astroid phase one"
        className={`${classes.astroidPhoto} ${
          activeAstroidExplosionPhase === 1 && classes.astroidImagePhasingOut
        }
        ${activeAstroidExplosionPhase > 1 && classes.astroidImagePhasedOut}`}
      />
      <img
        src={AstroidExplosionPhaseTwo}
        alt="astroid phase two"
        className={`${classes.astroidPhoto} ${
          activeAstroidExplosionPhase === 2 && classes.astroidImagePhasingOut
        } ${activeAstroidExplosionPhase > 2 && classes.astroidImagePhasedOut}`}
      />
      <img
        src={AstroidExplosionPhaseThree}
        alt="astroid phase three"
        className={`${classes.astroidPhoto} ${
          activeAstroidExplosionPhase === 3 && classes.astroidImagePhasingOut
        } ${activeAstroidExplosionPhase > 3 && classes.astroidImagePhasedOut}`}
      />
      <img
        src={AstroidExplosionPhaseFour}
        alt="astroid phase four"
        className={`${classes.astroidPhoto} ${
          activeAstroidExplosionPhase === 4 && classes.astroidImagePhasingOut
        } ${activeAstroidExplosionPhase > 4 && classes.astroidImagePhasedOut}`}
      />
    </div>
  );
};
export default AstroidExplosion;
