import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import Fab from "@mui/material/Fab";
import Switch from "@mui/material/Switch";
import SettingsIcon from "@mui/icons-material/Settings";
import { FormControlLabel, FormGroup } from "@mui/material";

export const GlobalOptionsContext = createContext<GlobalOptions>({
  kbBackgroundHighlightEnabled: true,
  kbSoundEnabled: true,
  kbNoteNamesEnabled: true,
});

export type GlobalOptions = {
  kbBackgroundHighlightEnabled: boolean;
  kbSoundEnabled: boolean;
  kbNoteNamesEnabled: boolean;
};

export const OptionsWidget: React.FC<{
  setGlobalOptions: (opts: GlobalOptions) => void;
}> = ({ setGlobalOptions }) => {
  const [rev, setRev] = useState(0);
  const [appliedRev, setAppliedRev] = useState(0);
  const options = useContext(GlobalOptionsContext);
  const [active, setActive] = useState(false);
  const [highlightsOn, setHighlightsOn] = useState(
    options.kbBackgroundHighlightEnabled
  );
  const [noteNamesOn, setNoteNamesOn] = useState(options.kbNoteNamesEnabled);

  const onSettingsClick = () => {
    setActive(!active);
  };

  const onHighlightBgToggle = () => {
    setHighlightsOn(!highlightsOn);
  };

  const onNoteNamesToggle = () => {
    setNoteNamesOn(!noteNamesOn);
  };

  const onUnHover = () => {
    if (active) {
      setActive(false);
    }
  };

  useEffect(() => {
    setRev((r) => r + 1);
  }, [highlightsOn, noteNamesOn]);

  useEffect(() => {
    if (rev !== appliedRev) {
      setGlobalOptions({
        ...options,
        kbBackgroundHighlightEnabled: highlightsOn,
        kbNoteNamesEnabled: noteNamesOn,
      });
      setAppliedRev(rev);
    }
  }, [appliedRev, highlightsOn, noteNamesOn, options, rev, setGlobalOptions]);

  const settingsColor = active ? "secondary" : "default";
  const settingsSize = active ? "medium" : "small";
  return (
    <div
      className={`options-widget${active ? " active" : ""}`}
      onMouseLeave={onUnHover}
    >
      {active ? (
        <div className="options-list">
          <FormGroup>
            {toggle("Show Note Names", noteNamesOn, onNoteNamesToggle)}
            {toggle("Highlight Wholetones", highlightsOn, onHighlightBgToggle)}
          </FormGroup>
        </div>
      ) : undefined}
      <Fab color={settingsColor} size={settingsSize} onClick={onSettingsClick}>
        <SettingsIcon />
      </Fab>
    </div>
  );
};

export const GlobalOptionsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [globalOptions, setGlobalOptions] = useState<GlobalOptions>({
    kbBackgroundHighlightEnabled: false,
    kbSoundEnabled: true,
    kbNoteNamesEnabled: true,
  });

  return (
    <GlobalOptionsContext.Provider value={globalOptions}>
      {children}
      <OptionsWidget setGlobalOptions={setGlobalOptions} />
    </GlobalOptionsContext.Provider>
  );
};
function toggle(
  label: string,
  highlightsOn: boolean,
  onHighlightBgClick: () => void
) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={highlightsOn}
          onChange={onHighlightBgClick}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={label}
      labelPlacement="end"
      componentsProps={{ typography: { color: "#ddd" } }}
    />
  );
}
