import React from "react";

const Form = ({ inputValue, inputChange, submitGIF }) => {
  return (
    <form onSubmit={submitGIF}>
      <input
        type="text"
        placeholder="Enter gif link!"
        value={inputValue}
        onChange={inputChange}
      />
      <button type="submit" className="cta-button submit-gif-button">
        Submit
      </button>
    </form>
  );
};
export default Form;
