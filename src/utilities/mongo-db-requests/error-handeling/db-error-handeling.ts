import { popupsStoreActions } from "../../../store/popups-store";

export const dbErrorHandeling = (errorMessage: string, dispatch: any) => {
  dispatch(popupsStoreActions.setServerMessagePopupActive(true));
  dispatch(
    popupsStoreActions.setServerMessageData({
      messageType: "error",
      message: errorMessage,
    })
  );
};
