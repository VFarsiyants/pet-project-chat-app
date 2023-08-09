import './MessageInput.css'
import { ReactComponent as AttachBtn} from '../../../../images/icons/interface-edit-attachment-1--attachment-link-paperclip-unlink.svg'
import { ReactComponent as SendBtn} from '../../../../images/icons/send_fill.svg'

import { useEffect, useRef, useState } from 'react';
import WebSocketInstance from '../../websocket';


function MessageInput(props) {
  const [messageText, setMessageText] = useState('');
  const textareaRef = useRef(null);

  function handleMessageChange(event) {
    setMessageText(event.target.value);
  }

  function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
  }

  function handleMessageSent() {
    console.log('handleSent Called')
    if (messageText) {
      WebSocketInstance.newChatMessage({
        from: props.currentUser,
        content: messageText
      })
      setMessageText('');
    }
  }

  function handleKeyDown(event) {
    event.stopPropagation()
    console.log('handleSent via Enter Called')
    if (event.key === 'Enter') {
      handleMessageSent()
    }
  }

  useEffect(() => {
    auto_grow(textareaRef.current);
  }, [messageText])

  return (
    <div className='message-input'>
      <AttachBtn />
      <textarea
        ref={textareaRef}
        name="messageText"
        value={messageText}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        id="messageText"

      />
      <SendBtn onClick={handleMessageSent}/>
    </div>
  )
}

export default MessageInput;