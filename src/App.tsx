import { MajorMode, MajorModes, ModeBuilder } from "./ModeHighlighters";
import "./App.css";
import { KeyHighlighter } from "./KeyHighlighter";
import { SoundPlayerProvider } from "./SoundPlayer";
import { Keyboard } from "./Keyboard";
import { GlobalOptionsProvider } from "./GlobalOptions";
import { noteNamed } from "./Notes";
// import { C0, D0, C3, CS0 } from "./NoteMacros";

const C0 = noteNamed("C0");
const CS0 = noteNamed("C#0");
const D0 = noteNamed("D0");
const C3 = noteNamed("C3");

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
      two scales in alternate. If that isn't too clear, don't worry it's all
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
      <Keyboard
        from={C0}
        to={C3}
        size="large"
        staticHighlighters={CMaj}
        shouldAnimate={true}
      ></Keyboard>
      <p>
        If we apply that same pattern but start on the next white key up from
        'C' which is 'D' we get this pattern for the D major scale:
      </p>
      <Keyboard
        from={C0}
        to={C3}
        size="large"
        staticHighlighters={DMaj}
        shouldAnimate={true}
      ></Keyboard>
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
  builder.Note(CS0).ColorSingleSecond();
  const CSWhole: KeyHighlighter[] = [builder.build()];
  const specialCaseBg = new ModeBuilder(C0)
    .AlternatingWholeTones()
    .ColorDualLight()
    .build();
  specialCaseBg.opts.forceBG = true;
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
        before the pattern repeats. One fun thing about these scales is that
        they might remind you of the "dream sequence" transition sound that you
        hear in old movies and tv shows.
        <br />
        <br />
        So starting on C we can make a whole tone scale like this:
      </p>
      <Keyboard
        from={C0}
        to={C3}
        size="large"
        staticHighlighters={CWhole}
        shouldAnimate={true}
      ></Keyboard>
      <p>
        If we apply that same pattern but start on the next key up from 'C'
        which is 'C#' we get this pattern for the C-sharp whole-tone scale:
      </p>
      <Keyboard
        from={C0}
        to={C3}
        size="large"
        staticHighlighters={CSWhole}
        shouldAnimate={true}
      ></Keyboard>
      <p>
        Notice how these two scales look quite similar but are somewhat like
        mirror images of one another. Another interesting thing to notice is how
        the white keys that surround a cluster of black keys belong to the
        whole-tone scale of the
        <strong> other</strong> cluster of black keys. For example: C, D and E
        surround the cluster of two black keys (C# and D#) but they are in the
        same whole tone scale as the three black key cluster (F#, G# and A#).
        <br />
        <br />
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
        these two scales zipped together.
      </p>
      <Keyboard
        from={C0}
        to={C3}
        size="large"
        staticHighlighters={[specialCaseBg]}
      />
      <p>
        In further sections the keyboard can be highlighted with this above
        visual aide to remind you of the whole-tone scales by enabling the
        "HIGHLIGHT WHOLETONES" option in the settings at the bottom right of the
        screen. It will be off by default to reduce visual clutter and help us
        train to start seeing the whole-tone scale as they relate to the "blacks
        and whites".
      </p>
    </>
  );
}

function MajorScalePattern() {
  return (
    <>
      <h3>Major Scales</h3>
      <p>
        Now that we're familiar with the whole tone scales. Let's look at the C
        major scale again (the scale that is all the white keys from C up to the
        next octave). This time instead of counting (w, w, h, w, w, w, h) let's
        just see where the notes of C major land on our established whole-tone
        scales.
        <br />
        <br />
        If we highlight the keyboard with the whole-tone scale on the keyboard
        and then look at the C major scale we'll notice a pattern:
      </p>
      <Keyboard
        from={C0}
        to={C3}
        scaleStart={noteNamed("C0")}
        scaleMode="Ionian"
        size="large"
        shouldAnimate={true}
      ></Keyboard>
      <p>
        As you can see above the C major scale is a pattern of 3 whole-tones
        from one scale, and then 4 from the other.
        <br />
        I hope you'll agree that this much easier to rember than the traditional
        (w, w, h, w, w, w, h) formula, and maybe more importantly, you can just
        see the shape of the scale by really paying attention to that cluster of
        3 next to a cluster of 4.
        <br />
        <br />
        Let's try this pattern out starting on D as we did in the introduction
        to see the D Major scale as 3 and 4 whole tone clusters.
      </p>
      <Keyboard
        from={C0}
        to={C3}
        scaleStart={noteNamed("D0")}
        scaleMode="Ionian"
        size="large"
        shouldAnimate={true}
      ></Keyboard>
      <p>
        It can take some practice to really see those clusters of 3 and 4 but if
        you play with the slider above and slowly reveal the keys as you imagine
        jumping back and forth between those two whole tone scales, I believe it
        will start to come together.
        <br />
        <br />
        Now Let's look at all of the other major scales. You can build all of
        them using this same pattern of 3 of one whole tone scale, and 4 of the
        other. There's a new slider added below that lets you change the root
        note so that you can see this 3-and-4 pattern applied to each root note
        to give you all 12 major scales.
      </p>
      <Keyboard
        from={C0}
        to={C3}
        scaleStart={noteNamed("C#0")}
        scaleMode="Ionian"
        size="large"
        canTranspose={true}
        shouldAnimate={true}
      ></Keyboard>
    </>
  );
}

function MinorScalePattern() {
  return (
    <>
      <h3>Minor Scales</h3>
      <p>
        Another scale you may have heard of is the minor scale.  This is the
        scale that you get when you start on A and use every white key up to the
        next A.
        <br/>
        <br/>
        Notice that when we start on A the whole-tones have a differnt pattern,
        now it's [2, 3, 2].  Starting on A, the minor scale has all white keys,
        but lets see what happens when you move this 2, 3, 2 pattern down to C
        (use the slider to explore).
      </p>
      <Keyboard
        from={C0}
        to={C3}
        scaleStart={noteNamed("A0")}
        scaleMode="Aeolian"
        size="large"
        canTranspose={true}
      ></Keyboard>
    </>
  );
}

const GenericModePattern: React.FC<{
  modeName: MajorMode,
  noteName: string
}> = ({modeName, noteName}) => {
  const pattern = MajorModes[modeName];
  const patternString = pattern.join(', ');
  return (
    <>
      <h3>{modeName} Mode</h3>
      <p>
        {modeName} is the mode that you get when you start on {noteName} and use every white
        key up to the next {noteName}.
        <br/>
        <br/>
        Notice that when we start on {noteName} the whole-tones have a differnt pattern
        from our other modes thus far.
        The {modeName} pattern is [{patternString}]. Starting on {noteName}, the {modeName} mode has all white keys,
        but lets see what happens when you move this {patternString} pattern down to C
        (use the slider to explore).
      </p>
      <Keyboard
        from={C0}
        to={C3}
        scaleStart={noteNamed(noteName)}
        scaleMode={modeName}
        size="large"
        shouldAnimate={true}
        canTranspose={true}
        canChangeMode={true}
      ></Keyboard>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <GlobalOptionsProvider>
        <SoundPlayerProvider>
          <header className="App-header">
            {/* <img src={logo} className="App-logo" alt="logo" /> */}
            <h1>Whole Tone Scales to Major Modes</h1>
            <Introduction/>
            <TraditionalMethod/>
            <WholeToneScales/>
            <h2>The Whole-Tone Cluster Method</h2>
            <MajorScalePattern/>
            <MinorScalePattern/>
            <h3>Other Major Modes</h3>
            I've used the word "mode" now a couple of times but haven't defined
            it. A mode put simpily is a scale that is built by starting on
            any white key and including all the white keys up to the next octave.
            <br/>
            <br/>
            Above we've already constructed two of the modes the Major mode
            starting on C and the minor mode starting on A. These are just two
            of seven possible modes (since we have 7 white keys). Each of these
            modes have a different pattern of whole-tone clusters that we can
            memorize, and they each also have a distict sound.
            <br/>
            <br/>
            The seven modes are:
            <ol>
              <li>Ionian -- C to C (also called Major)</li>
              <li>Dorian starting on D</li>
              <li>Phrygian starting on E</li>
              <li>Lydian starting on F</li>
              <li>Mixolydian starting on G</li>
              <li>Aeolean starting on A (also called Minor)</li>
              <li>Locrian starting on B</li>
            </ol>
            Since we already coverd the first and sixth modes let's look at the
            remaining 5 below.
            <br/>
            <br/>
            In each of the remaining modes we'll start the visualization on the
            root note such that all of the keys are white and count the
            whole-tone clusters to see how we can transpose this mode to other
            keys.
            <GenericModePattern modeName="Dorian" noteName="D"/>
            <GenericModePattern modeName="Phrygian" noteName="E"/>
            <GenericModePattern modeName="Lydian" noteName="F"/>
            <GenericModePattern modeName="Mixolydian" noteName="G"/>
            <GenericModePattern modeName="Locrian" noteName="B"/>
          </header>
        </SoundPlayerProvider>
      </GlobalOptionsProvider>
    </div>
  );
}

export default App;
