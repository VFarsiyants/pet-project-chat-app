import Navbar from "./components/UserNavbar/UserNavbar";
import MessageInput from "./components/MessageInput/MessageInput";
import MessageList from "./components/MessageList/MessageList";
import './Chat.css'
import { useContext } from "react";
import { Context } from "../../main";
import { observer } from "mobx-react-lite";


function Chat(props) {
  const {store} = useContext(Context);

  return (
    <div className="chat">
      { props.selectedContactId 
        &&
        <Navbar
          selectedContactId={props.selectedContact.id}
          selectedContact={props.selectedContact}
        />
      }
      { props.selectedContactId 
        &&  <MessageList 
              selectedContactId={props.selectedContact.id}
              key={props.selectedContactId}
              currentUser={store?.user?.id}
              selectedContact={props.selectedContact}
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