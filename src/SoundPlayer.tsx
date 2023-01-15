import {createContext, useRef, useEffect, useState, PropsWithChildren} from 'react'
import MIDISounds from 'midi-sounds-react'
import { Note, noteIndex } from './App';

export const SoundPlayerContext = createContext<SoundPlayer | null>(null);

export class SoundPlayer {
  private _midiSounds: MIDISounds;

  constructor(midiSounds: MIDISounds) {
    this._midiSounds = midiSounds;
  }

  playChord() {
    this._midiSounds.playChordNow(43, [60], 2.5);
  }

  playNote(note: Note) {
    const noteId = noteIndex(note) + (12 * 4);
    this._midiSounds.playChordNow(43, [noteId], 0.2);
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
    setPlayer(new SoundPlayer(midiSoundsRef.current));
  }, [midiSoundsRef]);


  return (
    <SoundPlayerContext.Provider value={player}>
      {children}
      <MIDISounds
        ref={midiSoundsRef} 
        appElementName="root"
        instruments={[43]}></MIDISounds>
    </SoundPlayerContext.Provider> 
  );
}
