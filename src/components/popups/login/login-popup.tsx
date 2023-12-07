import sharedClasses from "../shared-popups-css.module.css";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useState, useCallback, useMemo } from "react";
import { ChangeEvent } from "react";
import { useAppDispatch } from "../../../store/typescript-hooks";
import { popupsStoreActions } from "../../../store/popups-store";
import DynamicLabelInput from "../components/dynamic-label-input/dynamic-label-input";

type FormData = {
  [key: string]: any;
};

const LoginPopup = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const inputsValues = useMemo(() => {
    return [
      {
        id: "login-popup-username-input",
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
        id: "login-popup-password-input",
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
  const [loginFormData, setLoginFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [submitButtonActive, setSubmitButtonActive] = useState(false);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const targetEvent = e.target;

    if (targetEvent) {
      const notNullTarget = targetEvent as HTMLInputElement;
      setLoginFormData({
        ...loginFormData,
        [notNullTarget.name]: notNullTarget.value,
      });
    }
  };

  const submitButtonActiveHandler = useCallback(() => {
    if (
      loginFormData.username.length !== 0 &&
      loginFormData.password.length !== 0
    ) {
      const validInputsArray = inputsValues.map((data) => {
        const regToTest = new RegExp(`${data.inputProps.pattern}`);
        return !regToTest.test(loginFormData[data.inputProps.name]);
      });

      if (validInputsArray.includes(false)) {
        setSubmitButtonActive(false);
      } else {
        setSubmitButtonActive(true);
      }
    } else if (
      loginFormData.username.length !== 0 ||
      loginFormData.password.length !== 0
    ) {
      if (submitButtonActive) {
        setSubmitButtonActive(false);
      }
    }
  }, [submitButtonActive, inputsValues, loginFormData]);

  const closingButtonHandler = () => {
    dispatch(popupsStoreActions.setLockViewportActive(false));
    dispatch(popupsStoreActions.setLoginPopupActive(false));
  };

  useEffect(() => {
    submitButtonActiveHandler();
  }, [submitButtonActiveHandler]);
  return (
    <div className={sharedClasses.backdrop} key="login-popup-backdrop">
      <form className={sharedClasses.popupMainContainer}>
        <button
          className={sharedClasses.closingPopupButton}
          onClick={closingButtonHandler}
        >
          <XMarkIcon className={sharedClasses.closingPopupButtonIcon} />
        </button>

        <p className={sharedClasses.popupTitle}>Login</p>

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

        {submitButtonActive ? (
          <button
            className={sharedClasses.popupSubmitButton}
            onClick={closingButtonHandler}
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
export default LoginPopup;
