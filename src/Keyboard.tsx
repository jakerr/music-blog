import React, { FC, useEffect, useState, useContext } from "react";
import Slider from "@mui/material/Slider";
import { KeyHighlighter } from "./KeyHighlighter";
import { SoundPlayerContext, SoundPlayer } from "./SoundPlayer";
import { Note, noteIndex, noteForIndex, noteNamed } from "./Notes";
import { Key } from "./Key";
import { GlobalOptionsContext } from "./GlobalOptions";
import { MajorMode, MajorModes, ModeBuilder } from "./ModeHighlighters";

import PianoIcon from "@mui/icons-material/Piano";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PaletteIcon from '@mui/icons-material/Palette';

export const playNote = (player: SoundPlayer | null, note: Note) => {
  if (note.playable) {
    player?.playNote(note, 16);
  }
};

const WholeToneLightBG: KeyHighlighter[] = [
  new ModeBuilder(noteNamed("C0")).AlternatingWholeTones().ColorDualLight().build(),
];

const modeStarts = [0, 2, 4, 5, 7, 9, 11];
const indexForMode = (mode: MajorMode): number => {
  const modeIndex = Object.keys(MajorModes).indexOf(mode);
  return modeStarts[modeIndex];
}


export const Keyboard: FC<{
  from: Note;
  to: Note;
  scaleStart?: Note;
  scaleMode?: MajorMode;
  size?: "small" | "medium" | "large";
  shouldAnimate?: boolean;
  canTranspose?: boolean;
  canChangeMode?: boolean;
  staticHighlighters?: KeyHighlighter[];
}> = ({
  from,
  to,
  scaleStart,
  scaleMode,
  size = "large",
  shouldAnimate = false,
  canTranspose = false,
  canChangeMode = false,
  staticHighlighters = [],
}) => {
  const globalOptions = useContext(GlobalOptionsContext);
  const player = useContext(SoundPlayerContext);
  const [progress, setProgress] = useState(0.0);
  const [lastTopNote, setLastTopNote] = useState(-1);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [didFadeIn, setDidFadeIn] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [currentHighlighters, setHighlighters] = useState<KeyHighlighter[]>(staticHighlighters);
  const [currentScaleStart, setCurrentScaleStart] = useState(scaleStart);
  const [currentScaleMode, setCurrentScaleMode] = useState(scaleMode);

  // Animate in.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setProgress(1.0);
      setDidFadeIn(true);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  // Effect to update highlighters.
  useEffect(() => {
    if (staticHighlighters.length > 0 || currentScaleStart === undefined || currentScaleMode === undefined || notes === null) {
      return;
    }
    const backgroundHl = globalOptions.kbBackgroundHighlightEnabled ? WholeToneLightBG : [];
    const scaleHl = new ModeBuilder(currentScaleStart)
    .ModeNamed(currentScaleMode)
    .ColorDual()
    .BracketsRunNumbers()
    .Animate(shouldAnimate).build();
    for (const note of notes) {
      note.playable = false;
    }
    setHighlighters([...backgroundHl, scaleHl]);
    setLastTopNote(-1);
  }, [currentScaleMode, currentScaleStart, globalOptions.kbBackgroundHighlightEnabled, notes, shouldAnimate, staticHighlighters.length]);

  // Initial effect to set up notes.
  useEffect(() => {
    const fromIndex = noteIndex(from);
    const toIndex = noteIndex(to);
    const allNoteIds = Array(toIndex - fromIndex)
      .fill(0)
      .map((i, idx) => i + idx + fromIndex);
    const allNotes = allNoteIds.map((noteId) => noteForIndex(noteId));
    setNotes(allNotes);
  }, [to, from]);

  useEffect(() => {
    setLastTopNote(-1);
  }, [globalOptions.kbBackgroundHighlightEnabled]);

  // Effect to update highlighting
  useEffect(() => {
    if (!notes) {
      // console.log("Skip we don't have notes yet.");
      return;
    }
    const topNoteIndex =
      progress >= 0.001 ? Math.floor(progress * notes.length) : -2;
    if (lastTopNote === topNoteIndex) {
      // console.log("Skip draw as we already drew at this progress.");
      return;
    }
    setLastTopNote(topNoteIndex);
    for (const note of notes) {
      note.bracket = undefined;
      note.bracketLabel = undefined;
      note.highlight = undefined;
    }
    for (const highlighter of currentHighlighters) {
      highlighter.reset();
    }
    for (const highlighter of currentHighlighters) {
      notes.forEach((note, index) => {
        if (highlighter.opts.shouldAnimate) {
          if (index <= topNoteIndex) {
            highlighter?.accept(note);
          }
        } else {
          highlighter?.accept(note);
        }
      });
    }
    const topNote = notes[topNoteIndex];
    if (didFadeIn && playRequested && topNote && topNote.playable) {
      playNote(player, topNote);
      setPlayRequested(false);
    }
    // Force render of notes since we changed the contents via highlighter.
    setNotes((previousNotes) => {
      return previousNotes;
    });
  }, [
    notes,
    progress,
    didFadeIn,
    lastTopNote,
    currentHighlighters,
    player,
    globalOptions,
    playRequested,
  ]);

  // When the mode is changed we need to update the highlighter by replacing it's pattern with the pattern defined by the major mode.
  const onChangeMode = (
    e: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    if (notes === null) return;
    const singleValue = Array.isArray(value) ? value[0] : value;
    const modeIndex = modeStarts.findIndex((v) => v === singleValue);
    const modeName = Object.keys(MajorModes)[modeIndex];
    setCurrentScaleMode(modeName as MajorMode);
  };

  const onChangeStartNote = (
    e: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    if (notes === null) return;
    const singleValue = Array.isArray(value) ? value[0] : value;
    const kbFirstKey = noteIndex(from);
    const newStartIndex = kbFirstKey + singleValue;
    const newStartNote = noteForIndex(newStartIndex);
    setCurrentScaleStart(newStartNote);
  };

  const onSliderChange = (
    e: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    const singleNum = Array.isArray(value) ? value[0] : value;
    const newProgress = singleNum / 100.0;
    setPlayRequested(true);
    setProgress(newProgress);
  };

  const sizeClass =
    size === "large" ? "kb-80vw" : size === "medium" ? "kb-50vw" : "kb-20vw";
  return (
    <>
      <div className={`keyboard-wrapper ${sizeClass}`}>
        <div className={`keyboard ${sizeClass}`}>
          {notes?.map((note) => {
            return <Key key={noteIndex(note)} note={note}></Key>;
          })}
        </div>
        {shouldAnimate ? (
          <>
            <div className="kb-slider">
              <PianoIcon />
              <Slider
                value={Math.floor(progress * 100.0)}
                color="secondary"
                size="small"
                valueLabelDisplay="off"
                onChange={onSliderChange}
              />
            </div>
            {(canTranspose && currentScaleStart !== undefined) ? (
              <div className="kb-slider">
                <QueueMusicIcon />
                <Slider
                  color="secondary"
                  size="small"
                  value={noteIndex(currentScaleStart)}
                  marks={true}
                  min={0}
                  max={11}
                  valueLabelFormat={(value, index) => {
                    const note = noteForIndex(value);
                    const name = `${note.name}${note.acc ?? ""}`;
                    return name;
                  }}
                  valueLabelDisplay="on"
                  onChange={onChangeStartNote}
                />
              </div>
            ) : undefined}
            {(canChangeMode && currentScaleMode !== undefined) ? (
              <div className="kb-slider">
                <PaletteIcon/>
                <Slider
                  color="secondary"
                  size="small"
                  value={indexForMode(currentScaleMode)}
                  min={0}
                  max={11}
                  marks={modeStarts.map((value) => {
                    return {
                      value: value,
                      label: undefined,
                    };
                  })}
                  step={null} // Disables the step so that selections are restricted to the marks.
                  valueLabelDisplay="on"
                  valueLabelFormat={(value, index) => {
                    const modeStops = [0, 2, 4, 5, 7, 9, 11];
                    const modeIndex = modeStops.findIndex((v) => v === value);
                    const modeName = Object.keys(MajorModes)[
                      modeIndex
                    ] as MajorMode;
                    return modeName;
                  }}
                  onChange={onChangeMode}
                />
              </div>
            ) : undefined}
          </>
        ) : undefined}
      </div>
    </>
  );
};
