import { Note } from "./App";
import { KeyHighlighter, KeyHighlighterOptionsBuilder } from "./KeyHighlighter";

type MajorMode = "Ionian" | "Dorian" | "Phrygian" | "Lydian" | "Mixolydian" | "Aeolian" | "Locrian";
type MajorModeMap = {
  [key in MajorMode]: number[];
};

const MajorModes: MajorModeMap = {
  Ionian: [3, 4],
  Dorian: [2, 4, 1],
  Phrygian: [1, 4, 2],
  Lydian: [4, 3],
  Mixolydian: [3, 3, 1],
  Aeolian: [2, 3, 2],
  Locrian: [1, 3, 3],
};

class ModeHighlighterOptionsBuilder extends KeyHighlighterOptionsBuilder {
  mode(mode: MajorMode) {
    const pattern = MajorModes[mode];
    super.pattern(pattern);
    return this;
  }
}

export class ModeBuilder {
  private _opts: ModeHighlighterOptionsBuilder = new ModeHighlighterOptionsBuilder();
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

  Animate() {
    this._opts.shouldAnimate(true);
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

  OnHighlight(fn: (note: Note) => void) {
    this._opts.onHighlight(fn);
    return this;
  }

  build(): KeyHighlighter {
    return new KeyHighlighter(this._opts.build());
  }
}