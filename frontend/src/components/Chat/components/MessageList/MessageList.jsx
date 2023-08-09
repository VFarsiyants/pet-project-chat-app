import { useEffect, useRef, useState } from 'react';
import './MessageList.css'
import WebSocketInstance from '../../websocket';
import MessageFrom from './MessageFrom';
import MessageTo from './MessageTo';


function MessageList(props) {
  const ref = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [messages, setMessages] = useState([])
  
  function addMessage(message){
    setMessages(prevMessages => [...prevMessages, message])
  }

  useEffect(() => {
    WebSocketInstance.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        setMessages.bind(this), addMessage.bind(this)
      );
      WebSocketInstance.fetchMessages(props.currentUser);
    })
  }, []);

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
    ref.current.style.height = '';
    ref.current.style.justifyContent = '';
    if (ref.current.clientHeight == ref.current.scrollHeight) {
      ref.current.style.height = '100%';
      ref.current.style.justifyContent = 'end';
    }
  }, [windowWidth])

  function convertTime(datetimeStr) {
    return new Date(datetimeStr)
      .toLocaleTimeString('en-US',
        {hour12:true, hour:'numeric', minute:'numeric'}
      );
  }

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
          messageTime={convertTime(item.timestamp)}
        />
  )

  return (
    <div ref={ref} className='message-list'>
      {messagesDomEls}
    </div>
  )
}

export default MessageList;