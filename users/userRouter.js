const express = require('express');
//add dependencies
const Users = require("./userDb");
const Posts = require("../posts/postDb");
//var knex = require('knex')(config);

const router = express.Router();

//may have to use req.params.id
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
  const postInfo = {...req.body, user_id: req.params.id}
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

router.get('/:id', validateUserId, (req, res, next) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err.message})
  })
});

router.delete('/:id', (req, res) => {
  Users.remove(req.params.id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: err.messsage})
  })
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.user.id, req.body)
    .then(confirmation => {
      if (confirmation > 0) {
        res.status(201).json({ message: "User was successfully updated." });
      } else {
        res.status(500).json({ error: "There was an error updating the user." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error updating the user." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user && user.id) {
        req.user = user;
        console.log(user);
        next();
      } else {
        console.log("Error");
        res.status(400).json({  message: "Invalid user id." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err.message})
    })
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
