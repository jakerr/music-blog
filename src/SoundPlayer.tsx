import { createContext, PropsWithChildren } from "react";
import { Note, noteIndex } from "./Notes";

export const SoundPlayerContext = createContext<SoundPlayer | null>(null);

type NoteLength = 1 | 2 | 4 | 8 | 16 | 32;

type ASDR = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

type VoiceParams = {
  gain: number;
  asdr: ASDR;
  modDepth: number;
  modRatio: number;
  carrierRatio: number;
  carrierWave: OscillatorType;
  modWave: OscillatorType;
};

class FMSynthVoice {
  private carrier: OscillatorNode;
  private modulator: OscillatorNode;
  private gain: GainNode;
  private modDepth: GainNode;
  private params: VoiceParams;

  constructor(context: AudioContext, params: VoiceParams) {
    this.params = params;
    this.carrier = context.createOscillator();
    this.modulator = context.createOscillator();
    this.gain = context.createGain();
    this.modDepth = context.createGain();

    this.modulator.type = "square";
    this.carrier.frequency.value = this.params.carrierRatio * 440;
    this.modulator.frequency.value = this.params.modRatio * 440;
    this.modulator.connect(this.modDepth).connect(this.carrier.frequency);
    this.carrier.connect(this.gain);
    this.gain.connect(context.destination);

    this.modDepth.gain.value = this.params.modDepth;
    this.gain.gain.value = 0;
    this.carrier.start();
    this.modulator.start();
  }

  private applyASDR(
    param: AudioParam,
    start: number,
    duration: number,
    asdr: ASDR,
    gain: number
  ) {
    param.setValueAtTime(0, start);
    param.linearRampToValueAtTime(gain, start + asdr.attack);
    param.linearRampToValueAtTime(
      asdr.sustain * gain,
      start + asdr.attack + asdr.decay
    );
    param.linearRampToValueAtTime(0, start + duration + asdr.release);
  }

  public setFrequencyAtTime(frequency: number, time: number) {
    const cF = this.params.carrierRatio * frequency;
    const mF = this.params.modRatio * frequency;
    this.carrier.frequency.setValueAtTime(cF, time);
    this.modulator.frequency.setValueAtTime(mF, time);
  }

  public setModulationDepth(depth: number) {
    this.gain.gain.value = depth;
  }

  public playNoteAt(start: number, note: number, duration: number) {
    const frequency = 440 * Math.pow(2, (note - 69) / 12);
    this.gain.gain.setValueAtTime(0, start);
    this.setFrequencyAtTime(frequency, start);
    this.applyASDR(
      this.gain.gain,
      start,
      duration,
      this.params.asdr,
      this.params.gain
    );
  }
}

class FMSynthVoiceLayer {
  private _voices: FMSynthVoice[];

  constructor(voices: FMSynthVoice[]) {
    this._voices = voices;
  }

  public playNoteAt(start: number, note: number, duration: number) {
    for (let v of this._voices) {
      v.playNoteAt(start, note, duration);
    }
  }
}

class FMSynth {
  private _context: AudioContext;
  private _voices: FMSynthVoiceLayer[];
  private _currentVoice: number;

  constructor() {
    const transient = {
      asdr: {
        attack: 0.001,
        decay: 0.001,
        sustain: 0.01,
        release: 0.2,
      },
      gain: 0.1,
      modDepth: 200,
      modRatio: 24,
      carrierRatio: 3,
      carrierWave: "sine" as OscillatorType,
      modWave: "triangle" as OscillatorType,
    };
    const mainVoiceParams = {
      asdr: {
        attack: 0.01,
        decay: 0.03,
        sustain: 0.3,
        release: 0.2,
      },
      gain: 0.4,
      modDepth: 10,
      modRatio: 4,
      carrierRatio: 1,
      carrierWave: "sine" as OscillatorType,
      modWave: "sine" as OscillatorType,
    };
    this._context = new AudioContext();
    this._voices = [];
    this._currentVoice = 0;
    for (let i = 0; i < 3; i++) {
      const v1 = new FMSynthVoice(this._context, transient);
      const v2 = new FMSynthVoice(this._context, mainVoiceParams);
      const voiceLayer = new FMSynthVoiceLayer([v1, v2]);
      this._voices.push(voiceLayer);
    }
  }

  public isReady(): boolean {
    return this._context.state === "running";
  }

  public makeReady() {
    if (!this.isReady()) {
      this._context.resume();
    }
  }

  public contextTime(): number {
    return this._context.currentTime;
  }

  public playNoteAt(start: number, note: number, duration: number) {
    this._voices[this._currentVoice].playNoteAt(start, note, duration);
    this._currentVoice = (this._currentVoice + 1) % this._voices.length;
  }
}

export class SoundPlayer {
  private _synth?: FMSynth;
  private _beatLength: number;
  private _nextNoteTime: number;
  private _octave: number;

  constructor(bpm: number) {
    this._octave = 4;
    this._beatLength = (4 * 60) / bpm;
    this._nextNoteTime = 0;
  }

  isReady(): boolean {
    return this._synth !== undefined && this._synth.isReady();
  }

  playChord(notes: Note[], length: NoteLength) {
    if (this._synth === undefined) {
      this._synth = new FMSynth();
    }
    this._synth.makeReady();
    const noteStart = Math.max(this._nextNoteTime, this._synth!.contextTime());
    const noteLen = this._beatLength / length;
    const tones = notes.map((n) => noteIndex(n) + 12 * this._octave);
    //Todo make this play a chord instead of just the first note.
    this._synth!.playNoteAt(noteStart, tones[0], noteLen);
    this._nextNoteTime = noteStart + noteLen;
  }

  playNote(note: Note, length: NoteLength) {
    this.playChord([note], length);
  }
}

export const SoundPlayerProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const player = new SoundPlayer(120);

  return (
    <SoundPlayerContext.Provider value={player}>
      {children}
    </SoundPlayerContext.Provider>
  );
};
