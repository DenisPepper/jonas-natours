const queryPatterns = ['gte', 'gt', 'lte', 'lt'];

const obj = {
  difficulty: 'easy',
  duration: { gte: 5, lte: 5, gt: 5, lt: 5 },
  price: { gte: 5, lte: 5, gt: 5, lt: 5 },
};

let queryString = JSON.stringify(obj);

/* const gte = 'gte';
const p = `\\b${gte}\\b`;
const reg = new RegExp(p, 'g');
console.log(queryString.replace(reg, '$gte')); */

queryPatterns.forEach((pattern) => {
  const regExp = new RegExp(`\\b${pattern}\\b`, 'g');
  queryString = queryString.replace(regExp, `$${pattern}`);
});

console.log(queryString);
