const fs = require('fs');
const express = require('express');
const port = 3000;
const routes = {
  home: '/',
  tours: '/api/v1/tours',
};

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`));

const app = express();

app.get(routes.tours, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
});

/* 
app.get(routes.home, (req, res) => {
  res.status(200).json({ message: 'welcome to home page', app: 'Natours app' });
});

app.post(routes.home, (req, res) => {
  res.status(404).send('Stop doing this...');
});
 */
app.listen(port, () => console.log(`server run on ${port} port ...`));
