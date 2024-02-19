import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [numberOfRolls, setNumberOfRolls] = React.useState(0);
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      console.log("You won!");
    }
  }, [dice]);

  // Update time elapsed every second
  React.useEffect(() => {
    let intervalId;
    if (gameStarted && !tenzies) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId); // Cleanup function
  }, [gameStarted, tenzies]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setNumberOfRolls((old) => old + 1);
      setGameStarted(true);
    } else {
      setTenzies(false);
      setGameStarted(false);
      setNumberOfRolls(0);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <>
      <div className="container">
        <main>
          {tenzies && <Confetti />}
          <h1 className="title">Tenzies</h1>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
          <p className="instructions">
            <b>Number of Rolls: </b>
            {numberOfRolls}
          </p>
          <p className="instructions">
            <b>Time Elapsed:</b>{" "}
            {gameStarted
              ? `${timeElapsed} seconds`
              : "Click the Roll Button to Start the Timer"}
          </p>
          <div className="dice-container">{diceElements}</div>
          <button className="roll-dice" onClick={rollDice}>
            {tenzies ? "New Game" : "Roll"}
          </button>
        </main>
      </div>
    </>
  );
}

export default App;
