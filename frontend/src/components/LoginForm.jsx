import {useContext, useState} from "react";
import { Context } from "../main";
import { observer } from 'mobx-react-lite'


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {store} = useContext(Context)

  return (
    <div>
      <input 
        type="text" 
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="username"
      />
      <input 
        type="password" 
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="password"
      />
      <button onClick={() => store.login(email, password)}>
        Login
      </button>
      <button onClick={() => store.register(email, password)}>
        Register
      </button>
    </div>
  )
}

export default observer(LoginForm);