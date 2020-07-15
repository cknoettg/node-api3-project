const express = require('express');
//add dependencies
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.post('/:id/posts', (req, res) => {
  const postInfo = {...req.body, user_id: req.id}
  Posts.insert(postInfo)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.get('/', (req, res) => {
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.get('/:id', (req, res) => {
  Users.getById(req.id)
  .then(user => {
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({error: err.message})
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.get('/:id/posts', (req, res) => {
  Users.getUserPosts(req.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.delete('/:id', (req, res) => {
  Users.remove(req.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: err.messsage})
  })
});

router.put('/:id', (req, res) => {
  Users.update(req.id, req.body)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  if(req.id) {
    req.user = req.id;
    next();
  } else {
    res.status(400).json({message: "invalid user id"})
  }
}

function validateUser(req, res, next) {
  if(req.body) {
    next()
  } else if (req.body && !req.body.name) {
    res.status(400).json({message: "missing required name field"})
  } else {
    res.status(400).json({message: "missing user data"})
  }
}

function validatePost(req, res, next) {
  if(req.body) {
    next()
  } else if (req.body && !req.body.text) {
    res.status(400).json({message: "missing required text field"})
  } else {
    res.status(400).json({message: "missing post data"})
  }
}

module.exports = router;
