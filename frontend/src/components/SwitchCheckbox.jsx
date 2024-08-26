import React, { useState } from 'react';

const SwitchCheckbox = ({checked,onChange}) => {
  const [isChecked, setIsChecked] = useState(true); // or false based on your logic

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        id="flexSwitchCheckChecked"
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor="flexSwitchCheckChecked"></label>
    </div>
  );
};

export default SwitchCheckbox;
