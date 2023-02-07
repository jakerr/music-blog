import "./App.css";
import { SoundPlayerProvider } from "./SoundPlayer";
import { Keyboard } from "./Keyboard";
import { GlobalOptionsProvider } from "./GlobalOptions";
import { noteNamed } from "./Notes";

const C0 = noteNamed("C0");
const C3 = noteNamed("C3");
const A0 = noteNamed("A0");


function MajorModesExplorer() {
  return (
    <div className="App">
      <GlobalOptionsProvider>
        <SoundPlayerProvider>
          <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <h1 className="page-title">Major Modes Explorer</h1>
            <Keyboard
              from={C0}
              to={C3}
              scaleStart={A0}
              scaleMode={"Aeolian"}
              size="large"
              shouldAnimate={true}
              canTranspose={true}
              canChangeMode={true}
            ></Keyboard>
            <a href="/music-blog/#/" className="back-to-home-link">&lt; Back to Major Modes Tutorial</a>
          </header>
        </SoundPlayerProvider>
      </GlobalOptionsProvider>
    </div>
  );
}

export default MajorModesExplorer;
