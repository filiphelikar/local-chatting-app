import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useReducer } from 'react';
import { chatReducer, initialState } from "./components/chatReducer";
import SharedLayout from "./pages/SharedLayout"
import Onechat from "./pages/Onechat/Onechat"
import Login from "./pages/Login/Login"
import Home from "./pages/Home/Home"

const App = () => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  return (
    <BrowserRouter>   
    <Routes>

      <Route path="/" element={ <SharedLayout state={state} dispatch={dispatch} /> }>
      <Route index element={ <Home state={state} dispatch={dispatch}/> }/>
        <Route path="/one-chat/:chatId" element={ <Onechat state={state} dispatch={dispatch} /> }/>
        <Route path="/login" element={ <Login state={state} dispatch={dispatch} /> }/>
      </Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App