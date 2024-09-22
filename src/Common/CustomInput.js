import React, { useState } from "react";

const CustomInput = ({
  label,
  value = "",
  onChange = () => {},
  type = "text",
  placeholder = "",
  key,
  ref = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event) => {
    if (event.target.value === "") {
      setIsFocused(false);
    }
  };

  return (
    <div className="form-group custom-input">
      <label className={isFocused || value ? "focused" : ""}>{label}</label>
      <input
        type={type}
        className="form-control"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={key == 1 ? true : false}
        ref={ref}
      />
    </div>
  );
};

export default CustomInput;
