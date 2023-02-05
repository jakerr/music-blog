import React, { FC, useEffect, useState, useContext } from "react";
import Slider from "@mui/material/Slider";
import { KeyHighlighter } from "./KeyHighlighter";
import { SoundPlayerContext, SoundPlayer } from "./SoundPlayer";
import { Note, noteIndex, noteForIndex } from "./Notes";
import { Key } from "./Key";
import { GlobalOptionsContext } from "./GlobalOptions";
import { MajorMode, MajorModes } from "./ModeHighlighters";

import PianoIcon from "@mui/icons-material/Piano";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import PaletteIcon from '@mui/icons-material/Palette';

export const playNote = (player: SoundPlayer | null, note: Note) => {
  if (note.playable) {
    player?.playNote(note, 16);
  }
};

export const Keyboard: FC<{
  from: Note;
  to: Note;
  size?: "small" | "medium" | "large";
  highlighterList: KeyHighlighter[];
  canTranspose?: boolean;
}> = ({
  from,
  to,
  size = "large",
  highlighterList = [],
  canTranspose = false,
}) => {
  const globalOptions = useContext(GlobalOptionsContext);
  const player = useContext(SoundPlayerContext);
  const [progress, setProgress] = useState(0.0);
  const [lastTopNote, setLastTopNote] = useState(-1);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [didFadeIn, setDidFadeIn] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [currentHighlighters, setHighlighters] = useState(highlighterList);
  const defaultHl = highlighterList[highlighterList.length - 1];
  const shouldAnimate = highlighterList.some((hl) => hl.opts.shouldAnimate);

  // Animate in.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        setProgress((p) => {
          const keyPerc = 1 / 37;
          if (p + keyPerc >= 1) {
            clearInterval(intervalId);
            setDidFadeIn(true);
          }
          return p + 1 / 37;
        });
      }, 10);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, []);

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
        } else if (
          highlighter.opts.forceBG ||
          globalOptions.kbBackgroundHighlightEnabled
        ) {
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
    const modeStops = [0, 2, 4, 5, 7, 9, 11];
    const modeIndex = modeStops.findIndex((v) => v === singleValue);
    const modeName = Object.keys(MajorModes)[modeIndex];
    const newMode = MajorModes[modeName as keyof typeof MajorModes];
    const hl = highlighterList[highlighterList.length - 1];
    hl.opts.pattern = newMode;
    for (const note of notes) {
      note.playable = false;
    }
    setLastTopNote(-1);
    // Force render of notes since we changed the contents of highlighter.
    setHighlighters((previousHl) => {
      return previousHl;
    });
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
    const hl = highlighterList[highlighterList.length - 1];
    hl.opts.startNote = newStartNote;
    for (const note of notes) {
      note.playable = false;
    }
    setLastTopNote(-1);
    // Force render of notes since we changed the contents of highlighter.
    setHighlighters((previousHl) => {
      return previousHl;
    });
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
                defaultValue={0}
                valueLabelDisplay="off"
                onChange={onSliderChange}
              />
            </div>
            {canTranspose ? (
              <div className="kb-slider">
                <QueueMusicIcon />
                <Slider
                  color="secondary"
                  size="small"
                  defaultValue={noteIndex(defaultHl.opts.startNote)}
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
            {canTranspose ? (
              <div className="kb-slider">
                <PaletteIcon/>
                <Slider
                  color="secondary"
                  size="small"
                  defaultValue={noteIndex(defaultHl.opts.startNote)}
                  min={0}
                  max={11}
                  marks={[0, 2, 4, 5, 7, 9, 11].map((value) => {
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
