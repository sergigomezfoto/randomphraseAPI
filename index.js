import express from "express";
import data from "./data.json" assert { type: "json" };
import { config } from 'dotenv';
config();
const PORT = process.env.PORT || 3000;


const app = express();

const getRandomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

// si no es posa maxlen crida l'altra ruta amb un numero cap a infinit
app.get("/:num", (req, res) => {
  res.redirect(`/${req.params.num}/400000`);
});

// crida a la api
app.get("/:num/:maxlen", (req, res) => {
  try {
    const num = parseInt(req.params.num);
    const maxlen = parseInt(req.params.maxlen);

    // Errors en els parametres
    if (isNaN(num) || num < 1) {
      res.status(400).json({ error: "Invalid number of phrases" });
      return;
    }
    // sila frase té menys de 30 caracters, és massa curta
    if (isNaN(maxlen) || maxlen < 30) {
      res.status(400).json({ error: "Max length too short to generate phrases" });
      return;
    }

    let phrases = [];
    for (let i = 0; i < num; i++) {
      let randomPhrase;
      let attempts = 0; // pel bucle do while

      do {
        const randomPerson = data.person[getRandomIndex(data.person)];
        const randomAction = data.action[getRandomIndex(data.action)];
        const randomPlace = data.place[getRandomIndex(data.place)];
        if (!randomPerson || !randomAction || !randomPlace) {
          throw new Error("Failed to generate a random phrase");
        }

        randomPhrase = `${randomPerson.trim()} ${randomAction.trim()} ${randomPlace.trim()}`;
        attempts++;
      } while (randomPhrase.length > maxlen && attempts < 5000); // limito el número de intents per evitar un bucle infinit, i tiro l'error a sota.

      if (attempts === 5000) {
        throw new Error("Failed to generate a phrase within the maximum length");
      }

      phrases.push(randomPhrase);
    }
    res.json({ phrases: phrases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error generating the random phrases: [ ${error} ]` });
  }
});

// Iniciar el servidor a 3000
app.listen(PORT, () => {
  console.log(`Server is running on port 3000 ${PORT}`);
});
