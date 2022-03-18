import { combineReducers } from "redux";
import AuthenReducer from "./reducers/AuthenReducer";

const AllReducers = combineReducers({
    authen: AuthenReducer
})


export default AllReducers