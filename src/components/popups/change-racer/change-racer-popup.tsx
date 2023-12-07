import sharedClasses from "../shared-popups-css.module.css";
import { useAppDispatch } from "../../../store/typescript-hooks";
import { popupsStoreActions } from "../../../store/popups-store";
import ChangeRacerWindow from "../../change-racer-window/change-racer-window";
import { useState } from "react";
import { userInfoStoreActions } from "../../../store/user-info-store";
import ChangeWeaponWindow from "../../change-weapon-window/change-weapon-window";
const ChangeRacerPopup = (): JSX.Element => {
  const [selectedRacingShipNumber, setSelectedRacingShipNumber] = useState(0);
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0);

  const dispatch = useAppDispatch();

  const closingButtonHandler = () => {
    dispatch(popupsStoreActions.setLockViewportActive(false));
    dispatch(popupsStoreActions.setChangeRacerPopupActive(false));
  };
  const racingShipNumberExtractor = (selectedRacer: number) => {
    setSelectedRacingShipNumber(selectedRacer);
  };
  const selectedWeaponExtractor = (activeWeaponNumber: number) => {
    setSelectedWeaponIndex(activeWeaponNumber);
  };

  const submitButtonHandler = () => {
    dispatch(
      userInfoStoreActions.setUserSelectedRacerNumber(selectedRacingShipNumber)
    );
    dispatch(userInfoStoreActions.setActiveWeaponIndex(selectedWeaponIndex));
    closingButtonHandler();
  };

  return (
    <div className={sharedClasses.backdrop}>
      <div className={sharedClasses.popupMainContainer}>
        <button
          className={sharedClasses.closingPopupButton}
          onClick={closingButtonHandler}
        >
          X
        </button>

        <p className={sharedClasses.popupTitle}>Racer </p>
        <p className={sharedClasses.popupTitle}>Select</p>
        <ChangeWeaponWindow returnToParentFunction={selectedWeaponExtractor} />
        <ChangeRacerWindow
          racingShipNumberExtractor={racingShipNumberExtractor}
        />

        <button
          className={sharedClasses.popupSubmitButton}
          onClick={submitButtonHandler}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default ChangeRacerPopup;
