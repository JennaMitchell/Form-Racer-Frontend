import classes from "./change-weapon-window.module.css";
import WeaponFireOne from "../../assets/images/ship-weapon-fires/weapon_fire_1.png";
import WeaponFireTwo from "../../assets/images/ship-weapon-fires/weapon_fire_2.png";
import WeaponFireThree from "../../assets/images/ship-weapon-fires/weapon_fire_3.png";
import WeaponFireFour from "../../assets/images/ship-weapon-fires/weapon_fire_4.png";
import WeaponFireFive from "../../assets/images/ship-weapon-fires/weapon_fire_5.png";
import { useState, useMemo } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

type passedDownProps = {
  returnToParentFunction: (activeWeaponNumber: number) => void;
};

const ChangeWeaponWindow = ({
  returnToParentFunction,
}: passedDownProps): JSX.Element => {
  const [activeWeaponFireIndex, setActiveWeaponFireIndex] = useState(0);
  const weaponImageArray = useMemo(() => {
    return [
      WeaponFireOne,
      WeaponFireTwo,
      WeaponFireThree,
      WeaponFireFour,
      WeaponFireFive,
    ];
  }, []);

  const leftButtonClickHandler = () => {
    if (activeWeaponFireIndex === 0) {
      setActiveWeaponFireIndex(weaponImageArray.length - 1);
      returnToParentFunction(weaponImageArray.length - 1);
    } else {
      setActiveWeaponFireIndex(activeWeaponFireIndex - 1);
      returnToParentFunction(activeWeaponFireIndex - 1);
    }
  };
  const rightButtonClickHandler = () => {
    if (activeWeaponFireIndex === weaponImageArray.length - 1) {
      setActiveWeaponFireIndex(0);
      returnToParentFunction(0);
    } else {
      setActiveWeaponFireIndex(activeWeaponFireIndex + 1);
      returnToParentFunction(activeWeaponFireIndex + 1);
    }
  };

  const activeWeaponImage = weaponImageArray[activeWeaponFireIndex];

  return (
    <div className={classes.changeWeaponWindow}>
      <button
        className={classes.changeWeaponRightArrow}
        onClick={rightButtonClickHandler}
      >
        <ChevronRightIcon className={classes.arrowIcon} />
      </button>
      <button
        className={classes.changeWeaponLeftArrow}
        onClick={leftButtonClickHandler}
      >
        <ChevronLeftIcon className={classes.arrowIcon} />
      </button>

      <img
        src={activeWeaponImage}
        className={classes.weaponImage}
        alt={`weapon fire ${activeWeaponFireIndex}`}
      />
    </div>
  );
};
export default ChangeWeaponWindow;
