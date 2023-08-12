import {useContext, useState} from "react";
import { Context } from "../../../main";
import { observer } from 'mobx-react-lite'
import MyInput from "../../ui/MyInput/MyInput";
import MyButton from "../../ui/MyButton/MyButton";
import { NavLink } from "react-router-dom";
import '../LoginPage.css'


function LoginForm() {
  const [errors, setErrors] = useState({
    'password': '',
    'email': ''
  })
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const {store} = useContext(Context)

  function handleErrors(errorData){
    for (const [key, value] of Object.entries(errorData)) {
      setErrors(prevErrors => {
        return {
        ...prevErrors,
        [key == 'detail' ? 'password': key]: value
      }});
    }
  }

  function handleInputChange(event) {
    setLoginData(prevLoginData => {
      return {
        ...prevLoginData,
        [event.target.id]: event.target.value,
      }
    })
    setErrors(prevErrors => {
      return {
        ...prevErrors,
        [event.target.id]: '',
      }
    })
  }

  return (
    <div className="login_form--wrapper">
      <div className="login_form">
        <MyInput 
          placeholder="email"
          type="text" 
          handleChange={handleInputChange}
          value={loginData.email}
          label="Email"
          id="email"
          error={errors.email}
        />
        <MyInput 
          placeholder="password"
          type="password" 
          handleChange={handleInputChange}
          value={loginData.password}
          label="Password"
          id="password"
          error={errors.password}
        />
        <div className="register_signin">
          <NavLink to='register'>
            Register
          </NavLink>
          <a href="">Forgot password</a>
        </div>
        <MyButton 
          handleClick={() => store.login(
            loginData.email, loginData.password, handleErrors)}
          text='Login'
          showLoader={true}
          isLoading={store.isLoading}
        />
      </div>
    </div>
  )
}

export default observer(LoginForm);