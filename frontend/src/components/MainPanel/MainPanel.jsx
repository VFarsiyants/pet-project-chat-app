import './MainPanel.css'
import { useState, useEffect, useContext } from 'react';
import SideMenu from '../SideMenu/SideMenu'
import Chat from '../Chat/Chat'
import ApiService from '../../services/ApiService'
import { WebSocketContactsInstance } from '../Chat/websocket';
import { Context } from '../../main';


function MainPanel(props) {
  const [selectedContact, setSelectedContact] = useState()
  const [userList, setUserList] = useState([]);
  const {store} = useContext(Context);

  useEffect(() => {
    async function fetchContacts() {
      const response = await ApiService.getContacts();
      setUserList(response.data);
    }
    fetchContacts();
  }, [])

  function updateUserOnline(onlineUserData) {
    setSelectedContact(prevContact => {
      if (onlineUserData.id == prevContact?.id) {
        return {
          ...prevContact,
          online_status: onlineUserData.online,
        }
      }
      return prevContact;
    })
    setUserList(prevUsers => {
      return prevUsers.map(item => {
        if (item.id == onlineUserData.id){
          return {
            ...item,
            online_status: onlineUserData.online,
          }
        }
        return item;
    })})
  }

  function updateLastMessage(messageData) {
    const contactId = messageData.author == store.user?.id 
      ? messageData.to_user 
      : messageData.author 
    setUserList(prevUsers => {
      return prevUsers.map(item => {
        if (item.id == contactId){
          return {
            ...item,
            unread_message_count: messageData.author != store.user?.id 
              ? item.unread_message_count + 1
              : item.unread_message_count,
            last_message: {
              'text': messageData.content,
              'timestamp': messageData.timestamp,
            }
          }
        }
        return item;
    })})
  }

  function updateUserUnreadMessageCount(messageData) {
    setUserList(prevUsers => {
      return prevUsers.map(item => {
        if (item.id == messageData.id){
          return {
            ...item,
            unread_message_count: messageData.unread_count,
          }
        }
        return item;
    })})
  }

  useEffect(() => {
    WebSocketContactsInstance.waitForSocketConnection();
    WebSocketContactsInstance.addCallbacks({
      change_user_online: updateUserOnline,
      change_user_message: updateLastMessage,
      update_user_unread_count: updateUserUnreadMessageCount,
    })
  }, [])

  return (
    <div className={`main-panel ${ props.isDeactive ? 'deactive' : '' }`}>
      <SideMenu 
        selectContact={(contact) => setSelectedContact(contact)}
        selectedContact={selectedContact}
        contacts={userList}
        openUserPnl={props.openUserPnl}
      />
      <Chat
        key={selectedContact?.id}
        selectedContactId={selectedContact?.id}
        selectedContact={selectedContact}
      />
    </div>
  )
}

export default MainPanel;
