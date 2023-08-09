import avatar from '../../images/Avatar.png'
import './Avatar.css'


function Avatar(props) {
  return (
    <div className='avatar'>
      <img 
        className='avatar--image' 
        src={avatar} 
        alt="avatar" />
      {props.isOnline &&<div className='avatar--online'></div>}
    </div>  
  )
}

export default Avatar