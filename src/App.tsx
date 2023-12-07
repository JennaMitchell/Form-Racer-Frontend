import "./App.css";
import RacingTopElement from "./pages/racing/racing-main";
import NavBar from "./components/nav-bar/nav-bar";
import { useEffect } from "react";
import { useAppSelector } from "./store/typescript-hooks";
import SignupPopup from "./components/popups/signup/signup-popup";
import LoginPopup from "./components/popups/login/login-popup";
import ChangeRacerPopup from "./components/popups/change-racer/change-racer-popup";
import GameSetupPopup from "./components/popups/game-setup/game-setup-popup";
import ServerMessagePopup from "./components/popups/server-message/server-message-popup";
import ResetButton from "./components/reset-button/reset-button";

function App() {
  const lockViewportActive = useAppSelector(
    (state) => state.popups.lockViewportActive
  );
  const loginPoupActive = useAppSelector(
    (state) => state.popups.loginPopupActive
  );
  const signupPopupActive = useAppSelector(
    (state) => state.popups.signupPopupActive
  );

  const changeRacerPopupActive = useAppSelector(
    (state) => state.popups.changeRacerPopupActive
  );
  const gameSetupPoupActive = useAppSelector(
    (state) => state.popups.gameSetupActive
  );

  const serverMessagePopupActive = useAppSelector(
    (state) => state.popups.serverMessagePopupActive
  );

  const serverMessageData = useAppSelector(
    (state) => state.popups.serverMessageData
  );

  const testStarted = useAppSelector((state) => state.formRacing.testStarted);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      window.innerWidth - document.documentElement.clientWidth + "px"
    );
  }, []);

  useEffect(() => {
    const bodyElement = document.getElementsByTagName(
      "body"
    )[0] as HTMLBodyElement;
    if (lockViewportActive) {
      bodyElement.classList.add("lockedViewport");
    } else {
      if (bodyElement.classList.contains("lockedViewport")) {
        bodyElement.classList.remove("lockedViewport");
      }
    }
  }, [lockViewportActive]);

  return (
    <div className="App">
      {signupPopupActive && <SignupPopup />}
      {loginPoupActive && <LoginPopup />}
      {changeRacerPopupActive && <ChangeRacerPopup />}
      {gameSetupPoupActive && <GameSetupPopup />}
      {serverMessagePopupActive && (
        <ServerMessagePopup {...serverMessageData} />
      )}
      {!testStarted && <NavBar />}
      {testStarted && <ResetButton />}
      <RacingTopElement />
    </div>
  );
}

export default App;
