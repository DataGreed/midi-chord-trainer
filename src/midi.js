// Enable WEBMIDI.js and trigger the onEnabled() function when ready
WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));

let deviceElement;
let chordToPlayElement;
let heldNotesElement;

let currentlyHeldNotes;
let currentlyHeldKeys;

// Function triggered when WEBMIDI.js is ready
function onEnabled() {

    deviceElement = document.getElementById("midi-devices");
    chordToPlayElement = document.getElementById("chord-to-play");
    heldNotesElement = document.getElementById("held-notes");

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
    mySynth.channels[1].addListener("noteon", e => {
        document.body.innerHTML+= `${e.note.name} ${e.note.identifier}<br>`;
        console.log(e.note);
    });

    chordToPlayElement.innerHTML = getNextRandomChord()

}