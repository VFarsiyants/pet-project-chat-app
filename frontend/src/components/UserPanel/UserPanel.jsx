import './UserPanel.css'
import UserPanelListItem from './UserPanelListItem/UserPanelListItem';
import { useContext, useState, useRef } from 'react';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import {ReactComponent as ArrowBackImg} from '../../images/icons/interface-arrows-button-right--arrow-left-keyboard.svg'
import {ReactComponent as BellImg} from '../../images/icons/bell.svg'
import {ReactComponent as KeyImg} from '../../images/icons/key.svg'
import {ReactComponent as LocationImg} from '../../images/icons/location.svg'
import {ReactComponent as VolumeImg} from '../../images/icons/volume-hign.svg'
import {ReactComponent as MessageImg} from '../../images/icons/message.svg'
import {ReactComponent as ExitImg} from '../../images/icons/exit.svg'


function UserPanel({isActive, close}) {
  const {store} = useContext(Context);
  const username = store.user.fullname && store.user.surname
    ? `${store.user.fullname} ${store.user.surname}`
    : store.user.email

  const [editUserName, setEditUserName] = useState({
    name: username,
    status: store.user.status ? store.user.status : '',
  });

  const nameInput = useRef();
  const nameEl = useRef();
  const statusInput = useRef();
  const statusEl = useRef();

  const nameInputs = {
    'nameInput': nameInput,
    'statusInput': statusInput
  }

  const nameEls = {
    'nameEl': nameEl, 
    'statusEl': statusEl,
  }

  function handleLogout() {
    close();
    store.logout();
  }

  function activateInput(event) {
    const inputName = `${event.target.id}Input`;
    event.target.style.display = 'none';
    nameInputs[inputName].current.style.display = 'block';
    nameInputs[inputName].current.focus();
  }

  function handleNameStatusSave(event){
    store.editCurrentUser(editUserName.name, editUserName.status)
    const elName = `${event.target.name}El`;
    event.target.style.display = 'none';
    nameEls[elName].current.style.display = 'block';
  }

  function handleNameStatusChange(event) {
    setEditUserName((prevData) => {
      return {
      ...prevData,
      [event.target.name]: event.target.value
    }})
  }

  const menuItems = [
    {
      menuText: 'Messages',
      menuImg: <MessageImg />,
      iconColor: '#4299E1'
    },
    {
      menuText: 'Notifications',
      menuImg: <BellImg />,
      iconColor: '#667EEA'
    },
    {
      menuText: 'Keys and Security',
      menuImg: <KeyImg />,
      iconColor: '#ECC94B'
    },
    {
      menuText: 'Location',
      menuImg: <LocationImg />,
      iconColor: '#ED64A6'
    },
    {
      menuText: 'Sounds',
      menuImg: <VolumeImg />,
      iconColor: '#38B2AC'
    },
    {
      menuText: 'Exit',
      menuImg: <ExitImg />,
      iconColor: '#F56565',
      menuHandler: handleLogout,
    },
  ]
  
  return (
    <div 
      className={`user-panel--wraper ${isActive ? 'active' : ''}`}
    >
      <div className={`user-panel ${isActive ? 'active' : ''}`}>
        <div className='user-panel--top'>
          <button onClick={close}>
            <ArrowBackImg />
            Back
          </button>
        </div>
        <div className='user-panel--info'>
          <img 
            src={store.user.avatar_url} 
            alt="User avatar" 
            className='user-panel--avatar'
          />
          <div className='user--name_status'>
            <p className='user--name'>{username}</p>
            <p className='user--status'>{store.user.status}</p>
          </div>
        </div>
        <div className='user-panel--menu'>
          {
            menuItems.map(item => <UserPanelListItem 
              key={item.iconColor}
              {...item}
            />
            )
          }
        </div>
      </div>
      <div className='user-panel--edit-user'>
          <div className='user-panel--edit-user--card'>
            <img 
              src={store.user.avatar_url} alt='User avatar' 
              className='user-panel--avatar'
            />
            <div className='user-panel-edit-name-status'>
              <p 
                className='user--name'
                id='name'
                onClick={activateInput}
                ref={nameEl}
              >
                {username}
              </p>
              <input 
                className='user--name'
                type="text" 
                name='name'
                ref={nameInput}
                value={editUserName.name}
                onChange={handleNameStatusChange}
                onBlur={handleNameStatusSave}
              />
              <hr />
              <p 
                className='user--status'
                id='status'
                onClick={activateInput}
                ref={statusEl}
              >{store.user.status ? store.user.status :'Click to set your status'}</p>
              <input 
                className='user--status'
                type="text" 
                name='status'
                ref={statusInput}
                value={editUserName.status}
                onChange={handleNameStatusChange}
                onBlur={handleNameStatusSave}
              />
            </div>
          </div>
      </div>
    </div>
  )
}

export default observer(UserPanel);