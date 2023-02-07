import React, { FC } from "react";
import { Note, noteColor, bracketClass, prettyNoteName } from "./Notes";

export const Key: FC<{
  note: Note;
}> = ({ note }) => {
  const blackWhite = noteColor(note);
  const hl = note.highlight ?? "";
  const bracketCss = bracketClass(note.bracket);
  const bracketColor = note.bracketColor;
  const noteCss = `note-${note.name}${note.acc ? "s" : ""}`;
  const prettyName = prettyNoteName(note);
  return (
    <div className={`key ${blackWhite} ${hl} ${noteCss}`}>
      <div className={`key-bracket ${bracketCss} ${bracketColor}`}>
        <div className={`key-bracket-label`}>{note.bracketLabel}</div>
      </div>
      <span className="note-label">{prettyName}</span>
    </div>
  );
};
