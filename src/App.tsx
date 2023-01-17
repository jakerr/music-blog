import React from "react";
import { ModeBuilder } from "./ModeHighlighters";
import "./App.css";
import { KeyHighlighter } from "./KeyHighlighter";
import { SoundPlayerProvider } from "./SoundPlayer";
import { Keyboard } from "./Keyboard";
import { Note } from "./Notes";

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
      <Keyboard from={C0} to={C3} size="large" highlighterList={CMaj}></Keyboard>
      <p>
        If we apply that same pattern but start on the next white key up from
        'C' which is 'D' we get this pattern for the D major scale:
      </p>
      <Keyboard from={C0} to={C3} size="large" highlighterList={DMaj}></Keyboard>
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
  builder.Note(CS0)
    .ColorSingleSecond();
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
        before the pattern repeats. One fun thing about these scales is that
        they might remind you of the "dream sequence" transition sound that you
        hear in old movies and tv shows.
        <br />
        <br />
        So starting on C we can make a whole tone scale like this:
      </p>
      <Keyboard from={C0} to={C3} size="large" highlighterList={CWhole}></Keyboard>
      <p>
        If we apply that same pattern but start on the next key up from 'C'
        which is 'C#' we get this pattern for the C-sharp whole-tone scale:
      </p>
      <Keyboard from={C0} to={C3} size="large" highlighterList={CSWhole}></Keyboard>
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
        these two scales zipped together:
      </p>
      <Keyboard from={C0} to={C3} size="large" highlighterList={WholeZipped}></Keyboard>
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
  builder.Note(CS0);
  const CSMaj = builder.build();
  return (
    <>
      <h2>The Whole-Tone Cluster Method</h2>
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
        size="large"
        highlighterList={[...WholeToneLightBG, CMaj]}
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
        size="large"
        highlighterList={[...WholeToneLightBG, DMaj]}
      ></Keyboard>
      <p>
        It can take some practice to really see those clusters of 3 and 4 but if
        you play with the slider above and slowly reveal the keys as you imagine
        jumping back and forth between those two whole tone scales, I believe it
        will start to come together.
        <br />
        <br />
        Now Let's look at all of the other major scales.  You can build all of
        them using this same pattern of 3 of one whole tone scale, and 4 of the
        other. There's a new slider added below that lets you change the root
        note so that you can see this 3-and-4 pattern applied to each root note
        to give you all 12 major scales.
      </p>
      <Keyboard
        from={C0}
        to={C3}
        size="large"
        highlighterList={[...WholeToneLightBG, CSMaj]}
        canTranspose={true}
      ></Keyboard>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <SoundPlayerProvider>
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1>Whole Tone Scales to Major Modes</h1>
          <Introduction></Introduction>
          <TraditionalMethod></TraditionalMethod>
          <WholeToneScales></WholeToneScales>
          <MajorScalePattern></MajorScalePattern>
        </header>
      </SoundPlayerProvider>
    </div>
  );
}

export default App;
