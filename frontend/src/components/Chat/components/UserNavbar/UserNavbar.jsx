import { useState, useRef, useEffect } from "react";

import avatar from '../../../../images/Avatar.png'
import "./UserNavbar.css"

import { ReactComponent as SearchIcon } from '../../../../images/icons/interface-search--glass-search-magnifying.svg';
import { ReactComponent as DateToday } from '../../../../images/icons/date_today_light.svg';
import AuthService from "../../../../services/ApiService";


function Navbar(props) {
  const inputRef = useRef(null);
  const [user, setUser] = useState();
  const [searchSelected, setSearchSelected] = useState(false);
  const [focus, setFocus] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const response = await AuthService.getContact(props.selectedContactId);
      setUser(response.data);
      console.log(response.data);
    }
    fetchUser();
  }, [])

  function searchBarHandleClick() {
    setSearchSelected(prevValue => !prevValue)
  }

  function togleFocus(event) {
    if (event.propertyName == 'opacity'){
      setFocus(prevValue => !prevValue)
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [focus])

  const userName = user?.surname && user?.fullname
    ? `${user?.fullname} ${user?.surname}`
    : user?.email

  return (
    <div className="user_navbar">
      <div className="user_navbar--info">
        <img 
          src={avatar}
          className="user_navbar--avatar"
          alt="Contact avatar"
        />
        <div>
          <p>{userName}</p>
          <p className="user_navbar--info--online">online</p>
        </div>
      </div>
      <div className={`user_navbar--input ${searchSelected ? 'active' : ''}`}>
        <input 
          ref={inputRef}
          type="text"
          disabled={!searchSelected}
          onTransitionEnd={togleFocus}
          onBlur={searchBarHandleClick}
          className={`user_navbar--search ${searchSelected ? 'active' : ''}`}
        />
        <SearchIcon 
          className={`user_navbar--search__icon ${searchSelected ? 'active' : ''}`}
          stroke="#6A6C87"
          onClick={searchBarHandleClick}
        />
        <DateToday 
          className={`user_navbar--date_icon ${searchSelected ? 'active' : ''}`}
          stroke="#6A6C87"
          onMouseDown={(e) => e.preventDefault()}
        />
      </div>
    </div>
  )
}

export default Navbar;