const express = require("express");
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const allRoutines = await getAllRoutines();

    res.send(allRoutines);
  } catch (err) {
    next(err);
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const creatorId = req.user.id;

  try {
    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });
    res.send(newRoutine);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/routines/:routineId
router.patch("/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  const { isPublic, name, goal } = req.body;

  try {
    const checkingRoutineId = await getRoutineById(id);

    if (checkingRoutineId.creatorId === req.user.id) {
      const changeRoutine = await updateRoutine( {id, isPublic, name, goal} );

      res.send(changeRoutine);
    } else {
      res.status(403);
      next({
        message: `User ${req.user.username} is not allowed to update ${checkingRoutineId.name}`,
        name: "error error",
      });
    }
  } catch (err) {
    next(err);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:id", requireUser, async (req, res, next) => {
  const { id } = req.params;
  try {
    const checkingRoutineId = await getRoutineById(id);
    if (checkingRoutineId.creatorId === req.user.id) {
      const deleteRoutine = await destroyRoutine(id);

      res.send(checkingRoutineId);
    } else {
      res.status(403);
      next({
        message: `User ${req.user.username} is not allowed to delete ${checkingRoutineId.name}`,
        name: "error error",
      });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  const { routineId, activityId, count, duration } = req.body;

  const [checkingActivity] = await getRoutineActivitiesByRoutine({
    id: routineId,
  });
  console.log(checkingActivity, "checking activity")

    if (checkingActivity &&
      checkingActivity.activityId === activityId &&
      checkingActivity.routineId === routineId
    ) {
      console.log("are we makng it here instead?")
      next({
        name: "You can't do that!",
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      });
    }
   else {
    try {
      console.log("are we making it this far?")
      const addingActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      console.log(addingActivity)
      res.send(addingActivity);
    } catch (err) {
      next(err);
    }
  }
});

module.exports = router;
