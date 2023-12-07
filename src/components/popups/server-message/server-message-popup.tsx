import classes from "./server-message-popup.module.css";

import { useAppDispatch } from "../../../store/typescript-hooks";
import { popupsStoreActions } from "../../../store/popups-store";
import sharedClasses from "../shared-popups-css.module.css";
type Props = {
  messageType: string;
  message: string;
};

const ServerMessagePopup = ({ messageType, message }: Props) => {
  const dispatch = useAppDispatch();

  const closingButtonClickHandler = () => {
    dispatch(
      popupsStoreActions.setServerMessageData({ messageType: "", message: "" })
    );
    dispatch(popupsStoreActions.setServerMessagePopupActive(false));
  };

  return (
    <div
      className={`${classes.serverMessageContainer}  ${
        messageType === "error" && classes.errorMessage
      }`}
    >
      <p>{message}</p>
      <button
        onClick={closingButtonClickHandler}
        className={sharedClasses.closingPopupButton}
      >
        X
      </button>
    </div>
  );
};
export default ServerMessagePopup;
