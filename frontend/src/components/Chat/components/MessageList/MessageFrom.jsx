import avatar from '../../../../images/avatar-2.webp'


function MessageFrom(props) {
  return (
    <div className='message--from'>
      <img 
        src={avatar} 
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