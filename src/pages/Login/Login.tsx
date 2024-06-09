import "./Login.css"
import { useState, useEffect } from "react"
import { projectFirestore } from "../../firebase/config"
import { Action } from "../../components/types";
import { ChatState } from "../../components/types";

interface ChatProps {
    dispatch: React.Dispatch<Action>;
    state: ChatState;
  }

const Login: React.FC<ChatProps> = ({ dispatch }) => {
    const [nickName, setNickName] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);

    useEffect( () => {
        let result:any =[]
        const unsubscribe = projectFirestore.collection("users").onSnapshot( (snapshot) => {
            snapshot.docs.forEach( (oneUser) => {
              result.push({id: oneUser.id, ...oneUser.data()})
            });
            setUsers(result)
        }, (err) => {console.log(err.message)}) 
        return () => unsubscribe()
      }, []);

    const submitForm = (event:any) => {
        event.preventDefault()

        const user:any  = users.find((obj:any) => obj.nickName === nickName);

        if (user) {
          if (user.password === password) {
            dispatch({ type: "ADD_USER", payload: nickName });
            setNickName("");
            setPassword("");
          } else {
            alert('Špatně zadané heslo');
            setPassword("");
          }
        } else {
          dispatch({ type: "ADD_USER", payload: nickName });
          alert('Uživatel přidán');
          sendUser(); 
        }
    };
        
        const sendUser = async () => {
            const newUser = { nickName, password }
            try {
                await projectFirestore.collection("users").add(newUser)
                setNickName("")
                setPassword("")
            } catch (err:any) {
            console.log(err.message)
            }  
    }

  return (
    <section className="form-section">
        <h1 className="form-heading">Login/Registration</h1>
        <form onSubmit={submitForm} className="login-form">
            <input
             type="text" 
             placeholder="NickName"
             onChange={ (e) => setNickName(e.target.value) }
             value={nickName}
             className="input"
             required
             />
             <input
             className="input"
             type="password" 
             placeholder="password"
             min="1"
             onChange={(e) => setPassword(e.target.value)}
             value={password}
             required
             />
             <input value="Login" type="submit" className="submit-button" />
        </form>
        <div className="warning-message">
          <p>dont use real password!</p>
        </div>
    </section>
  )
}

export default Login