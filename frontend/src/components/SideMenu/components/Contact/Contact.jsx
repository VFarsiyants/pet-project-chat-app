import Avatar from "../../../Avatar/Avatar";
import './Contact.css'
import { convertTime } from "../../../../utils/utils";

import { ReactComponent as DoneRoundImg } from '../../../../images/icons/done_round_light.svg';
import { ReactComponent as DoneAllAltRoundImg } from '../../../../images/icons/done_all_alt_round_light.svg';


function Contact (
  {
    isSelected, 
    isSentRead, 
    contactName, 
    iAmLastSender,
    lastMessage,
    unreadMessageCount,
    isOnline,
    onSelectContact,
    avatarImg,
    contact,
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
      onClick={() => {onSelectContact(contact)}}
    >
      <Avatar 
        isOnline={isOnline}
        avatarImg={avatarImg}
      />
      <div className="contact--info">
        <div className={
            `contact--name_time ${isSelected ? "selected": ""}`}>
          <p className="contact--name">{contactName}</p>
          {iAmLastSender && doneImgEl}
          <p className={
            `contact--message_time ${isSelected ? "selected": ""}`}
          >
            {lastMessage ? convertTime(lastMessage.timestamp) : ''}
          </p>
        </div>
        <div className="contact--message">
          <p className={
              `contact--message-text ${isSelected ? "selected": ""}`}>
            {lastMessage?.text}</p>
          <p className={
            `contact--message_unread ${isSelected ? "selected": ""}`}
          >
            {unreadMessageCount ? unreadMessageCount : undefined}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact;