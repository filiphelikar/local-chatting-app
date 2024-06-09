import "./Onechat.css"
import { projectFirestore } from "../../firebase/config"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Action } from "../../components/types";
import { ChatState } from "../../components/types";


interface LoginProps {
  dispatch: React.Dispatch<Action>;
  state: ChatState;
};

const Onechat: React.FC<LoginProps> = ({ state }) => {
  const [data, setData] = useState<any>([]);
  const { chatId }:any = useParams();
  const [message, setMessage] = useState("");

  useEffect( () => {
    const  unsubscribe  =  projectFirestore.collection("chats").doc(chatId).collection(chatId).onSnapshot( (snapshot)  => {
        if (!snapshot.empty) {
          let result:any = [];

          snapshot.docs.filter( (oneChat) => {
            const chatData = oneChat.data();

            if (!(Object.keys(chatData).length === 0)) {
             result.push({ id: oneChat.id, ...chatData });
            };

            return result;
          });
          setData(result.sort((a: any, b: any) => {
            const aTimeKey = Object.keys(a).find(key => !isNaN(Number(key)));
            const bTimeKey = Object.keys(b).find(key => !isNaN(Number(key)));
          
            const aTime = aTimeKey ? Number(aTimeKey) : 0;
            const bTime = bTimeKey ? Number(bTimeKey) : 0;
          
            return aTime - bTime;
          }))
        };
      });
    return () => unsubscribe();
  }, [chatId]);

  const submitForm = (event:any) => {
    event.preventDefault();
    const date = new Date().toString().split("G");
    const dateMs = new Date().getTime().toString();

    const newMessage = {
      [state.user]: message,
      [dateMs]: date[0]
    };

    if (state.user) {
      sendNewMessage(newMessage);
    } else {
      setMessage("");
      alert("přihlaš se!");
    };
    
  };

  const sendNewMessage = async (newMessage:any) => {
   await projectFirestore.collection("chats").doc(chatId).collection(chatId).add(newMessage);
   setMessage("");
  };

  return (
    <section className="messages-section">
      <div className="messages-container">
      {data.map((item: any) => {
        const { id, ...rest } = item;
        const user = Object.keys(rest).find(key => isNaN(Number(key)) && key !== 'date');
        const message = user ? rest[user] : "";
        const dateKey = Object.keys(rest).find(key => !isNaN(Number(key)));
        const date = dateKey ? rest[dateKey] : "";

        return (
          <div key={id} className="message-item">
            <p className="user-name">{user}</p>
            <p className="message-time">{date}</p>
            <p className="user-message">{message}</p>
          </div>
        );
      })}
      </div>
      <form onSubmit={submitForm} className="message-form">
        <input
          type="text"
          placeholder="Aa"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          className="input"
        />
        <input value="Odeslat" type="submit" className="submit-button" />
      </form>
    </section>
  )
}

export default Onechat