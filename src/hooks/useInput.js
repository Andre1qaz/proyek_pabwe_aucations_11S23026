import { useState } from "react";

// Fungsi custom hook untuk mengelola input form
function useInput(defaultValue = "") {
  const [value, setValue] = useState(defaultValue);

  const onValueChangeHandler = (event) => {
    setValue(event.target.value);
  };

  return [value, onValueChangeHandler];
}

export default useInput;