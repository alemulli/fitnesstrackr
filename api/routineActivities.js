const express = require("express");
const router = express.Router();
const {
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
  getRoutineById,
  getRoutineActivityById,
} = require("../db");
const { requireUser } = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;
  const userId = req.user.id;

  const updateFields = {};

  if (count) {
    updateFields.count = count;
  }
  if (duration) {
    updateFields.duration = duration;
  }
  try {
    const checkCanEditRoutineActivities = await canEditRoutineActivity(
      routineActivityId,
      userId
    );
    if (checkCanEditRoutineActivities) {
      const changeRoutineActivity = await updateRoutineActivity({
        id: routineActivityId,
        updateFields,
      });
      res.send(changeRoutineActivity);
    } else {
        const theActivityRoutine = await getRoutineActivityById(routineActivityId);
        const theRoutineId = theActivityRoutine.routineId;
        const theRoutine = await getRoutineById(theRoutineId);

      next({
        message: `User ${req.user.username} is not allowed to update ${theRoutine.name}`,
        name: "error",
      });
    }
  } catch (err) {
    next(err);
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const userId = req.user.id;

  try {
    const checkCanEditRoutineActivities = await canEditRoutineActivity(
      routineActivityId,
      userId
    );
    if (checkCanEditRoutineActivities) {
      const deleteRoutineActivity = await destroyRoutineActivity(
        routineActivityId
      );
      res.send(deleteRoutineActivity);
    } else {
      res.status(403);
      const theActivityRoutine = await getRoutineActivityById(routineActivityId);
      const theRoutineId = theActivityRoutine.routineId;
      const theRoutine = await getRoutineById(theRoutineId);

      next({
        message: `User ${req.user.username} is not allowed to delete ${theRoutine.name}`,
        name: "error",
      });
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
