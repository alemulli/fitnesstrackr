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
router.patch("/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { count, duration } = req.body;
  const userId = req.user.id;

  try {
    const checkCanEditRoutineActivities = await canEditRoutineActivity(
      id,
      userId
    );
    if (checkCanEditRoutineActivities) {
      const changeRoutineActivity = await updateRoutineActivity({
        id,
        count, duration
      });
      res.send(changeRoutineActivity);
    } else {
        const theActivityRoutine = await getRoutineActivityById(id);
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
