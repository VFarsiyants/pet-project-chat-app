import './SideMenu.css'
import SearchBar from './components/SearchBar/SearchBar';
import Contact from './components/Contact/Contact'


function SideMenu(props) {
  const contactEls = props.contacts.map(item => {
    const contactName = item.fullname && item.surname
      ? `${item.fullname} ${item.surname}`
      : item.email
    return <Contact
              contact={item}
              key={item.id}
              id={item.id}
              avatarImg={item.avatar_url}
              onSelectContact={props.selectContact}
              isSelected={item.id == props.selectedContact?.id ? true : false}
              iAmLastSender={item.iAmLastSender ? true : false}
              isSentRead={item.isSentRead ? true : false}
              contactName={contactName}
              lastMessage={item.last_message}
              unreadMessageCount={item.unread_message_count}
              isOnline={item.online_status ? true : false}
            />
  })

  return (
    <div className="side_menu">
      <SearchBar 
        openUserPnl={props.openUserPnl}
      />
      <div className='side_menu--contact-list'>
        {contactEls}
      </div>
    </div>
  )
}

export default SideMenu;