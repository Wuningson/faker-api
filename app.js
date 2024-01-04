const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userData = require('./user-data.json');
const moment = require('moment');

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.get('/', async (req, res) => {
  res.send(`I'm alive yay... 🙃🙃🙃`);
});

app.get('/api/v1/users', (req, res) => {
  const {
    page,
    size,
    organization,
    username,
    email,
    date,
    phoneNumber,
    status
  } = req.query;

  const skip = !isNaN(Number(page)) ? Number(page) : 1;
  const limit = !isNaN(Number(size)) ? Number(size) : 10;

  const start = (skip - 1) * limit;
  const end = start + limit;

  let data = userData;

  if (organization) {
    data = data.filter((datum) => datum.organization === organization);
  }

  if (username) {
    data = data.filter((datum) =>
      datum.username.toLowerCase().includes(username.toLowerCase())
    );
  }

  if (status) {
    data = data.filter((datum) => datum.status === status);
  }

  if (email) {
    data = data.filter((datum) =>
      datum.email.toLowerCase().indexOf(email.toLowerCase())
    );
  }

  if (date) {
    data = data.filter((datum) => {
      const start = moment(date).startOf('day');
      const end = moment(date).endOf('day');

      return moment(datum.dateJoined).isBetween(start, end);
    });
  }

  if (phoneNumber) {
    data = data.filter((datum) => datum.phoneNumber === phoneNumber);
  }

  const result = data.slice(start, end);

  return res.status(200).json({
    page: skip,
    size: limit,
    data: result,
    count: data.length,
    message: 'users fetched successfully'
  });
});

app.get('/api/v1/users/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: 'invalid id passed'
    });
  }

  const data = userData.find(({ id: userId }) => userId === id);

  if (!data) {
    return res.status(404).json({
      message: 'user not found'
    });
  }

  return res.status(200).json({
    data,
    message: 'user fetched successfully'
  });
});

app.get('/api/v1/organizations', (req, res) => {
  const organizations = [];
  userData.forEach((datum) => {
    organizations.push(datum.organization);
  });

  const result = Array.from(new Set(organizations));

  return res.status(200).json({
    data: result,
    message: 'organizations fetched successfully'
  });
});

const PORT = process.env.PORT || '8080';

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
