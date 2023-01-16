import React, { FC, useEffect, useState, useContext } from "react";
import Slider from "@mui/material/Slider";
import { KeyHighlighter } from "./KeyHighlighter";
import { SoundPlayerContext, SoundPlayer } from "./SoundPlayer";
import { Note, noteIndex, noteForIndex } from "./Notes";
import { Key } from "./Key";

export const playNote = (player: SoundPlayer | null, note: Note) => {
  if (note.playable) {
    player?.playNote(note, 16);
  }
}

export const Keyboard: FC<{
  from: Note;
  to: Note;
  size?: "small" | "medium" | "large";
  highlighterList: KeyHighlighter[];
}> = ({ from, to, size = "large", highlighterList = [] }) => {
  const player = useContext(SoundPlayerContext);
  const [progress, setProgress] = useState(0.0);
  const [lastTopNote, setLastTopNote] = useState(-1);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [didFadeIn, setDidFadeIn] = useState(false);
  const [currentHighlighters, setHighlighters] = useState(highlighterList);

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
      }, 14);
    }, 500);
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

  // Effect to update highlighting
  useEffect(() => {
    if (!notes) {
      // console.log("Skip we don't have notes yet.");
      return;
    }
    const topNoteIndex = progress >= 0.001 ? Math.floor(progress * notes.length) : -1;
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
    if (didFadeIn && topNote && topNote.playable) {
      playNote(player, topNote);
    }
    // Force render of notes since we changed the contents via highlighter.
    setNotes((previousNotes) => {
      return previousNotes;
    });
  }, [notes, progress, didFadeIn, lastTopNote, currentHighlighters, player]);

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
    // Force render of notes since we changed the contents of highlighter.
    for (const note of notes) {
      note.playable = false;
    }
    setLastTopNote(-1);
  }

  const onSliderChange = (
    e: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    const singleNum = Array.isArray(value) ? value[0] : value;
    const newProgress = singleNum / 100.0;
    setProgress(newProgress);
  };

  const sizeClass = size === "large" ? "kb-80vw" : size === "medium" ? "kb-50vw" : "kb-20vw";
  return (
    <>
      <div className={`keyboard-wrapper ${sizeClass}`}>
      <div className={`keyboard ${sizeClass}`}>
        {notes?.map((note) => {
          return <Key key={noteIndex(note)} note={note}></Key>;
        })}
      </div>
      <div className="kb-scrubber">
      <Slider
        value={Math.floor(progress * 100.0)}
        color="secondary"
        size="small"
        defaultValue={0}
        valueLabelDisplay="off"
        onChange={onSliderChange} />
      </div>
      <div className="kb-scrubber">
      <Slider
        color="secondary"
        size="small"
        defaultValue={noteIndex(from)}
        min={0}
        max={11}
        valueLabelFormat={(value, index) => {
          const note = noteForIndex(value);
          const name = `${note.name}${note.acc ?? ""}`
          return name;
        }}
        valueLabelDisplay="on"
        onChange={onChangeStartNote} />
      </div>
      </div>
    </>
  );
};
