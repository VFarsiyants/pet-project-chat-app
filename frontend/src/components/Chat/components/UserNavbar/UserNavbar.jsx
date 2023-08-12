import { useState, useRef, useEffect } from "react";

import "./UserNavbar.css"

import { ReactComponent as SearchIcon } from '../../../../images/icons/interface-search--glass-search-magnifying.svg';
import { ReactComponent as DateToday } from '../../../../images/icons/date_today_light.svg';


function Navbar(props) {
  const inputRef = useRef(null);
  const [searchSelected, setSearchSelected] = useState(false);
  const [focus, setFocus] = useState(false)

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

  const userName = props.selectedContact?.surname && props.selectedContact?.fullname
    ? `${props.selectedContact?.fullname} ${props.selectedContact?.surname}`
    : props.selectedContact?.email

  return (
    <div className="user_navbar">
      <div className="user_navbar--info">
        <img 
          src={props.selectedContact?.avatar_url}
          className="user_navbar--avatar"
          alt="Contact avatar"
        />
        <div>
          <p>{userName}</p>
          <p className="user_navbar--info--online">
            {props.selectedContact?.online_status ? 'online' : 'last seen recently'}
          </p>
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