import ShipMissilesOne from "../../../assets/images/ship-weapon-fires/weapon_fire_1.png";
import ShipMissilesTwo from "../../../assets/images/ship-weapon-fires/weapon_fire_2.png";
import ShipMissilesThree from "../../../assets/images/ship-weapon-fires/weapon_fire_3.png";
import ShipMissilesFour from "../../../assets/images/ship-weapon-fires/weapon_fire_4.png";
import ShipMissilesFive from "../../../assets/images/ship-weapon-fires/weapon_fire_5.png";
import { useAppSelector } from "../../../store/typescript-hooks";
import { useMemo } from "react";
import classes from "./ship-missles-animation.module.css";
type propsFromParents = {
  fireShipMissle: boolean;
};
const ShipMissilesAnimation = ({
  fireShipMissle,
}: propsFromParents): JSX.Element => {
  const weaponMissilesArray = useMemo(() => {
    return [
      ShipMissilesOne,
      ShipMissilesTwo,
      ShipMissilesThree,
      ShipMissilesFour,
      ShipMissilesFive,
    ];
  }, []);

  const activeWeaponIndex = useAppSelector(
    (state) => state.userInfo.activeWeaponIndex
  );
  const weaponFireDestroyedAstroid = useAppSelector(
    (state) => state.formRacing.weaponFireDestroyedAstroid
  );
  return (
    <img
      src={weaponMissilesArray[activeWeaponIndex]}
      alt={`weapon fire ${activeWeaponIndex}`}
      className={`${classes.shipMissileImage} ${
        fireShipMissle && classes.fireShipMissle
      } ${weaponFireDestroyedAstroid && classes.hideWeapons}`}
      id="fired_weapons_image"
    />
  );
};
export default ShipMissilesAnimation;
