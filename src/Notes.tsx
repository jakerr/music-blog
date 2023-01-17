
type NaturalNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";
type Accidental = "#" | "b" | undefined;
export type Note = {
  name: NaturalNote;
  acc?: Accidental;
  oct: number;
  highlight?: string;
  bracket?: "left" | "middle" | "right" | "solo";
  bracketColor?: "bracket-color-1" |
  "bracket-color-2" |
  "bracket-color-1 lighten" |
  "bracket-color-2 lighten";
  bracketLabel?: string;
  playable?: boolean;
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

export const noteNamed = (name: string): Note => {
  const naturalName = name.substring(0, 1) as NaturalNote;
  let acc: Accidental = undefined;
  let chIdx = 1;
  const ch = name[chIdx];
  if (ch === '#' || ch === 'b') {
    acc = `${ch}` as Accidental;
    chIdx++;
  }
  const oct = parseInt(name.substring(chIdx));
  return {
    name: naturalName,
    acc,
    oct
  }
};

export const noteIndex = (note: Note): number => {
  const offset = accidentalOffset(note.acc);
  const noteOrder = CHROMA.indexOf(note.name) + offset;
  return note.oct * 12 + noteOrder;
};

export const noteForIndex = (idx: number): Note => {
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
export const noteColor = (note: Note): string => {
  const offset = accidentalOffset(note.acc);
  return offset === 0 ? "white" : "black";
};
export function bracketClass(bracket?: "left" | "middle" | "right" | "solo") {
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


