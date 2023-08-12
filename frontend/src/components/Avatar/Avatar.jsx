import './Avatar.css'


function Avatar(props) {
  return (
    <div className='avatar'>
      <img 
        className='avatar--image' 
        src={props.avatarImg} 
        alt="avatar" />
      {props.isOnline &&<div className='avatar--online'></div>}
    </div>  
  )
}

export default Avatar