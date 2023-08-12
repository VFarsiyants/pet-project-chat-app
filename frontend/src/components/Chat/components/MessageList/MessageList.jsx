import { useEffect, useRef, useState } from 'react';
import './MessageList.css'
import { WebSocketChatInstance, WebSocketContactsInstance } from '../../websocket';
import MessageFrom from './MessageFrom';
import MessageTo from './MessageTo';
import { convertTime } from '../../../../utils/utils';


function MessageList(props) {
  const ref = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [messages, setMessages] = useState([])

  function addMessage(socketData){
    setMessages(prevMessages => [...prevMessages, socketData.message])
  }

  useEffect(() => {
    WebSocketChatInstance.disconnect()
    WebSocketChatInstance.waitForSocketConnection(() => {
      WebSocketChatInstance.addCallbacks({
        messages: (socketData) => {setMessages(socketData.messages)},
        new_message: addMessage.bind(this)
      }
        // setMessages.bind(this), addMessage.bind(this)
      );
      WebSocketChatInstance.fetchMessages(props.currentUser);
    })
    WebSocketChatInstance.connect(`user_chat/${props.selectedContactId}`);
    WebSocketContactsInstance.waitForSocketConnection()
  }, []);

  function sendReadNotification(messageId) {
    WebSocketContactsInstance.sendMessage({
      command: 'update_user_unread_message',
      data: {
        messageId: messageId
      }
    })
  }

  useEffect(() => {
    function watchWidth() {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", watchWidth)
    return () => {
      window.removeEventListener("resize", watchWidth)
    }
  }, [])

  useEffect(() => {
    ref.current.style.justifyContent = '';
    if (ref.current.clientHeight == ref.current.scrollHeight) {
      ref.current.style.justifyContent = 'end';
    }
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages, windowWidth])

  const messagesDomEls = messages.map(item =>
    props.currentUser == item.author 
      ? <MessageTo
          key={item.id}
          messageText={item.content}
          messageTime={convertTime(item.timestamp)}
        />
      : <MessageFrom
          key={item.id}
          messageText={item.content}
          contactAvatar={props.selectedContact.avatar_url}
          messageTime={convertTime(item.timestamp)}
          messageRead={item.read}
          readObserverRef={ref}
          createReadReceipt={() => sendReadNotification(item.id)}
        />
  )

  return (
    <div ref={ref} className='message-list'>
      {messagesDomEls}
    </div>
  )
}

export default MessageList;