import React, { useState } from "react";
import "./App.css";
import Particles from "./components/Particles.js";
import card1 from "./imgs/1.jpg";
import card2 from "./imgs/2.jpg";
import card3 from "./imgs/3.jpg";
import card4 from "./imgs/4.jpg";
import card5 from "./imgs/5.jpg";
import card6 from "./imgs/6.jpg";
import card7 from "./imgs/7.jpg";
import card8 from "./imgs/8.jpg";
import cardbackp from "./imgs/cardback.png";

type Card = {
  id: number;
  value: number;
  img: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const cardValues = [1, 2, 3, 4, 5, 6, 7, 8];
const images = [card1, card2, card3, card4, card5, card6, card7, card8];

function shuffle(array: any[]) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateCards(): Card[] {
  const cardIds = Array.from({ length: 16 }, (_, i) => i + 1);
  const shuffledValues = shuffle([...cardValues, ...cardValues]);

  return cardIds.map((id) => ({
    id,
    value: shuffledValues[id - 1],
    img: images[shuffledValues[id - 1] - 1] || "test",
    isFlipped: false,
    isMatched: false,
  }));
}

function App() {
  const [cards, setCards] = useState(generateCards());
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);

  function handleCardClick(id: number) {
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === id) {
          return { ...card, isFlipped: true };
        }
        return card;
      })
    );

    setFlippedCardIds((prevIds) => [...prevIds, id]);
  }

  React.useEffect(() => {
    if (flippedCardIds.length !== 2) {
      return;
    }

    const [card1Id, card2Id] = flippedCardIds;
    const [card1, card2] = cards.filter((card) =>
      [card1Id, card2Id].includes(card.id)
    );

    if (card1.value === card2.value) {
      setCards((prevCards) =>
        prevCards.map((card) => {
          if (card.id === card1.id || card.id === card2.id) {
            setMatchedCount(matchedCount + 1);
            return { ...card, isMatched: true };
          }
          return card;
        })
      );
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === card1.id || card.id === card2.id) {
              return { ...card, isFlipped: false };
            }
            return card;
          })
        );
      }, 1000);
    }

    setFlippedCardIds([]);
  }, [cards, flippedCardIds, matchedCount]);

  function resetGame() {
    setCards(generateCards());
    setFlippedCardIds([]);
    setMatchedCount(0);
  }

  const isGameOver = () => {
    return matchedCount === cards.length / 2;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Card Guessing Game</h1>
      <div className="grid grid-cols-4 grid-rows-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card bg-white rounded-lg cardGlow flex items-center justify-center w-full h-full animation transition ease-in-out delay-850${
              card.isFlipped
                ? "transform rotate-y-180 transition ease-in-out delay-850"
                : ""
            } ${
              card.isMatched
                ? "opacity-50 hover:none"
                : "hover:opacity-80 hover:scale-110 "
            }`}
            onClick={() => {
              if (!card.isFlipped && !card.isMatched) {
                handleCardClick(card.id);
              }
            }}
          >
            {card.isFlipped || card.isMatched ? (
              <img
                src={card.img}
                alt={`Card ${card.id}`}
                className="md:w-40 md:h-48 sm:h-32 sm:w-40"
              />
            ) : (
              // <span>{card.value}</span>
              <img
                src={cardbackp}
                alt="Card Back"
                className="md:w-40 md:h-48 sm:h-32 sm:w-40"
              />
            )}
          </div>
        ))}
      </div>
      {isGameOver() && (
        <div className="absolute inset-0 flex justify-center items-center bg-blue-600 bg-opacity-60">
          <div className="text-white text-3xl font-bold">You win!</div>
          <button
            className="mx-4 py-2 px-4 rounded-lg bg-white text-blue-600 font-bold transition-colors hover:bg-blue-600 hover:text-white"
            onClick={() => resetGame()}
          >
            Play again
          </button>
        </div>
      )}
      <Particles id="tsparticles" />
    </div>
  );
}

export default App;
