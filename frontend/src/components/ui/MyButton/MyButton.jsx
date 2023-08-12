import './MyButton.css'
import Loader from '../Loader/Loader';


function MyButton({
  text,
  handleClick,
  showLoader,
  isLoading,
}) {
  return (
    <button 
      onClick={handleClick} 
      className='my_button'>
      { showLoader && isLoading && <Loader />}
      {text}
    </button>
  )
}

export default MyButton;