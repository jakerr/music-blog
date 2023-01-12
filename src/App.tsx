import React, {FC, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

type NaturalNote = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
type Accidental = '#' | 'b' | undefined 
type Note = {
  name: NaturalNote,
  acc?: Accidental,
  oct: number,
  highlight?: string
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
  note: Note,
  highlight?: string
}> = ({note, highlight}) => {
  const blackWhite = noteColor(note);
  const hl = highlight ?? "";
  return (
    <div className={`key ${blackWhite} ${hl}`}>
    </div>
  )
}

class KeyHighlighter {
  start: Note;
  pattern: number[];
  patternIndex = 0;
  parity: "odd" | "even" | "searching" = "searching";
  currentRun: number = 0;
  halfSteps: number = 0;

 
  constructor(start: Note, pattern: number[]) {
    this.start = start;
    this.pattern = pattern;
  }

  reset() {
    this.parity = "searching";
    this.currentRun = 0;
    this.halfSteps = 0;
    this.patternIndex = 0;
  }

  startRun() {
    this.halfSteps = 0;
    this.currentRun = this.pattern[this.patternIndex];
    this.patternIndex = this.patternIndex + 1;
  }

  doHighlight(note: Note) {
    const color = this.parity === "odd" ?  "tone-color-1" : "tone-color-2";
    this.currentRun -= 1;
    note.highlight = color;
    console.log(`Highlight ${note.name}${note.acc ?? ""}${note.oct} with ${note.highlight}`);
    if (this.currentRun <= 0) {
      this.parity = this.parity === "odd" ?  "even" : "odd";
      if (this.patternIndex >= this.pattern.length) {
        this.parity = "searching";
        this.patternIndex = 0;
        console.log("🔻 pattern idx oob after highlighting: " + note.name);
      }
    }
  }
 
  accept(note: Note) {
    const targetName = this.start.name + (this.start.acc ?? "");
    const noteName = note.name + (note.acc ?? "");
    // Not yet highlighting
    if (this.parity === "searching") {
      if(targetName === noteName) {
        this.parity = "odd";
        this.startRun();
        this.doHighlight(note);
        return;
      }
      console.log(`🔻 searching for ${targetName} does not match ${noteName}.`);
      return;
    }

    this.halfSteps += 1;
    if (this.currentRun <= 0) {
      this.startRun();
      this.doHighlight(note);
      return;
    }

    if (this.halfSteps % 2 === 0) {
      this.doHighlight(note);
      return;
    }
    // console.log("🔻 no highlight for " + noteName);
    return;
  }
}

const Keys: FC<{
  from: Note,
  to: Note,
  size?: "small" | "medium" | "large",
  highlighter?: KeyHighlighter
}> = ({from, to, size="large", highlighter}) => {
  const [keys, setKeys] = useState<Note[]>([]);

  useEffect(() => {
    console.log("Use effect.")
    highlighter?.reset();
    const fromIndex = noteIndex(from);
    const toIndex = noteIndex(to);
    const allNoteIds = Array(toIndex - fromIndex).fill(0).map((i, idx) => i + idx + fromIndex);
    const allNotes = allNoteIds.map((noteId) => noteForIndex(noteId));
    console.log(allNoteIds);
    for (var note of allNotes) {
      highlighter?.accept(note);
    }
    setKeys(allNotes);
  }, [from, to, highlighter]);

  const sizeClass = size === "large" ? "kb-80vw" : (size === "medium" ? "kb-50vw" : "kb-20vw");
  return (
    <>
    <div className={`keyboard ${sizeClass}`}>
      {
      keys.map((note) => {
        const highlight = note.highlight;
        if (highlight) {
          console.log(`Highlight ${note.name}${note.acc ?? ""}${note.oct} with ${highlight}`);
        }
        return (
          <Key key={noteIndex(note)} note={note} highlight={highlight}></Key>
         )
       })
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
  const am: Note = {...from, name:"A"}
  const highlighter = new KeyHighlighter(am, [2,3,2]);
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          This is a typical piano keyboard with three octaves starting on C and ending on the C three octaves higher.
        </p>
        <Keys from={from} to={to} size="medium" highlighter={highlighter}></Keys>
        <p>
          The white notes are called "natural" notes and they have the names "C, D, E, F, G, A, B" repeating up the keyboard.
        </p>
      </header>
    </div>
  );
}

export default App;
