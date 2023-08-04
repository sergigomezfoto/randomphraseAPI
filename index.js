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
  
      // Check if it's possible to generate num unique phrases
      if (num > data.person.length || num > data.action.length || num > data.place.length) {
        res.status(400).json({ error: "Can't generate the requested number of unique phrases" });
        return;
      }
  
      let usedPersons = new Set();
      let usedActions = new Set();
      let usedPlaces = new Set();
  
      let phrases = [];
      for (let i = 0; i < num; i++) {
        let randomPerson, randomAction, randomPlace;
        let randomPhrase;
        let attempts = 0;
  
        do {
          do {
            randomPerson = data.person[getRandomIndex(data.person)];
          } while (usedPersons.has(randomPerson));
  
          do {
            randomAction = data.action[getRandomIndex(data.action)];
          } while (usedActions.has(randomAction));
  
          do {
            randomPlace = data.place[getRandomIndex(data.place)];
          } while (usedPlaces.has(randomPlace));
  
          if (!randomPerson || !randomAction || !randomPlace) {
            throw new Error("Failed to generate a random phrase");
          }
          const capitalizedRandomPerson = randomPerson.charAt(0).toUpperCase() + randomPerson.slice(1);
          randomPhrase = `${capitalizedRandomPerson.trim()} ${randomAction.trim()} ${randomPlace.trim()}`;
          attempts++;
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
      console.error(error);
      res.status(500).json({ error: `Error generating the random phrases: [ ${error} ]` });
    }
  });

// Iniciar el servidor a 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});
