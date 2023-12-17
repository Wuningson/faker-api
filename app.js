const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userData = require('./user-data.json');

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.get('/', async (req, res) => {
  res.send(`I'm alive yay... 🙃🙃🙃`);
});

app.get('/api/v1/users', async (req, res) => {
  const { page, size } = req.query;

  const skip = !isNaN(Number(page)) ? Number(page) : 1;
  const limit = !isNaN(Number(size)) ? Number(size) : 10;

  const start = (skip - 1) * limit;
  const end = start + limit;

  const data = userData.slice(start, end);

  return res.status(200).json({
    data,
    page: skip,
    size: limit,
    count: userData.length
  });
});

const PORT = process.env.PORT || '8080';

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
