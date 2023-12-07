import { useState, useRef } from "react";
import { MouseEvent } from "react";
import sharedClasses from "../../shared-popups-css.module.css";
import classes from "./dynamic-label-input.module.css";
import { ChangeEvent } from "react";
type Props = {
  label: string;
  errorMessage: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  inputProps: InputProps;
};

type InputProps = {
  name: string;
  type: string;
  placeholder: string;
  pattern: string;
  required: boolean;
  min: number;
  max: number;
};

const DynamicLabelInput = ({
  label,
  errorMessage,
  onChange,
  id,
  inputProps,
}: Props): JSX.Element => {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [inputLabelMovedOut, setInputLabelMovedOut] = useState(false);
  const [errorMessageActive, setErrorMessageActive] = useState(false);
  const usernameInputClickElementsHandler = (
    event: MouseEvent<HTMLElement>
  ) => {
    const targetElement = event.currentTarget;
    const currentInputRef = inputRef.current;

    if (currentInputRef) {
      const inputRefNotNull = currentInputRef;
      if (targetElement.id.length === 0) {
        inputRefNotNull.focus();
      }

      if (inputRefNotNull.value.length !== 0 && !inputLabelMovedOut) {
        setInputLabelMovedOut(true);
      } else if (inputRefNotNull.value.length === 0 && !inputLabelMovedOut) {
        setInputLabelMovedOut(true);
      }
    }
  };
  const blurErrorHandler = () => {
    const currentInputRef = inputRef.current;

    if (currentInputRef) {
      const inputRefNotNull = currentInputRef;
      const regToTest = new RegExp(`${inputProps.pattern}`);
      const inputValue = inputRefNotNull.value;

      setErrorMessageActive(!regToTest.test(inputValue));
    }
  };

  return (
    <div
      className={sharedClasses.popupInputContainer}
      key={`${id}-${label}-input-container-key`}
    >
      <label
        className={`${classes.inputLabel}  ${sharedClasses.inputLabel}  ${
          inputLabelMovedOut && classes.labelMovedOut
        } `}
        htmlFor={id}
        onClick={usernameInputClickElementsHandler}
        key={`${id}-${label}-label-key`}
      >
        {label}
      </label>
      <input
        {...inputProps}
        className={sharedClasses.popupInput}
        id={id}
        maxLength={10}
        ref={inputRef}
        onClick={usernameInputClickElementsHandler}
        onChange={onChange}
        onBlur={blurErrorHandler}
        key={`${id}-${label}-input-key`}
      />
      {errorMessageActive && (
        <span
          className={sharedClasses.inputErrorMessage}
          key={`${id}-${label}-span-key`}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
export default DynamicLabelInput;
