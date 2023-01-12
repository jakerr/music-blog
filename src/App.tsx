import React, {FC} from 'react';
import logo from './logo.svg';
import './App.css';

type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
type Accidental = '#' | 'b' | undefined 
type Note = {
  name: NaturalNote
  acc?: Accidental
  oct: number
}
const CHROMA = "C_D_EF_G_A_B";

const accidentalOffset = (acc: Accidental): number => {
  if (acc == "#") {
    return 1;
  } else if (acc == "b") {
    return -1;
  }
  return 0;
}

const noteIndex = (note: Note): number => {
  const offset = accidentalOffset(note.acc);
  const noteOrder = (CHROMA.indexOf(note.name) + offset);
  return note.oct * 12 + noteOrder;
}

const noteForIndex = (idx: number): Note => {
  const oct = Math.floor(idx / 12);
  const chromaticDegree = idx % 12;
  var noteName = CHROMA[chromaticDegree];
  var acc = undefined;
  if (noteName === "_") {
    acc = "#"
    noteName = CHROMA[chromaticDegree - 1];
  }
  return {
    name: noteName as NaturalNote,
    acc: acc as Accidental,
    oct: oct,
  };
}

const noteColor = (note: Note): string => {
  const offset = accidentalOffset(note.acc);
  return offset === 0 ? "white" : "black";
}

const Key: FC<{
  note: Note
}> = ({note}) => {
  const color = noteColor(note);
  return (
    <div className={`key ${color}`}>
    </div>
  )
}

const Keys: FC<{
  from: Note,
  to: Note
  size?: "small" | "medium" | "large"
}> = ({from, to, size="large"}) => {
  const fromIndex = noteIndex(from);
  const toIndex = noteIndex(to);
  const allNoteIds = Array(toIndex - fromIndex).fill(0).map((i, idx) => i + idx + fromIndex);
  const allNotes = allNoteIds.map((noteId) => noteForIndex(noteId));
  const sizeClass = size === "large" ? "kb-80vw" : (size === "medium" ? "kb-50vw" : "kb-20vw");
  console.log(`All notes ${allNoteIds}`);
  console.log(`All notes ${allNotes}`);
  return (
    <>
    <div className={`keyboard ${sizeClass}`}>
      {
      allNotes.map((note) => (
        <Key key={noteIndex(note)} note={note}></Key>
      ))
      }
    </div>

      {/* Notes from: {from.name}{from.acc}{from.oct} to: {to.name}{to.acc}{to.oct}
      ({fromIndex}) ~ ({toIndex})
      <br>
      </br>
      Notes round trip from: {fromNote2.name}{fromNote2.acc}{fromNote2.oct} to: {toNote2.name}{toNote2.acc}{toNote2.oct} */}
    </>
  )
}

function App() {
  const from: Note = {
    name: "C",
    oct: 0,
  }
  const to: Note = {
    name: "C",
    oct: 3,
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          This is a typical piano keyboard with three octaves starting on C and ending on the C three octaves higher.
        </p>
        <Keys from={from} to={to} size="medium"></Keys>
        <p>
          The white notes are called "natural" notes and they have the names "C, D, E, F, G, A, B" repeating up the keyboard.
        </p>
      </header>
    </div>
  );
}

export default App;
