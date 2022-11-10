const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  console.log("Creating user ", username)
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, hashedPassword]
    );

    delete user.password;

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    let passwordsMatch = await bcrypt.compare(password, hashedPassword) 
    
  if (passwordsMatch) {
      delete user.password;
      return user;
  } else {
    throw error;

  }} catch (error) {
    console.log(error);
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT id, username, password
      FROM users
      WHERE id=$1
    `, [userId]);

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT id, username, password
      FROM users
      WHERE username=$1
    `, [userName]);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
