import sharedClasses from "../shared-popups-css.module.css";
import ChangeRacerWindow from "../../change-racer-window/change-racer-window";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useState, useCallback, useMemo } from "react";
import { ChangeEvent } from "react";
import { useAppDispatch } from "../../../store/typescript-hooks";
import { popupsStoreActions } from "../../../store/popups-store";
import DynamicLabelInput from "../components/dynamic-label-input/dynamic-label-input";
import { userInfoStoreActions } from "../../../store/user-info-store";
import ChangeWeaponWindow from "../../change-weapon-window/change-weapon-window";

type FormData = {
  [key: string]: any;
};

const SignupPopup = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const [signupFormData, setSignupFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [submitButtonActive, setSubmitButtonActive] = useState(false);
  const [selectedRacingShipNumber, setSelectedRacingShipNumber] = useState(0);
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0);
  const selectedWeaponExtractor = (activeWeaponNumber: number) => {
    setSelectedWeaponIndex(activeWeaponNumber);
  };

  const inputsValues = useMemo(() => {
    return [
      {
        id: "username-popup-username-input",
        errorMessage:
          "Username should be 3-16 characters and shouldn't include any special character!",
        label: "Username",
        inputProps: {
          name: "username",
          type: "text",
          placeholder: "",
          pattern: "^[A-Za-z0-9]{3,16}$",
          required: true,
          min: 3,
          max: 16,
        },
      },
      {
        id: "username-popup-password-input",
        errorMessage:
          "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
        label: "Password",

        inputProps: {
          name: "password",
          type: "password",
          placeholder: "",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true,
          min: 8,
          max: 20,
        },
      },
    ];
  }, []);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const targetEvent = e.target;

    if (targetEvent) {
      const notNullTarget = targetEvent as HTMLInputElement;
      setSignupFormData({
        ...signupFormData,
        [notNullTarget.name]: notNullTarget.value,
      });
    }
  };

  const submitButtonActiveHandler = useCallback(() => {
    if (
      signupFormData.username.length !== 0 &&
      signupFormData.password.length !== 0
    ) {
      const validInputsArray = inputsValues.map((data) => {
        const regToTest = new RegExp(`${data.inputProps.pattern}`);
        return !regToTest.test(signupFormData[data.inputProps.name]);
      });

      if (validInputsArray.includes(false)) {
        if (submitButtonActive) {
          setSubmitButtonActive(false);
        }
      } else {
        setSubmitButtonActive(true);
      }
    } else if (
      signupFormData.username.length !== 0 ||
      signupFormData.password.length !== 0
    ) {
      if (submitButtonActive) {
        setSubmitButtonActive(false);
      }
    }
  }, [submitButtonActive, inputsValues, signupFormData]);

  const closingButtonHandler = () => {
    dispatch(popupsStoreActions.setLockViewportActive(false));
    dispatch(popupsStoreActions.setSignupPopupActive(false));
  };

  useEffect(() => {
    submitButtonActiveHandler();
  }, [submitButtonActiveHandler]);

  const racingShipNumberExtractor = (selectedRacer: number) => {
    setSelectedRacingShipNumber(selectedRacer);
  };

  const submitButtonHandler = () => {
    dispatch(
      userInfoStoreActions.setUserSelectedRacerNumber(selectedRacingShipNumber)
    );
    dispatch(userInfoStoreActions.setActiveWeaponIndex(selectedWeaponIndex));
    dispatch(userInfoStoreActions.setUsername(signupFormData.username));
    closingButtonHandler();
  };

  return (
    <div className={sharedClasses.backdrop}>
      <form className={sharedClasses.popupMainContainer}>
        <button
          className={sharedClasses.closingPopupButton}
          onClick={closingButtonHandler}
        >
          <XMarkIcon className={sharedClasses.closingPopupButtonIcon} />
        </button>
        <p className={sharedClasses.popupTitle}>Signup</p>

        {inputsValues.map((inputData) => {
          return (
            <DynamicLabelInput
              label={inputData.label}
              errorMessage={inputData.errorMessage}
              onChange={inputChangeHandler}
              id={inputData.id}
              inputProps={inputData.inputProps}
              key={`${inputData.label}-top-component`}
            />
          );
        })}
        <ChangeWeaponWindow returnToParentFunction={selectedWeaponExtractor} />
        <ChangeRacerWindow
          racingShipNumberExtractor={racingShipNumberExtractor}
        />

        {submitButtonActive ? (
          <button
            className={sharedClasses.popupSubmitButton}
            onClick={submitButtonHandler}
          >
            Submit
          </button>
        ) : (
          <button className={sharedClasses.popupSubmitButtonDisabled} disabled>
            Submit
          </button>
        )}
      </form>
    </div>
  );
};
export default SignupPopup;
