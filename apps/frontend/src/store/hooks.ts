import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
