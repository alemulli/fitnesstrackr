const express = require('express');
const router = express.Router();
const { 
    createUser, 
    getUser,
    getUserByUsername 
} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require('./utils')

// POST /api/users/login
router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    } else {
  
    try {
      const user = await getUser({username, password});
  
      if (user) {
        // create token & return to user
        const token = jwt.sign(
          {
            id: user.id,
            username,
          },
          JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );
        res.send({ user, token, message: "you're logged in!" });
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }});
  
// POST /api/users/register
router.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
      if (_user) {
        next({
          name: "UserExistsError",
          message: `User ${username} is already taken.`,
        });
      }
        else if (password.length <= 8) {
            next({
                name: "You need more password",
                message: "Password Too Short!"
            })
        }
        else{
      const user = await createUser({
        username,
        password,
      });

     
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );
  
      res.send({
        message: "thank you for signing up",
        token: "any string",
        user:{ id:user.id , username:user.username}
      });
    }
    } catch (err) {
      next(err);
    }
  });

// GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  console.log(req.user, "what is this saying?")
  const username = req.user.username
  

    try {

        const userInfo = await getUserByUsername(username);
        res.send(userInfo) 
    }
    catch (err) {
      next(err);
    }
});

// GET /api/users/:username/routines

module.exports = router;
