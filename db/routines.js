const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT *
    FROM routines
    WHERE id=$1;
    `,
      [id]
    );

    if (!routine) {
      throw {
        name: "RoutineNotFoundError",
        message: "Could not find a routine with that id",
      };
    }

    return routine;
  } catch (error) {
    console.log(error)
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routineNames } = await client.query(
      `
      SELECT *
      FROM routines;
    `
    );

    return routineNames;
  } catch (error) {
    console.log(error)
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id;
    `
    );

    // const { rows: [ username ] } = await client.query(`
    //   SELECT username
    //   FROM users
    // `)

    // console.log(username, "username")

    // routines.creatorName = username.username

    // console.log(routines.creatorName, "routines.creatorName")

    const withActivities = await attachActivitiesToRoutines(routines);

    return withActivities;
  } catch (error) {
    console.log(error)
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE users.username = $1;
    `,
      [username]
    );

    const withActivities = await attachActivitiesToRoutines(routines);

    return withActivities;
  } catch (error) {
    console.log(error)
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE users.username = $1 AND "isPublic"=true;
    `,
      [username]
    );

    const withActivities = await attachActivitiesToRoutines(routines);

    return withActivities;
  } catch (error) {
    console.log(error)
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE "isPublic"=true
    `
    );

    const withActivities = await attachActivitiesToRoutines(routines);

    return withActivities;
  } catch (error) {
    console.log(error)
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routine_activities."routineId"=routines.id
      WHERE routines."isPublic"=true
      AND routine_activities."activityId"=$1;
    `,
      [id]
    );

    const withActivities = await attachActivitiesToRoutines(routines);

    return withActivities;
  } catch (error) {
    console.log(error)
  }
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    console.log(error)
  }
}

async function updateRoutine(params) {
  const {id, updateFields: fields} = params
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const request = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING*;
    `,
      Object.values(fields)
    );
    const {rows: [routines],} = request

    return routines;
  } catch (error) {
    console.log(error)
  }
}

async function destroyRoutine(id) {
  try {
    const {
      rows: [routine_activities],
    } = await client.query(
      `
      DELETE FROM routine_activities WHERE "routineId"=$1
      `,
      [id]
    );
    

    const {
      rows: [routine],
    } = await client.query(
      `
      DELETE FROM routines WHERE id=$1
    `,
      [id]
    );

    return routine;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
