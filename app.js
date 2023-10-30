const express = require('express');
const port = 3000;
const routes = {
  home: '/',
};

const app = express();

app.get(routes.home, (req, res) => {
  res.status(200).send('welcome to home page');
});

app.listen(port, () => console.log(`server run on ${port} port ...`));
