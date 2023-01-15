declare module "midi-sounds-react" {
  interface MIDISoundsProps {
    appElementName: string;
    instruments?: any;
    drums?: any;
  }

  export default MIDISounds;
  declare class MIDISounds extends React.Component<MIDISoundsProps> {
    constructor(props: MIDISoundsProps);
    state: {
      showModal: boolean;
      appElementName: any;
      instruments: any;
      drums: any;
      master: number;
      echo: number;
      q32: number;
      q64: number;
      q128: number;
      q256: number;
      q512: number;
      q1k: number;
      q2k: number;
      q4k: number;
      q8k: number;
      q16k: number;
    };
    handleOpenModal(): void;
    handleCloseModal(): void;
    midiStatus: string;
    render(): JSX.Element;
    contextTime(): any;
    onSetNone(): void;
    onSetDance(): void;
    onSetPower(): void;
    onChangeMaster(e: any): void;
    onChangeEcho(e: any): void;
    onChangeQ32(e: any): void;
    onChangeQ64(e: any): void;
    onChangeQ128(e: any): void;
    onChangeQ256(e: any): void;
    onChangeQ512(e: any): void;
    onChangeQ1k(e: any): void;
    onChangeQ2k(e: any): void;
    onChangeQ4k(e: any): void;
    onChangeQ8k(e: any): void;
    onChangeQ16k(e: any): void;
    refreshCache(): void;
    getProperties(): {
      master: number;
    };
    showPropertiesDialog(): void;
    initAudio(): void;
    audioContext: any;
    destination: any;
    player: any;
    equalizer: any;
    output: any;
    echo: any;
    volumesInstrument: any[];
    volumesDrum: any[];
    midiNotes: any[];
    cacheInstrument(n: any): void;
    cacheDrum(n: any): void;
    playDrum(when: any, drum: any): void;
    playDrumsAt(when: any, drums: any): void;
    volumeInstrumentAdjust(instrument: any): any;
    volumeDrumAdjust(drum: any): any;
    startPlayLoop(beats: any, bpm: any, density: any, fromBeat: any): void;
    loopStarted: boolean;
    beatIndex: any;
    loopIntervalID: NodeJS.Timer;
    stopPlayLoop(): void;
    cancelQueue(): void;
    playBeatAt(when: any, beat: any, bpm: any): void;
    playChordAt(when: any, instrument: any, pitches: any, duration: any): void;
    playStrumUpAt(
      when: any,
      instrument: any,
      pitches: any,
      duration: any
    ): void;
    playStrumDownAt(
      when: any,
      instrument: any,
      pitches: any,
      duration: any
    ): void;
    playSnapAt(when: any, instrument: any, pitches: any, duration: any): void;
    midNoteOn(pitch: any, velocity: any): void;
    midiNoteOff(pitch: any): void;
    midiOnMIDImessage(event: any): void;
    midiOnStateChange(event: any): void;
    requestMIDIAccessSuccess(midi: any): void;
    requestMIDIAccessFailure(e: any): void;
    startMIDIInput(): void;
    playDrumsNow(drums: any): void;
    playChordNow(instrument: any, pitches: any, duration: any): void;
    playStrumUpNow(instrument: any, pitches: any, duration: any): void;
    playStrumDownNow(instrument: any, pitches: any, duration: any): void;
    playSnapNow(instrument: any, pitches: any, duration: any): void;
    setMasterVolume(volume: any): void;
    setInstrumentVolume(instrument: any, volume: any): void;
    setDrumVolume(drum: any, volume: any): void;
    setEchoLevel(value: any): void;
    setBand32(level: any): void;
    setBand64(level: any): void;
    setBand128(level: any): void;
    setBand256(level: any): void;
    setBand512(level: any): void;
    setBand1k(level: any): void;
    setBand2k(level: any): void;
    setBand4k(level: any): void;
    setBand8k(level: any): void;
    setBand16k(level: any): void;
    setKeyboardInstrument(n: any): void;
    miditone: Window;
  }
}