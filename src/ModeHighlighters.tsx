import { Note } from "./Notes";
import { KeyHighlighter, KeyHighlighterOptionsBuilder } from "./KeyHighlighter";

export type MajorMode =
  | "Ionian"
  | "Dorian"
  | "Phrygian"
  | "Lydian"
  | "Mixolydian"
  | "Aeolian"
  | "Locrian"
  | "Whole Tone";
type MajorModeMap = {
  [key in MajorMode]: number[];
};

export function prettyModeName(
  scaleMode: MajorMode,
  convention: "easy" | "technical" | "both"
): string {
  switch (scaleMode) {
    case "Ionian":
      return convention === "easy"
        ? "Major"
        : convention === "technical"
        ? "Ionian"
        : "Major (Ionian)";
    case "Aeolian":
      return convention === "easy"
        ? "Minor"
        : convention === "technical"
        ? "Aeolian"
        : " Minor (Aeolian)";
    default:
      return scaleMode;
  }
}

export function prettyPattern(
  scaleMode: MajorMode,
  convention: "whole-clusters" | "whole-half"
): string {
  const pattern = MajorModes[scaleMode];
  if (convention === "whole-clusters") {
    return pattern.join(", ");
  }
  // Whole halfs
  let result = "";
  let halfs = 0;
  let steps = [];
  for (const cluster of pattern) {
    if (result.length > 0) {
      result += ", ";
    }
    for (let i = 1; i < cluster; i++) {
      steps.push("W");
      halfs += 2;
    }
    if (halfs === 10) {
      // Special case for scales that end in a whole step.
      steps.push("W");
      halfs += 2;
    } else {
      steps.push("H");
      halfs += 1;
    }
  }
  return steps.join(", ");
}

export const MajorModes: MajorModeMap = {
  Ionian: [3, 4],
  Dorian: [2, 4, 1],
  Phrygian: [1, 4, 2],
  Lydian: [4, 3],
  Mixolydian: [3, 3, 1],
  Aeolian: [2, 3, 2],
  Locrian: [1, 3, 3],
  // Special case: Whole tone scale
  "Whole Tone": [6],
};

class ModeHighlighterOptionsBuilder extends KeyHighlighterOptionsBuilder {
  mode(mode: MajorMode) {
    const pattern = MajorModes[mode];
    super.pattern(pattern);
    return this;
  }
}

export class ModeBuilder {
  private _opts: ModeHighlighterOptionsBuilder =
    new ModeHighlighterOptionsBuilder();
  constructor(startNote: Note) {
    this._opts.startNote(startNote);
  }

  Note(note: Note) {
    this._opts.startNote(note);
    return this;
  }

  AlternatingWholeTones() {
    this._opts.pattern(Array(12).fill(1));
    return this;
  }

  WholeTone() {
    this._opts.pattern([6]);
    return this;
  }

  ModeNamed(name: MajorMode) {
    this._opts.mode(name);
    return this;
  }

  Ionian() {
    this._opts.mode("Ionian");
    return this;
  }

  Dorian() {
    this._opts.mode("Dorian");
    return this;
  }

  Phrygian() {
    this._opts.mode("Phrygian");
    return this;
  }

  Lydian() {
    this._opts.mode("Lydian");
    return this;
  }

  Mixolydian() {
    this._opts.mode("Mixolydian");
    return this;
  }

  Aeolean() {
    this._opts.mode("Aeolian");
    return this;
  }

  Locrean() {
    this._opts.mode("Locrian");
    return this;
  }

  BracketsWholeHalf() {
    this._opts.bracketStyle("whole-half");
    return this;
  }

  BracketsRunNumbers() {
    this._opts.bracketStyle("run-num");
    return this;
  }

  BracketsScaleNumbers() {
    this._opts.bracketStyle("scale-num");
    return this;
  }

  Animate(shouldAnimate = true) {
    this._opts.shouldAnimate(shouldAnimate);
    return this;
  }

  ColorSingleFirst() {
    this._opts.oddColor("color-1");
    this._opts.evenColor("color-1");
    return this;
  }

  ColorSingleSecond() {
    this._opts.oddColor("color-2");
    this._opts.evenColor("color-2");
    return this;
  }

  ColorDual() {
    this._opts.oddColor("color-1");
    this._opts.evenColor("color-2");
    return this;
  }

  ColorDualLight() {
    this._opts.oddColor("color-1 lighten");
    this._opts.evenColor("color-2 lighten");
    return this;
  }

  build(): KeyHighlighter {
    return new KeyHighlighter(this._opts.build());
  }
}
