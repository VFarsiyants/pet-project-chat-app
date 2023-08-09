import './SearchBar.css'

import { ReactComponent as UserCircle } from '../../../../images/icons/user_cicrle_light.svg';


function SearchBar() {
  return (
    <div className='search_bar'>
      <UserCircle stroke="#6A6C87"/>
      <input 
          type="text" 
          placeholder='Search'
          className='search_bar--input'
      />
    </div>
  )
}

export default SearchBar;