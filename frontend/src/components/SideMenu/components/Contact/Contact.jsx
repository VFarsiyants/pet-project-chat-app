import Avatar from "../../../Avatar/Avatar";
import './Contact.css'

import { ReactComponent as DoneRoundImg } from '../../../../images/icons/done_round_light.svg';
import { ReactComponent as DoneAllAltRoundImg } from '../../../../images/icons/done_all_alt_round_light.svg';


function Contact (
  {
    id,
    isSelected, 
    isSentRead, 
    contactName, 
    iAmLastSender,
    lastMessageTime,
    lastMessageText,
    unreadMessageCount,
    isOnline,
    onSelectContact
  }) {

  const doneImgEl = isSentRead
    ? <DoneAllAltRoundImg
      stroke={
        isSelected ? '#FFF': '#2B6CB0'}
      className="contact_message_sent"
    />
    : <DoneRoundImg 
      stroke={
        isSelected ? '#FFF': '#2B6CB0'}
      className="contact_message_sent"
    />

  return (
    <div 
      className={`contact ${isSelected ? "selected": ""}`}
      onClick={() => onSelectContact(id)}
    >
      <Avatar isOnline={isOnline}/>
      <div className="contact--info">
        <div className={
            `contact--name_time ${isSelected ? "selected": ""}`}>
          <p className="contact--name">{contactName}</p>
          {iAmLastSender && doneImgEl}
          <p className={
            `contact--message_time ${isSelected ? "selected": ""}`}
          >
            {lastMessageTime}
          </p>
        </div>
        <div className="contact--message">
          <p className={
              `contact--message-text ${isSelected ? "selected": ""}`}>
            {lastMessageText}</p>
          <p className={
            `contact--message_unread ${isSelected ? "selected": ""}`}
          >
            {unreadMessageCount}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact;