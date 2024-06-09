import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import { Outlet } from "react-router-dom"
import { Action } from "../components/types";
import { ChatState } from "../components/types";

interface LoginProps {
  dispatch: React.Dispatch<Action>;
  state: ChatState;
}

const SharedLayout: React.FC<LoginProps> = ({ dispatch, state }) => {
  return <>
    <Navbar state={state} dispatch={dispatch} />
    <Outlet />
    <Footer />
  </>
}

export default SharedLayout