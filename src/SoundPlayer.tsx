import {createContext, useRef, useEffect, useState, PropsWithChildren} from 'react'
import MIDISounds from 'midi-sounds-react'
import { Note, noteIndex } from "./Notes";

export const SoundPlayerContext = createContext<SoundPlayer | null>(null);

type NoteLength = 1 | 2 | 4 | 8 | 16 | 32;

export class SoundPlayer {
  private _midiSounds: MIDISounds;
  private _beatLength: number;
  private _nextNoteTime: number;

  constructor(midiSounds: MIDISounds, bpm: number) {
    this._midiSounds = midiSounds;
    this._beatLength = 4 * 60 / bpm;
    this._nextNoteTime = 0;
  }

  playChord(notes: Note[], length: NoteLength) {
    const noteStart = Math.max(this._nextNoteTime, this._midiSounds.contextTime());
    const noteLen = this._beatLength / length;
    const tones = notes.map(n => noteIndex(n) + 12 * 4);
    this._midiSounds.playChordAt(noteStart, 4, tones, noteLen);
    this._nextNoteTime = noteStart + noteLen;
  }

  playNote(note: Note, length: NoteLength) {
    this.playChord([note], length);
  }
}

interface SoundPlayerProviderProps {
  children: React.ReactNode
}

export const SoundPlayerProvider: React.FC<PropsWithChildren> = ({children}) => {
  const [player, setPlayer] = useState<SoundPlayer | null>(null);
  const midiSoundsRef = useRef<MIDISounds>(null);
  useEffect(() => {
    if (!midiSoundsRef.current) return;
    midiSoundsRef.current.setEchoLevel(0.09);
    midiSoundsRef.current.setMasterVolume(0.5);
    setPlayer(new SoundPlayer(midiSoundsRef.current, 120));
  }, [midiSoundsRef]);


  return (
    <SoundPlayerContext.Provider value={player}>
      {children}
      <MIDISounds
        ref={midiSoundsRef} 
        appElementName="root"
        instruments={[4]}></MIDISounds>
    </SoundPlayerContext.Provider> 
  );
}
