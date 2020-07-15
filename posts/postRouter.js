const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get(req.query)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err.message })
  })
});

router.get('/:id', (req, res) => {
  Posts.getById(req.id)
  .then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({error: err.message})
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.delete('/:id', (req, res) => {
  Posts.remove(req.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log(err);
    res.status(404).json({error: err.message})
  })
});

router.put('/:id', (req, res) => {
  Posts.update(req.params.id, req.body)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

// custom middleware
function validatePostId(req, res, next) {
  if(req.id) {
    next();
  } else {
    res.status(400).json({message: "Invalid post id"})
  }
}

module.exports = router;
