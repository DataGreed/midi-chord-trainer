let chordsToTrain = [
    "A", "Am",
    "A#", "A#m",
    "B", "Bm",
    "C", "Cm",
    "C#", "C#m",
    "D", "Dm",
    "D#", "D#m",
    "E", "Em",
    "F", "Fm",
    "F#", "F#m",
    "G", "Gm",
    "G#", "G#m",
]

/**
 * Returns random element from the passed array
 */
function getRandomElement(arr)
{
    return arr[Math.floor(Math.random()*arr.length)]
}

/**
 * Returns a chord to play next
 */
function getNextRandomChord()
{
    return getRandomElement(chordsToTrain)
}