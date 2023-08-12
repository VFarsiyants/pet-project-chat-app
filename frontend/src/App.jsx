import { useContext, useEffect, useState } from 'react';
import './App.css'
import LoginForm from './components/LoginPage/LoginForm/LoginForm';
import RegistrationForm from './components/LoginPage/RegistrationForm/RegistrationForm';
import UserPanel from './components/UserPanel/UserPanel';
import MainPanel from './components/MainPanel/MainPanel';
import { Context } from './main';
import { observer } from 'mobx-react-lite'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { WebSocketContactsInstance } from './components/Chat/websocket';


const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "register",
    element: <RegistrationForm />,
  },
]);


function App() {
  const {store} = useContext(Context);
  const [userPanelIsActive, setUserPanelIsActive] = useState(false)

  useEffect(() => {
    if(localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [])

  useEffect(() => {
    function closeWebsocket() {
      WebSocketContactsInstance.disconnect()
    }
    if (store.isAuth){
      WebSocketContactsInstance.connect('user_online_status');
      return closeWebsocket
    }
  }, [store.isAuth])

  if (store.isAuth) {
    return (
      <div className='container'>
        <MainPanel 
          isDeactive={userPanelIsActive}
          openUserPnl={() => setUserPanelIsActive(true)}
        />
        <UserPanel 
          isActive={userPanelIsActive}
          close={() => setUserPanelIsActive(false)}
        />
      </div>
    )
  } else {
    return (
      <RouterProvider router={routerLogin} />
    )
  }
}

export default observer(App);
