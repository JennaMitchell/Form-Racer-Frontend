import { configureStore } from "@reduxjs/toolkit";
import { formStoreSlice } from "./form-store";
import { popupsStoreSlice } from "./popups-store";
import { userInfoStoreSlice } from "./user-info-store";
const store = configureStore({
  reducer: {
    formRacing: formStoreSlice.reducer,
    popups: popupsStoreSlice.reducer,
    userInfo: userInfoStoreSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
// used to set it so our usestate perfectly match what is in the store
export type AppDispatch = typeof store.dispatch;
// dispatch is used to type or dispatch actions

export default store;
