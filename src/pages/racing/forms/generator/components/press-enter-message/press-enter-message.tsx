import { useEffect, useState } from "react";
import classes from "./press-enter-message.module.css";

const PressEnterMessage = (): JSX.Element => {
  const [messageDark, setMessageDark] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMessageDark(!messageDark);
    }, 1000);
  }, [messageDark]);

  return (
    <span
      className={`${classes.pressEnterMessage} ${
        messageDark && classes.pressEnterMessageDark
      }`}
    >
      Press "Enter" to Destroy
    </span>
  );
};
export default PressEnterMessage;
