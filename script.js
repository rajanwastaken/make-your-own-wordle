// importing WORDS as the correct guesses and dictionary as a list of every single word to check from

import { WORDS } from "./guess.js";
import { dictionary } from './words.js';

let correctWord = WORDS[Math.floor(Math.random() * WORDS.length)]
let currentGuess = [];
let nextLetter = 0;
// you can change how many guesses they have available, or make it dynamic through `correctWord.length` for example 
const guesses = 6;
let guessesRemaining = guesses;

// this puts the correct word into the console. once you deploy to production, make sure to remove this!
console.log(correctWord)

// setting up the layout & canvas
function wordle() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < guesses; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < correctWord.length; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

// determining the colour of the keyboard after right or wrong
function keyboard(letter, color) {
    for (const elem of document.getElementsByClassName("key")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

// removing a letter from the input
function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

// determining whether it matches our correctWord
function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(correctWord)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != correctWord.length) {
        toastr.error("Not enough letters!")
        return
    }

    if (!dictionary.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    // creating the layout of boxes
    for (let i = 0; i < correctWord.length; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = '#1a1a1a';
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = '#628b55';
            } else {
                letterColor = '#fcba03';
            }

            rightGuess[letterPosition] = "#"
        }

        setTimeout(()=> {
            box.style.backgroundColor = letterColor
            keyboard(letter, letterColor)
        })
    }

    if (guessString === correctWord) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.info(`Game over! The right word was: "${correctWord}"`)
        }
    }
}

// adding letters based on what letter is clicked / typed
function insertLetter (pressedKey) {
    if (nextLetter === correctWord.length) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

		// the row that is being typed is determined by the number of guesses remaining
    let row = document.getElementsByClassName("letter-row")[guesses - guessesRemaining]
    let box = row.children[nextLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

// determining what key is pressed bassed on its layout
document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }
	// allowing any key from a-z or the '-' using regex'
    let found = pressedKey.match(/[a-z\-]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

// pushing everything to the keyboard in index.html
document.getElementById("keyboard").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("key")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

wordle();