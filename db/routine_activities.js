const client = require("./client");
const { getRoutineById } = require("./routines")

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
    console.log(error)
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
    console.log(error)
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {
      rows: routineActivities,
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1;
    `,
      [id]
    );

    return routineActivities;
  } catch (error) {
    console.log(error)
  }
}

async function updateRoutineActivity(params) {
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
    UPDATE routine_activities
    SET ${setString}
    WHERE id=${id}
    RETURNING*;
    `,
      Object.values(fields)
    );
    const {rows: [routineActivity],} = request
    
    return routineActivity;
  } catch (error) {
    console.log(error)
  }
}

async function destroyRoutineActivity(id) {
  
  try {
    const {
      rows: [routineActivities],
    } = await client.query(
      `
      DELETE FROM routine_activities WHERE id=$1
      RETURNING *;
      `,
      [id]
    );

    return routineActivities;
  } catch (error) {
    console.log(error)
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const theRoutineActivity = await getRoutineActivityById(routineActivityId)
    const routineId = theRoutineActivity.routineId
  
    const theRoutine = await getRoutineById(routineId)
    if (theRoutine.creatorId === userId) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
