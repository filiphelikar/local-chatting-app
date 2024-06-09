import "./Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { projectFirestore } from "../../firebase/config";
import { Action } from "../../components/types";
import { ChatState } from "../../components/types";

interface ChatProps {
  dispatch: React.Dispatch<Action>;
  state: ChatState;
};

const Home: React.FC<ChatProps> = ({ state }) => {
    const [chats, setChats] = useState<any>([]);
    const [message, setMessage] = useState("");
    const [nickName, setNickName] = useState("");
    const [users, setUsers] = useState([]);

      useEffect( () => {
        const unsubscribe = projectFirestore.collection("chats").onSnapshot( (snapshot) => {

          if (snapshot.empty) {
            console.log("databes empty")

            if (!state.user) {
              setMessage("přihlaš se!");
            }
            
          } else if (state.user) {
            const documentIds = snapshot.docs.map(doc => doc.id);
            setChats(documentIds.filter((oneChat) => oneChat.includes(state.user)));
          } else {
            setChats([]);
            setMessage("přihlaš se!");
          };
        });

        let result:any =[];
        const unsubscribe2 = projectFirestore.collection("users").onSnapshot( (snapshot) => {
            snapshot.docs.forEach( (oneUser) => {
              result.push({id: oneUser.id, ...oneUser.data()});
            });
            setUsers(result);
        }, (err) => {console.log(err.message)}) ;

        return () => {unsubscribe(); unsubscribe2()};
    
      }, [state]);

      const submitForm = (event:any) => {
        event.preventDefault();

        setUserDocument();
      };

      const setUserDocument = async () => {
        const user:any  = users.find((obj:any) => obj.nickName === nickName);
        if (user) {
            try {
            const docRef = projectFirestore.collection('chats').doc(state.user + "_" + nickName);
            await docRef.set({});
              await docRef.collection(state.user + "_" + nickName).add({});
              setNickName("");
            } catch (error) {
            console.error('Error writing document: ', error);
            }
        } else {
            alert("neexistujcí user");
        };
      };

  return (
    <>
      <div className="chat-container">
        <h3 className="chat-heading">{chats.length > 0 ? "" : "přidej si uživatele🙂"}</h3>
        <p>{chats.length > 0 ? "Chats:" : ""}</p>
        {chats.map((oneChat:any) => (
          <div key={oneChat} className="chat-item">
            <Link to={`/one-chat/${oneChat}`} className="chat-link">{oneChat}</Link>
          </div>
        ))}
        <Link to="/login" className="login-link">{message}</Link>
      </div>
      <div className="form-container">
        <form onSubmit={submitForm} className={state.user ? "home-form" : "hide"}>
          <input
            type="text"
            placeholder="NickName"
            onChange={(e) => setNickName(e.target.value)}
            value={nickName}
            className="input"
          />
          <input value="Find User" type="submit" className="submit-button" />
        </form>
      </div>
    </>
    
  )
};

export default Home