const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  console.log("Creating user ", username, password)
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
      [username, password]
    );

    delete user.password;

    return user;
  } catch (error) {
    console.log(error);
  }
}

async function getUser({ username, password }) {
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

    if (password === user.password) {
      delete user.password;
      return user;
    }
  } catch (error) {
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

    delete user.password;

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
