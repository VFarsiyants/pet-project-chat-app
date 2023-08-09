function MessageTo(props) {
  return (
    <div className='message--to'>
      <p className='message--to--text'>{props.messageText}</p>
      <p className='message--to--time'>{props.messageTime}</p>
    </div>
  )
}

export default MessageTo;