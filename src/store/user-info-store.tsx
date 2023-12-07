import { createSlice } from "@reduxjs/toolkit";

export type GameSettingsType = {
  difficulty: string;
  numberOfQuestions: number;
  selectedQuestionTypes: string[];
  timePerQuestionInSeconds: number;
};

interface State {
  userSelectedRacerNumber: number;
  movingBackgroundActive: boolean;
  backgroundSpeed: number;
  username: string;
  gameSettings: GameSettingsType;
  activeWeaponIndex: number;
}
const initialState: State = {
  userSelectedRacerNumber: 4,
  movingBackgroundActive: true,
  backgroundSpeed: 4,
  username: "",
  gameSettings: {
    difficulty: "easy",
    numberOfQuestions: 5,
    selectedQuestionTypes: ["inputs"],
    timePerQuestionInSeconds: 30,
  },
  activeWeaponIndex: 0,
};

export const userInfoStoreSlice = createSlice({
  name: "Form Racer User Info Store",
  initialState: initialState,
  reducers: {
    setUserSelectedRacerNumber(state, { payload }) {
      state.userSelectedRacerNumber = payload;
    },
    setMovingBackgoundActive(state, { payload }) {
      state.movingBackgroundActive = payload;
    },
    setBackgroundSpeed(state, { payload }) {
      state.backgroundSpeed = payload;
    },
    setUsername(state, { payload }) {
      state.username = payload;
    },
    setGameSettings(state, { payload }) {
      state.gameSettings = payload;
    },
    setActiveWeaponIndex(state, { payload }) {
      state.activeWeaponIndex = payload;
    },
  },
});

export const userInfoStoreActions = userInfoStoreSlice.actions;
