import "./Navbar.css"
import { NavLink } from "react-router-dom"
import { Action } from "../types";
import { ChatState } from "../types";



interface LoginProps {
  dispatch: React.Dispatch<Action>;
  state: ChatState;
}

const Navbar: React.FC<LoginProps> = ({ dispatch, state }) => {

  return (
    <header>
      <nav className="navbar">
        <NavLink to="/" className="nav-link">Domů</NavLink>
        <NavLink to="/login" className="nav-link">Login</NavLink>
        {state.user && (
          <div className="user-section">
            <h3 className="user">{state.user}</h3>
            <button className="logout-button" onClick={() => dispatch({ type: "LOG_OUT" })}>Odhlásit se</button>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar