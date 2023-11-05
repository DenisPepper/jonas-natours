const queryPatterns = ['gte', 'gt', 'lte', 'lt'];

const regExpString = queryPatterns.reduce(
  (acc, pattern, index) =>
    `${acc}${pattern}${index < queryPatterns.length - 1 ? '|' : ')\\b'}`,
  '\\b(',
);
const regExp2 = new RegExp(regExpString, 'g');
console.log(regExp2);

const obj = {
  difficulty: 'easy',
  duration: { gte: 5, lte: 5, gt: 5, lt: 5 },
  price: { gte: 5, lte: 5, gt: 5, lt: 5 },
};

let queryString = JSON.stringify(obj);

queryString = queryString.replace(regExp2, (match) => `$${match}`);
console.log(queryString);
