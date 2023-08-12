import { useEffect, useRef } from 'react';


function MessageFrom(props) {
  const observer = useRef()
  const el = useRef()

  useEffect(() => {
    const callback = (entries, observer) => {
      if(entries[0].isIntersecting && !props.messageRead) {
        props.createReadReceipt()
      }
    };
    observer.current = new IntersectionObserver(callback);
    observer.current.observe(el.current)
  }, [])

  return (
    <div className='message--from' ref={el}>
      <img 
        src={props.contactAvatar} 
        alt="Contact avatar" 
        className='message--from--avatar'/>
      <div className='message--from--text--wrapper'>
        <p className='message--from--text'>{props.messageText}</p>
        <p className='message--from--time'>{props.messageTime}</p>
      </div>
    </div>
  )
}

export default MessageFrom;