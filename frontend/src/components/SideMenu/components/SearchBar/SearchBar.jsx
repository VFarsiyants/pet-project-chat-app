import './SearchBar.css'
import { ReactComponent as UserCircle } from '../../../../images/icons/user_cicrle_light.svg';


function SearchBar({openUserPnl}) {
  return (
    <div className='search_bar'>
      <div 
        className='search_bar--user-icon'
      >
        <UserCircle
          stroke="#6A6C87"
          onClick={openUserPnl}
        />
      </div>
      <input 
          type="text" 
          placeholder='Search'
          className='search_bar--input'
      />
    </div>
  )
}

export default SearchBar;