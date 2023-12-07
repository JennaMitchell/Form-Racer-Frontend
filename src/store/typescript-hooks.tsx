import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./main-store";
export const useAppDispatch = () => useDispatch<AppDispatch>();
// this line is used to make the use dispatch and use selector type aware of what is in the store slices
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
