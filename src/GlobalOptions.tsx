import {createContext, useContext, useState, useEffect, PropsWithChildren} from "react";
import Fab from '@mui/material/Fab';
import SettingsIcon from '@mui/icons-material/Settings';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

export const GlobalOptionsContext = createContext<GlobalOptions>({
  kbBackgroundHighlightEnabled: true,
  kbSoundEnabled: true
});

export type GlobalOptions = {
  kbBackgroundHighlightEnabled: boolean;
  kbSoundEnabled: boolean;
};

export const OptionsWidget : React.FC<{
  setGlobalOptions: (opts: GlobalOptions) => void
}> = ({setGlobalOptions}) => {
  const [rev, setRev] = useState(0);
  const [appliedRev, setAppliedRev] = useState(0);
  const options = useContext(GlobalOptionsContext);
  const [active, setActive] = useState(false);
  const [highlightsOn, setHighlightsOn] = useState(options.kbBackgroundHighlightEnabled);

  const onSettingsClick = () => {
    setActive(!active);
  };

  const onHighlightBgClick = () => {
    setHighlightsOn(!highlightsOn);
  };

  const onUnHover = () => {
    if (active) {
    setActive(false);
    }
  };

  useEffect(() => {
      setRev(r => r + 1);
  }, [highlightsOn]);

  useEffect(() => {
    if (rev !== appliedRev) {
      setGlobalOptions({
        ...options,
        kbBackgroundHighlightEnabled: highlightsOn
      });
      setAppliedRev(rev);
    }
  }, [appliedRev, highlightsOn, options, rev, setGlobalOptions])

  const settingsColor = active ? "secondary" : "default" 
  const hlColor = highlightsOn ? "secondary" : "default" 
  const settingsSize = active ? "medium" : "small" 
  return (
    <div className={`options-widget${active ? " active" : ""}`}
      onMouseLeave={onUnHover}
    >
      {
        active ?
        <div className="options-list">
          <Fab color={hlColor} variant="extended" onClick={onHighlightBgClick}>
            <BorderColorOutlinedIcon/>  Highlight Wholetones
          </Fab>
        </div> : undefined
      }
      <Fab color={settingsColor} size={settingsSize} onClick={onSettingsClick}>
          <SettingsIcon/>
      </Fab>
    </div>
  )
}

export const GlobalOptionsProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [globalOptions, setGlobalOptions] = useState<GlobalOptions>({
    kbBackgroundHighlightEnabled: false,
    kbSoundEnabled: true
  });


  return (
      <GlobalOptionsContext.Provider value={globalOptions}>
        {children}
        <OptionsWidget setGlobalOptions={setGlobalOptions}/>
      </GlobalOptionsContext.Provider>
  );
}
