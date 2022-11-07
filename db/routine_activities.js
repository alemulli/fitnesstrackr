const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [activityId],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id=$1;
    `,
      [id]
    );

    if (!activityId) {
      throw {
        name: "Routine Activity FoundError",
        message: "Could not find a routine activity with that id",
      };
    }

    return activityId;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
        INSERT INTO routine_activities( "routineId", "activityId", count, duration)
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `,
      [routineId, activityId, count, duration]
    );
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
