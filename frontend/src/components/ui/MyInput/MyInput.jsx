import './MyInput.css'


function MyInput({
  handleChange,
  value,
  type,
  placeholder,
  id,
  label,
  error
}) {
  return (
    <div className="input-wrapper">
      <label htmlFor={id}>{label}</label>
      <input 
        type={type} 
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        id={id}
      />
      <p className='input-error'>{error}</p>
    </div>
  )
}

export default MyInput;