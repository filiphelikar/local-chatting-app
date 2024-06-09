import { Action, ChatState } from "./types";

const savedUser = localStorage.getItem("user");
export const initialState: ChatState = { user: savedUser ? savedUser : "" };

export const chatReducer = (state: ChatState, action: Action): ChatState => {
  switch (action.type) {
    case "ADD_USER":
      localStorage.setItem("user", action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case "LOG_OUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: "",
      };
    default:
      return state;
  }
};
