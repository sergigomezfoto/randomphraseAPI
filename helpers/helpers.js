//helper per tenir un index random d'un array.
const getRandomIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};

//helper que ajuda a comprovar si s'ha fet servir una part de la frase
const getRandomUnusedItem = (set, data) => {
  let item;
  do {
    item = data[getRandomIndex(data)];
  } while (set.has(item));
  return item;
};


module.exports = {
  getRandomUnusedItem
};