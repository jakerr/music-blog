import React, { FC, useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { ModeBuilder } from "./ModeHighlighters";
import "./App.css";
import { KeyHighlighter } from "./KeyHighlighter";

type NaturalNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";
type Accidental = "#" | "b" | undefined;
export type Note = {
  name: NaturalNote;
  acc?: Accidental;
  oct: number;
  highlight?: string;
  bracket?: "left" | "middle" | "right" | "solo";
  bracketColor?:
    "bracket-color-1"
    | "bracket-color-2"
    | "bracket-color-1 lighten"
    | "bracket-color-2 lighten";
  bracketLabel?: string;
};
const CHROMA = "C_D_EF_G_A_B";

const accidentalOffset = (acc: Accidental): number => {
  if (acc === "#") {
    return 1;
  } else if (acc === "b") {
    return -1;
  }
  return 0;
};

export const noteIndex = (note: Note): number => {
  const offset = accidentalOffset(note.acc);
  const noteOrder = CHROMA.indexOf(note.name) + offset;
  return note.oct * 12 + noteOrder;
};

const noteForIndex = (idx: number): Note => {
  const oct = Math.floor(idx / 12);
  const chromaticDegree = idx % 12;
  var noteName = CHROMA[chromaticDegree];
  var acc = undefined;
  if (noteName === "_") {
    acc = "#";
    noteName = CHROMA[chromaticDegree - 1];
  }
  return {
    name: noteName as NaturalNote,
    acc: acc as Accidental,
    oct: oct,
  };
};

const noteColor = (note: Note): string => {
  const offset = accidentalOffset(note.acc);
  return offset === 0 ? "white" : "black";
};

function bracketClass(bracket?: "left" | "middle" | "right" | "solo") {
  let classString: string;

  switch (bracket) {
    case "left":
      classString = "left middle";
      break;
    case "middle":
      classString = "middle";
      break;
    case "right":
      classString = "middle right";
      break;
    case "solo":
      classString = "left middle right";
      break;
    default:
      classString = "";
  }
  return classString;
}

const Key: FC<{
  note: Note;
}> = ({ note }) => {
  const blackWhite = noteColor(note);
  const hl = note.highlight ?? "";
  const bracketCss = bracketClass(note.bracket);
  const bracketColor = note.bracketColor;
  const noteCss = `note-${note.name}${note.acc ? "s" : ""}`;
  return (
    <div className={`key ${blackWhite} ${hl} ${noteCss}`}>
      <div className={`key-bracket ${bracketCss} ${bracketColor}`}>
        <div className={`key-bracket-label`}>{note.bracketLabel}</div>
      </div>
    </div>
  );
};

const Keys: FC<{
  from: Note;
  to: Note;
  size?: "small" | "medium" | "large";
  highlighterList: KeyHighlighter[];
}> = ({ from, to, size = "large", highlighterList = [] }) => {
  const [progress, setProgress] = useState(0.0);
  const [drawnProgress, setDrawnProgress] = useState(-1.0);
  const [notes, setNotes] = useState<Note[] | null>(null);

  // Animate in.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        setProgress((p) => {
          const keyPerc = 1 / 37;
          if (p + keyPerc >= 1) {
            clearInterval(intervalId);
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
    if (drawnProgress === progress) {
      // console.log("Skip draw as we already drew at this progress.");
      return;
    }
    for (const note of notes) {
      note.bracket = undefined;
      note.highlight = undefined;
    }
    for (const highlighter of highlighterList) {
      highlighter.reset();
    }
    const animUpTo =
      progress >= 0.001 ? Math.floor(progress * notes.length) : -1;
    for (const highlighter of highlighterList) {
      notes.forEach((note, index) => {
        if (!highlighter.opts.shouldAnimate || index <= animUpTo) {
          highlighter?.accept(note);
        }
      });
    }
    setDrawnProgress(progress);
    // Force render of notes since we changed the contents via highlighter.
    setNotes((previousNotes) => {
      return previousNotes;
    });
  }, [notes, progress, drawnProgress, highlighterList]);

  const onSliderChange = (
    e: Event,
    value: number | number[],
    activeThumb: number
  ) => {
    const singleNum = Array.isArray(value) ? value[0] : value;
    const newProgress = singleNum / 100.0;
    setProgress(newProgress);
  };

  const sizeClass =
    size === "large" ? "kb-80vw" : size === "medium" ? "kb-50vw" : "kb-20vw";
  return (
    <>
      <div className={`keyboard ${sizeClass}`}>
        {notes?.map((note) => {
          return <Key key={noteIndex(note)} note={note}></Key>;
        })}
      </div>
      <Slider
        size="small"
        defaultValue={0}
        aria-label="Small"
        valueLabelDisplay="auto"
        onChange={onSliderChange}
      />

      {/* Notes from: {from.name}{from.acc}{from.oct} to: {to.name}{to.acc}{to.oct}
      ({fromIndex}) ~ ({toIndex})
      <br>
      </br>
      Notes round trip from: {fromNote2.name}{fromNote2.acc}{fromNote2.oct} to: {toNote2.name}{toNote2.acc}{toNote2.oct} */}
    </>
  );
};

const C0: Note = {
  name: "C",
  oct: 0,
};
const B0: Note = {
  name: "B",
  oct: 0,
};
const D0: Note = {
  name: "D",
  oct: 0,
};
const C3: Note = {
  name: "C",
  oct: 3,
};
const CS0: Note = { ...C0, acc: "#" };

const WholeToneLightBG: KeyHighlighter[] = [
  new ModeBuilder(C0).AlternatingWholeTones().ColorDualLight().build(),
];

function Introduction() {
  return (
    <p>
      This is an interactive music theory tutorial that will introduce you to a
      non-standard method of learning all of the major scales as well as the
      major modes.
      <br /> The method I'll introduce doesn't require the linear following of a
      pattern that you may be used to: "whole, whole, half, whole, whole, whole,
      half" (don't worry if you're not familiar, we will review it below) and
      instead teaches you to see the scales as alternating groups of differnt
      kinds of notes "3 of one then 4 of another".
      <br />
      <br /> What are these two kinds of notes? Well in interest of not burying
      the lede I'm talking about the two whole tone scales and looking at the
      construction of the major scales and modes as clusters of notes from those
      to scales in alternate. If that isn't too clear, don't worry it's all
      layed out in detail below!
    </p>
  );
}

function TraditionalMethod() {
  const builder = new ModeBuilder(C0)
    .Ionian()
    .ColorSingleFirst()
    .BracketsWholeHalf()
    .Animate();
  const CMaj: KeyHighlighter[] = [builder.build()];
  builder.Note(D0);
  const DMaj: KeyHighlighter[] = [builder.build()];
  return (
    <>
      <h2>Introduction and Background</h2>
      <h3>The Traditional Major Scale Formula</h3>
      <p>
        Before we get to the non-standard approach let's review the more common
        one. Traditionally we're taught to identify the notes in the major
        scales by using a formula consisting of alternating whole and half
        steps. The formula you may be familiar with is:
        <br />
        <br />
        (Whole, Whole, Half, Whole, Whole, Whole, Half)
        <br />
        <br />
        Or for short:
        <br />
        <br />
        (w, w, h, w, w, w, h)
        <br />
        <br />
        Starting at the root note anotated 'r' below, "Whole (w)" means to skip
        a key on the keyboard, and "Half (h)" means to move to the key next to
        the current one without skipping. Notice that that last 'h' in the
        pattern brings us back to the root note an octave above and the pattern
        repeats.
        <br />
        <br />
        So starting on C we can make a C major scale like this:
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={CMaj}></Keys>
      <p>
        If we apply that same pattern but start on the next white key up from
        'C' which is 'D' we get this pattern for the D major scale:
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={DMaj}></Keys>
    </>
  );
}

function WholeToneScales() {
  const builder = new ModeBuilder(C0)
    .WholeTone()
    .ColorSingleFirst()
    .BracketsScaleNumbers()
    .Animate();
  const CWhole: KeyHighlighter[] = [builder.build()];
  builder.Note(CS0);
  builder.ColorSingleSecond()
  const CSWhole: KeyHighlighter[] = [builder.build()];
  const WholeZipped: KeyHighlighter[] = [
    new ModeBuilder(C0).WholeTone().build(),
    builder.build(),
  ];
  return (
    <>
      <h2>Detour - The Whole Tone Scales</h2>
      <h3>... of which there are two.</h3>
      <p>
        We have one more stop before we can apply the non-standard approach to
        building the major scales, that is, to become familiar with the whole
        tone scales.
        <br />
        <br />
        The whole tone scales are the scales you get when you start on a note
        and jump whole steps all the way up the keyboard until the next octave.
        You'll notice that whereever you start there are always 6 whole steps
        before the pattern repeats.
        <br />
        <br />
        So starting on C we can make a whole tone scale like this:
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={CWhole}></Keys>
      <p>
        If we apply that same pattern but start on the next key up from
        'C' which is 'C#' we get this pattern for the C-sharp whole-tone scale:
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={CSWhole}></Keys>
      <p>
        Notice how these two scales look quite similar but are somewhat like mirror images of one another.
        Another interesting thing to notice is how the white keys that surround
        a cluster of black keys belong to the whole-tone scale of the
        <strong>other</strong> cluster of black keys. For example, C, D, E
        surround the cluster of two black keys (C# and D#) but they are in the
        same whole tone scale as the three black key cluster (F#, G#, A#).
        <br/><br/>
        Going forward its going to be very useful to start thinking of these two
        scales in a visual way and starting to become familiar with their shapes
        and the relationship between which black keys and white keys belong to
        the same whole tone scales. I recommend playing with the two diagrams
        above until it starts making sense and becomes intuitive to you
        visually.
      </p>
      <h3>... putting them togehter</h3>
      <p>
        Since these two whole-tone scales comprise every note on the keyboard
        but have no overlap we can visualize the keyboard as if it were made of
        these two scales zipped together:
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={WholeZipped}></Keys>
    </>
  );
}

function MajorScalePattern() {
  const builder = new ModeBuilder(C0)
    .Ionian()
    .ColorDual()
    .BracketsRunNumbers()
    .Animate();
  const CMaj = builder.build();
  builder.Note(D0);
  const DMaj = builder.build();
  builder.Note(B0);
  const BMaj = builder.build();
  return (
    <>
      <h2>Major Scales</h2>
      <h3>The Whole-Tone Cluster Method</h3>
      <p>
        Now that we're familiar with the whole tone scales. Let's look at the C
        major scale again (the scale that is  all the white keys from C up to
        the next octave). This time instead of counting (w, w, h, w, w, w, h)
        let's just see where the notes of C major land on our established
        whole-tone scales.
        <br />
        <br />
        If we highlight the keyboard with the whole-tone scale on the keyboard
        and then look at the C major scale we'll notice a pattern:
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={[
        ...WholeToneLightBG,
        CMaj
      ]}></Keys>
      <p>
        As you can see above the C major scale is a pattern of 3 whole-tones from one scale, and then 4 from the other.
        <br/>
        I hope you'll agree that this much easier to rember than the traditional
        (w, w, h, w, w, w, h) formula, and maybe more importantly, you can just
        see the shape of the scale by really paying attention to that cluster of
        3 next to a cluster of 4.
        <br/>
        <br/>
        Let's try this pattern out starting on D as we did in the introduction to see the D Major scale as 3 and 4 whole tone clusters.
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={[
        ...WholeToneLightBG,
        DMaj
      ]}></Keys>
      <p>
        It can take some practice to really see those clusters of 3 and 4 but if
        you play with the slider above and slowly reveal the keys as you imagine
        jumping back and forth between those two whole tone scales, I believe it
        will start to come together.
        <br/>
        <br/>
        Now Let's look at B Major. You can still see the clusters of 3 and 4
        notes from each whole tone scale but the result of starting on B is that
        there are a lot more black notes in the resulting scale.
      </p>
      <Keys from={C0} to={C3} size="large" highlighterList={[
        ...WholeToneLightBG,
        BMaj
      ]}></Keys>
    </>
  );
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Whole Tone Scales to Major Modes</h1>
        <Introduction></Introduction>
        <TraditionalMethod></TraditionalMethod>
        <WholeToneScales></WholeToneScales>
        <MajorScalePattern></MajorScalePattern>
      </header>
    </div>
  );
}

export default App;
