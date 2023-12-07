import { createSlice } from "@reduxjs/toolkit";

type ServerMessageData = {
  message: string;
  messageType: string;
};

type PopupState = {
  loginPopupActive: boolean;
  signupPopupActive: boolean;
  changeRacerPopupActive: boolean;
  lockViewportActive: boolean;
  gameSetupActive: boolean;
  serverMessagePopupActive: boolean;
  serverMessageData: ServerMessageData;
};
const initialState: PopupState = {
  loginPopupActive: false,
  signupPopupActive: false,
  changeRacerPopupActive: false,
  lockViewportActive: false,
  gameSetupActive: false,
  serverMessagePopupActive: false,
  serverMessageData: {
    message: "test",
    messageType: "success",
  },
};

export const popupsStoreSlice = createSlice({
  name: "Form Racer Store",
  initialState: initialState,
  reducers: {
    setLoginPopupActive(state, { payload }) {
      state.loginPopupActive = payload;
    },
    setSignupPopupActive(state, { payload }) {
      state.signupPopupActive = payload;
    },
    setChangeRacerPopupActive(state, { payload }) {
      state.changeRacerPopupActive = payload;
    },
    setLockViewportActive(state, { payload }) {
      state.lockViewportActive = payload;
    },
    setGameSetupActive(state, { payload }) {
      state.gameSetupActive = payload;
    },
    setServerMessagePopupActive(state, { payload }) {
      state.serverMessagePopupActive = payload;
    },
    setServerMessageData(state, { payload }) {
      state.serverMessageData = payload;
    },
  },
});

export const popupsStoreActions = popupsStoreSlice.actions;
