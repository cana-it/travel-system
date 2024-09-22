import { combineReducers } from "redux";
import MainActionReducer from "../Reducers/MainAction";
import CustomReducer from "./CustomReducer";
const rootReducer = combineReducers({
    MainAction: MainActionReducer,
    CustomAction: CustomReducer
});

export default rootReducer;
