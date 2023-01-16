import { Note, noteIndex } from "./Notes";

type HighlighterColor = "color-1" | "color-2" | "color-1 lighten" | "color-2 lighten";
type BracketStyle = "none" | "scale-num" | "run-num" | "whole-half";

type KeyHighlighterOptions = {
  startNote: Note,
  pattern: number[],
  oddColor: HighlighterColor,
  evenColor: HighlighterColor,
  shouldAnimate: boolean,
  bracketStyle: BracketStyle,
}

export class KeyHighlighterOptionsBuilder {
  private _startNote: Note = {name: "C", oct: 0};
  private _pattern: number[] = [3, 4];
  private _oddColor: HighlighterColor = "color-1";
  private _evenColor: HighlighterColor = "color-2";
  private _shouldAnimate: boolean = false;
  private _bracketStyle: BracketStyle = "none";

  startNote(startNote: Note) {
    this._startNote = startNote;
    return this;
  }

  pattern(pattern: number[]) {
    this._pattern = pattern;
    return this;
  }

  oddColor(oddColor: HighlighterColor) {
    this._oddColor = oddColor;
    return this;
  }

  evenColor(evenColor: HighlighterColor) {
    this._evenColor = evenColor;
    return this;
  }

  shouldAnimate(shouldAnimate: boolean) {
    this._shouldAnimate = shouldAnimate;
    return this;
  }

  bracketStyle(bracketStyle: "none" | "scale-num" | "run-num" | "whole-half") {
    this._bracketStyle = bracketStyle;
    return this;
  }

  build(): KeyHighlighterOptions {
    return {
      startNote: this._startNote,
      pattern: this._pattern,
      oddColor: this._oddColor,
      evenColor: this._evenColor,
      shouldAnimate: this._shouldAnimate,
      bracketStyle: this._bracketStyle,
    };
  }
}


export class KeyHighlighter {
  opts: KeyHighlighterOptions;

  patternIndex = 0;
  parity: "odd" | "even" | "searching" = "searching";
  currentRun: number = 0;
  scaleNumber: number = 0;
  runTarget: number = 0;
  halfSteps: number = 0;
  step: "root" | "half" | "whole" = "root";

  constructor(options: KeyHighlighterOptions) {
    this.opts = options;
  }

  reset() {
    this.parity = "searching";
    this.currentRun = 0;
    this.scaleNumber = 0;
    this.halfSteps = 0;
    this.patternIndex = 0;
    this.step = "root";
  }

  startRun(note: Note) {
    let bracketPos: "middle" | "left" = this.scaleNumber > 1 ? "middle" : "left";
    this.addBracket(note, bracketPos);
    this.halfSteps = 0;
    this.runTarget = this.opts.pattern[this.patternIndex];
    this.patternIndex = this.patternIndex + 1;
    this.doHighlight(note);
  }

  addBracket(note: Note, bracket: "left" | "right" | "middle") {
    if (this.opts.bracketStyle !== "none") {
      note.bracket = bracket;
      note.bracketColor = this.parity === "odd" ? `bracket-${this.opts.oddColor}` : `bracket-${this.opts.evenColor}`;
    }
  }

  addBracketLabel(note: Note) {
    if (this.opts.bracketStyle !== "none") {
      let label = ""
      switch (this.opts.bracketStyle) {
        case 'run-num':
          label = `${this.currentRun}`
          break;

        case 'scale-num':
          label = `${this.scaleNumber}`
          break;

        case 'whole-half':
          label = "" + this.step.charAt(0);
          break;
      
        default:
          break;
      }

      note.bracketLabel = `${label}`;
    }
  }

  endRun(note: Note) {
    let bracketPos: "middle" | "right" = (this.scaleNumber > 1 && this.scaleNumber < 7) ? "middle" : "right";
    this.addBracket(note, bracketPos);
    this.parity = this.parity === "odd" ? "even" : "odd";
    if (this.patternIndex >= this.opts.pattern.length) {
      this.parity = "searching";
      this.step = "root";
      this.patternIndex = 0;
    }
    this.currentRun = 0;
  }

  doHighlight(note: Note) {
    const color = this.parity === "odd" ? `tone-${this.opts.oddColor}` : `tone-${this.opts.evenColor}`;
    this.currentRun += 1;
    this.scaleNumber += 1;
    if (this.opts.shouldAnimate) {
      note.playable = true;
    }
    note.highlight = color;
    this.addBracketLabel(note);
    if (this.currentRun >= this.runTarget) {
      this.endRun(note);
    }
  }

  accept(note: Note) {
    const targetName = this.opts.startNote.name + (this.opts.startNote.acc ?? "");
    const noteName = note.name + (note.acc ?? "");
    note.bracket = undefined;
    // Not yet highlighting
    if (this.parity === "searching") {
      if (targetName === noteName) {
        this.parity = noteIndex(note) % 2 === 0 ? "odd" : "even";
        this.step = this.halfSteps === 0 ? "root" : "half";
        this.scaleNumber = 0;
        this.startRun(note);
        return;
      }
      return;
    }

    this.halfSteps += 1;
    if (this.currentRun <= 0) {
      this.step = "half";
      this.startRun(note);
      return;
    }

    this.addBracket(note, "middle");
    if (this.halfSteps % 2 === 0) {
      this.step = "whole";
      this.doHighlight(note);
      return;
    }
    return;
  }
}
