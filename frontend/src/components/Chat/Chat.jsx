import Navbar from "./components/UserNavbar/UserNavbar";
import MessageInput from "./components/MessageInput/MessageInput";
import MessageList from "./components/MessageList/MessageList";
import './Chat.css'
import { useEffect, useContext } from "react";
import WebSocketInstance from "./websocket";
import { Context } from "../../main";
import { observer } from "mobx-react-lite";


function Chat(props) {
  const {store} = useContext(Context);

  useEffect(() => {
    if (props.selectedContactId) {
      WebSocketInstance.connect('user_chat', props.selectedContactId);
    }
  }, [props.selectedContactId]);

  return (
    <div className="chat">
      { props.selectedContactId 
        &&
        <Navbar
          selectedContactId={props.selectedContactId}
        />
      }
      { props.selectedContactId 
        &&  <MessageList 
              key={props.selectedContactId}
              currentUser={store?.user?.id}
            />
      }
      { props.selectedContactId 
        &&  <MessageInput
              currentUser={store?.user?.id}
            />
      }
    </div>
  )
}

export default observer(Chat);