import './UserPanelListItem.css'


function UserPanelListItem({
  menuImg,
  menuText,
  menuHandler,
  iconColor
}) {

  const iconStyle = {
    background: iconColor,
  }

  return (
    <button className="user_panel_list_item" onClick={menuHandler}>
      <div style={iconStyle}>
        {menuImg}
      </div>
      <p>{menuText}</p>
    </button>
  )
}

export default UserPanelListItem;