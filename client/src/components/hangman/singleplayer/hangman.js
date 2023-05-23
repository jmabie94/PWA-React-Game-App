import React, { useState, useEffect } from 'react';
import hangman0 from '../../images/hangmanIMG/hangman0.png';
import hangman1 from '../../images/hangmanIMG/hangman1.png';
import hangman2 from '../../images/hangmanIMG/hangman2.png';
import hangman3 from '../../images/hangmanIMG/hangman3.png';
import hangman4 from '../../images/hangmanIMG/hangman4.png';
import hangman5 from '../../images/hangmanIMG/hangman5.png';
import hangman6 from '../../images/hangmanIMG/hangman6.png';
import './style.css';

const images = [hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];
const words = ['javascript', 'hangman', 'programming', 
              'computer', 'internet', 'technology',
              'HTML', 'CSS', 'database', 'mongodb'];

const SoloHangman = () => {
  const [chosenWord, setChosenWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [message, setMessage] = useState('');
  const [hangmanImage, setHangmanImage] = useState(hangman0);
  const [wordText, setWordText] = useState('');

  useEffect(() => {
    getRandomWord();
  }, []);

  useEffect(() => {
    updateWordText();
  }, [chosenWord, guessedLetters]);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setChosenWord(words[randomIndex].toUpperCase());
  };

  const updateWordText = () => {
    const underline = '_';
    const updatedWordText = chosenWord
      .split('')
      .map((letter) => (guessedLetters.includes(letter) ? letter : underline))
      .join(' ');

    setWordText(updatedWordText);

    if (updatedWordText === chosenWord) {
      setMessage('Congratulations! You won!');
    }
  };

  const displayLetters = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const sortedAlphabet = alphabet.split('').sort();
  
    const rows = [[], [], []];
    const lettersPerRow = Math.ceil(sortedAlphabet.length / 3);
  
    sortedAlphabet.forEach((letter, index) => {
      const rowIndex = Math.floor(index / lettersPerRow);
      rows[rowIndex].push(letter);
    });
  
    return (
      <>
        {rows.map((row, index) => (
          <div className="letter-row" key={index}>
            {row.map((letter) => (
              <button
                key={letter}
                className={`letter-btn ${guessedLetters.includes(letter) ? 'guessed' : ''} ${wrongLetters.includes(letter) ? 'wrong' : ''}`}
                disabled={wrongLetters.includes(letter) || guessedLetters.includes(letter)}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </>
    );
  };
  
  

  const updateHangmanImage = () => {
    const numWrong = wrongLetters.length;
    const imageIndex = Math.min(numWrong, images.length - 1);
    setHangmanImage(images[imageIndex]);

    if (numWrong === 6) {
      setMessage(`You lost! The word was "${chosenWord}".`);
    }
  };

  const handleLetterClick = (letter) => {
    letter = letter.toUpperCase();

    if (chosenWord.includes(letter)) {
      if (!guessedLetters.includes(letter)) {
        setGuessedLetters((prevLetters) => [...prevLetters, letter]);
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        setWrongLetters((prevLetters) => [...prevLetters, letter]);
        updateHangmanImage();
      }
    }
  };

  const resetGame = () => {
    getRandomWord();
    setGuessedLetters([]);
    setWrongLetters([]);
    setMessage('');
    setHangmanImage(hangman0);
  };

  return (
    <div className="hangman">
      <img id="hangman-img" src={hangmanImage} alt="hangman" />
      <div id="word" className="word">
        {wordText}
      </div>
      <div id="letters">{displayLetters()}</div>
      <div id="message">{message}</div>
      <button id="reset-btn" className="btn" onClick={resetGame}>
        New Game
      </button>
    </div>
  );
};

export default SoloHangman;
