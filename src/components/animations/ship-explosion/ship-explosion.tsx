import ShipExplosionPhaseOne from "../../../assets/images/ship-explosion/ship_explosion_phase_1.png";
import ShipExplosionPhaseTwo from "../../../assets/images/ship-explosion/ship_explosion_phase_2.png";
import ShipExplosionPhaseThree from "../../../assets/images/ship-explosion/ship_explosion_phase_3.png";
import ShipExplosionPhaseFour from "../../../assets/images/ship-explosion/ship_explosion_phase_4.png";
import { useState, useEffect } from "react";
import classes from "./ship-explosion.module.css";
const ShipExplosion = () => {
  const [activeShipExplosionPhase, setActiveShipExplosionPhase] = useState(1);

  useEffect(() => {
    if (activeShipExplosionPhase !== 4) {
      const changeShipImageTimeOut = setTimeout(() => {
        setActiveShipExplosionPhase(activeShipExplosionPhase + 1);
      }, 250);
      return () => {
        clearTimeout(changeShipImageTimeOut);
      };
    }
  }, [activeShipExplosionPhase]);

  return (
    <div className={classes.shipExplosionMainContainer}>
      <img
        src={ShipExplosionPhaseOne}
        alt="ship phase one"
        id={classes.shipPhaseOne}
        className={`${classes.shipPhoto} ${
          activeShipExplosionPhase === 1 && classes.shipImagePhasingOut
        }
        ${activeShipExplosionPhase > 1 && classes.shipImagePhasedOut}`}
      />
      <img
        src={ShipExplosionPhaseTwo}
        alt="ship phase two"
        id={classes.shipPhaseTwo}
        className={`${classes.shipPhoto} ${
          activeShipExplosionPhase === 2 && classes.shipImagePhasingOut
        } ${activeShipExplosionPhase > 2 && classes.shipImagePhasedOut}`}
      />
      <img
        src={ShipExplosionPhaseThree}
        alt="ship phase three"
        id={classes.shipPhaseThree}
        className={`${classes.shipPhoto} ${
          activeShipExplosionPhase === 3 && classes.shipImagePhasingOut
        } ${activeShipExplosionPhase > 3 && classes.shipImagePhasedOut}`}
      />
      <img
        src={ShipExplosionPhaseFour}
        alt="ship phase four"
        id={classes.shipPhaseFour}
        className={`${classes.shipPhoto} ${
          activeShipExplosionPhase === 4 && classes.shipImagePhasingOut
        } ${activeShipExplosionPhase > 4 && classes.shipImagePhasedOut}`}
      />
    </div>
  );
};
export default ShipExplosion;
