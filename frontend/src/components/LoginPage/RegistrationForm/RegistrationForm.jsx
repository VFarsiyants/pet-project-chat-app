import '../LoginPage.css'
import MyInput from '../../ui/MyInput/MyInput'
import MyButton from '../../ui/MyButton/MyButton'
import { useState } from 'react'
import { useContext } from 'react'
import { Context } from '../../../main'
import { NavLink } from 'react-router-dom'


function RegistrationForm() {
  const {store} = useContext(Context);

  const [regData, setRegData] = useState({
    'email': '',
    'password': '',
    'confirm_password': ''
  })
  const [errors, setErrors] = useState({
    'email': '',
    'password': '',
    'confirm_password': ''
  })

  function handleInputChange(event) {
    setRegData(prevData => {
      return {
        ...prevData,
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

  function handleErrors(errorData){
    for (const [key, value] of Object.entries(errorData)) {
      setErrors(prevErrors => {
        return {
        ...prevErrors,
        [key == 'detail' ? 'password': key]: value
      }});
    }
  }

  function handleRegister() {
    if (regData.password != regData.confirm_password) {
      setErrors(prevErrors => {
        return {
          ...prevErrors,
          confirm_password: 'Passwords are not matched'
        }
      })
    }
    store.register(
      regData.email, regData.password, handleErrors)
  }

  return (
    <div className="login_form--wrapper">
      <div className="login_form">
        <div className='register_form--header'>
          <h3>Registration</h3>
          <p>Register to chat with friends and colleagues</p>
        </div>
        <MyInput 
          placeholder="email"
          type="text" 
          handleChange={handleInputChange}
          value={regData.email}
          label="Email"
          id="email"
          error={errors.email}
        />
        <MyInput 
          placeholder="password"
          type="password" 
          handleChange={handleInputChange}
          value={regData.password}
          label="Password"
          id="password"
          error={errors.password}
        />
        <MyInput 
          placeholder="repeat password"
          type="password" 
          handleChange={handleInputChange}
          value={regData.confirm_password}
          label="Repeat password"
          id="confirm_password"
          error={errors.confirm_password}
        />
        <div className="register_signin register-login-link">
          <NavLink to='/'>
            Login
          </NavLink>
        </div>
        <MyButton 
          handleClick={handleRegister}
          text='Register'
        />
      </div>
    </div>
  )
}

export default RegistrationForm;