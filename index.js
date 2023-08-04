import express from "express";
import data from "./data.json" assert { type: "json" };
import { getRandomUnusedItem } from "./helpers/helpers.js";

import { config } from "dotenv";
config();
const PORT = process.env.PORT || 3000;

const app = express();

// si no es posa maxlen crida l'altra ruta amb un numero equivalent a infinit
app.get("/:num", (req, res) => {
  res.redirect(`/${req.params.num}/400000`);
});

// crida a la api amb tots els paràmetres
app.get("/:num/:maxlen", (req, res) => {
  try {
    const num = parseInt(req.params.num);
    const maxlen = parseInt(req.params.maxlen);

    // Errors en els parametres
    if (isNaN(num) || num < 1) {
      res.status(400).json({ error: "Invalid number of phrases" });
      return;
    }
    if (isNaN(maxlen) || maxlen < 30) {
      res.status(400).json({ error: "Max length too short to generate phrases" });
      return;
    }

    // sets per elminiar repeticions
    let usedPersons = new Set();
    let usedActions = new Set();
    let usedPlaces = new Set();

    let phrases = [];
    for (let i = 0; i < num; i++) {
      let randomPerson, randomAction, randomPlace;
      let randomPhrase;
      let attempts = 0;

      do {
        attempts++;

        randomPerson = getRandomUnusedItem(usedPersons, data.person);
        randomAction = getRandomUnusedItem(usedActions, data.action);
        randomPlace = getRandomUnusedItem(usedPlaces, data.place);

        if (!randomPerson || !randomAction || !randomPlace) {
          throw new Error("Failed to generate a random phrase");
        }

        const capitalizedRandomPerson = randomPerson.charAt(0).toUpperCase() + randomPerson.slice(1);
        randomPhrase = `${capitalizedRandomPerson.trim()} ${randomAction.trim()} ${randomPlace.trim()}`;
      } while (randomPhrase.length > maxlen && attempts < 5000);

      if (attempts === 5000) {
        throw new Error("Failed to generate a phrase within the maximum length");
      }

      usedPersons.add(randomPerson);
      usedActions.add(randomAction);
      usedPlaces.add(randomPlace);
      phrases.push(randomPhrase);
    }

    res.json({ phrases: phrases });
  } catch (error) {
    res.status(500).json({ error: `Error generating the random phrases: [ ${error} ]` });
  }
});

// Iniciar el servidor a 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
