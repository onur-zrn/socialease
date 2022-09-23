import React from "react";

const InputField = (props) => {
  if (props.type === "password") {
    return (
      <div className="form-group">
        <input
          className={
            props.error ? "form-control is-invalid" : "form-control"
          }
          style={{ width: 400 }}
          placeholder={props.placeholder}
          name={props.name}
          onChange={props.onChange}
          type="password"
        />
        <div className="invalid-feedback">{props.error}</div>
      </div>
    );
  } else {
    return (
      <div className="form-group">
        <input
          className={
            props.error ? "form-control is-invalid" : "form-control"
          }
          style={{ width: 400 }}
          placeholder={props.placeholder}
          name={props.name}
          onChange={props.onChange}
        />
        <div className="invalid-feedback">{props.error}</div>
      </div>
    );
  }
};

export default InputField;
