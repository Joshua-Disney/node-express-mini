// implement your API here
const express = require('express');

const server = express();

server.use(express.json());

const db = require('./data/db.js');

server.get('/', (req, res) => {
  res.send('<h2>Code me, Disney</h2>');
});


// Create new user
server.post('/api/users', (req, res) => {
  const user = req.body;
  if (!user.name || !user.bio) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }

  db
    .insert(user)
    .then(user => {
      res.status(201).json({ user });
    })
    .catch((error) => {
      res.status(500).json({ error: "There was an error while saving the user to the database" });
    })
});

// Get all users
server.get('/api/users', (req, res) => {
  db
    .find()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(error => {
      res.status(500).json({ error: "The users information could not be retrieved." });
    });
});

// Get user by id
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id

  db
    .findById(id)
    .then(user => {
      if (user) {
        res.status(200).json({ user })
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user information could not be retrieved." });
    });
});

// Delete user by id
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;

  db
    .remove(id)
    .then(user => {
      if (user) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user could not be removed" });
    });
});

// Update existing user
server.put('/api/users/:id', (req, res) => {
  const user = req.body;
  const id = req.params.id;

  if (!user.name || !user.bio) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  }

  db
    .update(id, user)
    .then(user => {
      if (user) {
        res.status(200).json({ user })
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The user information could not be modified." })
    })
});

server.listen(4000, () => {
  console.log('\n*** Running on port 4000 ***\n');
});
