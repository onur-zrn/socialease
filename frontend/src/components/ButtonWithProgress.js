import React from "react";
import {styles} from "../assets/styles/common/buttonStyles";

const ButtonWithProgress = (props) => {
  const { onClick, pendingApiCall, disabled, text } = props;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={styles.buttonWithProgressStyle}
    >
      {pendingApiCall && (
        <span className="spinner-border spinner-border-sm"></span>
      )}
      {text}
    </button>
  );
};

export default ButtonWithProgress;
