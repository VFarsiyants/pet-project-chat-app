import './SideMenu.css'
import SearchBar from './components/SearchBar/SearchBar';
import Contact from './components/Contact/Contact'
import ApiService from '../../services/ApiService'
import { useEffect, useState } from 'react';


function SideMenu(props) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      const response = await ApiService.getContacts();
      setUserList(response.data)
    }
    fetchContacts();
  }, [])

  const contactEls = userList.map(item => {
    const contactName = item.fullname && item.surname
      ? `${item.fullname} ${item.surname}`
      : item.email
    return <Contact
              key={item.id}
              id={item.id}
              onSelectContact={props.selectContact}
              isSelected={item.id == props.selectedContactId ? true : false}
              iAmLastSender={item.iAmLastSender ? true : false}
              isSentRead={item.isSentRead ? true : false}
              contactName={contactName}
              lastMessageTime={item.lastMessageTime}
              lastMessageText={item.lastMessageText}
              unreadMessageCount={item.unreadMessageCount}
              isOnline={item.isOnline ? true : false}
            />
  })

  return (
    <div className="side_menu">
      <SearchBar />
      <div className='side_menu--contact-list'>
        {contactEls}
      </div>
    </div>
  )
}

export default SideMenu;