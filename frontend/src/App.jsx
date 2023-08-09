import { useContext, useEffect, useState } from 'react';
import './App.css'
import SideMenu from './components/SideMenu/SideMenu'
import Chat from './components/Chat/Chat'
import LoginForm from './components/LoginForm'
import { Context } from './main';
import { observer } from 'mobx-react-lite'


function App() {
  const {store} = useContext(Context);
  const [selectedContact, setSelectedContact] = useState()
  
  function selectContact(selectedId) {
    setSelectedContact(selectedId);
  }

  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if (store.isAuth) {
    return (
      <div className='container'>
        <SideMenu 
          selectContact={selectContact}
          selectedContactId={selectedContact}
        />
        <Chat 
          key={selectedContact}
          selectedContactId={selectedContact}
        />
      </div>
    )
  } else {
    return (
      <LoginForm />
    )
  }
}

export default observer(App);
