// Enable WEBMIDI.js and trigger the onEnabled() function when ready
WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));

let deviceElement;
let chordToPlayElement;
let heldNotesElement;
let heldChordElement;

let currentlyHeldNotes = new Set();
let currentlyHeldKeys = new Set();

let chordToPlay = "";
let lastDetectedChords = [];

var notyf;

// Function triggered when WEBMIDI.js is ready
function onEnabled() {

    notyf = new Notyf({
        duration: 800,
        position: {
            x: 'center',
            y: 'top'
        }});

    deviceElement = document.getElementById("midi-devices");
    chordToPlayElement = document.getElementById("chord-to-play");
    heldNotesElement = document.getElementById("held-notes");
    heldChordElement = document.getElementById("held-chord");

    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
        deviceElement.innerHTML+= "No device detected.";
    } else {
        WebMidi.inputs.forEach((device, index) => {
            deviceElement.innerHTML+= `${index}: ${device.name} <br>`;
        });
    }

    const mySynth = WebMidi.inputs[0];
    // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")

    //subscribe to first channel of first device
    // mySynth.channels[1].addListener("noteon", e => {
    //     document.body.innerHTML+= `${e.note.name} ${e.note.identifier}<br>`;
    //     console.log(e.note);
    // });

    mySynth.channels[1].addListener("noteon", NoteOnHandler)
    mySynth.channels[1].addListener("noteoff", NoteOffHandler)

    chordToPlay = getNextRandomChord()
    redrawChordToPlay()

}

function NoteOnHandler(e)
{
    // console.log(e)
    currentlyHeldNotes.add(e.note.identifier)
    currentlyHeldKeys.add(e.note.number)
    redrawHeldNotes()

    checkIfCorrectAndProceed();
}

function NoteOffHandler(e)
{
    // console.log(e)
    currentlyHeldNotes.delete(e.note.identifier)
    currentlyHeldKeys.delete(e.note.number)
    redrawHeldNotes()
}

function redrawChordToPlay()
{
    chordToPlayElement.innerHTML = chordToPlay;
}

function redrawHeldNotes()
{
    let heldNotesText = ""
    // console.log(currentlyHeldNotes)
    currentlyHeldNotes.forEach((note, index)=>{

        heldNotesText +=note + " "
    })

    heldNotesElement.innerHTML=heldNotesText + "&nbsp;"


    lastDetectedChords = Tonal.Chord.detect(Array.from(currentlyHeldNotes));
    heldChordElement.innerHTML = lastDetectedChords.join(" or ") + "&nbsp;";
}

function checkIfCorrectAndProceed()
{
    //Tonal represents major chords with a capital "M" at the end, e.g. EM instead of E.
    //bring it to format
    let expectedChord = chordToPlay;
    if(chordToPlay.length===1)
    {
        expectedChord+="M";
    }else if(chordToPlay.length===2 && chordToPlay.endsWith("#"))
    {
        expectedChord+="M";
    }


    //tonal sometimes gives different chord results depending on the order of notes passed
    //in chord detector (which does not make any sens really - it seems it ignores the octave number in them)
    //so sometimes it gives slash chords (https://en.wikipedia.org/wiki/Slash_chord)
    // instead of regular ones. Lets just count them as regular.
    //to do this we will split the slash chord and get only the first part of it.
    //todo: maybe we should order the notes by their correct octave starting with C before detecting the chord?
    let detectedChords=[];
    lastDetectedChords.forEach((ch, i) => {
        if(ch.indexOf("/") <0 )
        {
            detectedChords.push(ch)
        }
        else{
            detectedChords = detectedChords.concat(ch.split("/")[0])
        }
    })


    if(detectedChords.includes(expectedChord))
    {
        console.log(`Correct! Expected: ${expectedChord}; Got: ${detectedChords}; Raw: ${lastDetectedChords}`)
        let nextChord = getNextRandomChord();
        while (nextChord===chordToPlay)
        {
            //we should not show to similar chords in a row
            nextChord = getNextRandomChord();
        }
        chordToPlay = nextChord;
        redrawChordToPlay();

        notyf.success("Correct!");
    }
    else {
        console.log(`Incorrect. Expected: ${expectedChord}; Got: ${detectedChords}; Raw: ${lastDetectedChords}`)
    }



}