const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  updateActivity,
  getActivityById,
  getPublicRoutinesByActivity
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
router.get("/:id/routines", async (req, res, next) => {
    const { id } = req.params;
    const checkingActivityId = await getActivityById(id);

    if (checkingActivityId) {
      try {
        const allActivityRoutines = await getPublicRoutinesByActivity({ id })
  
        res.send(allActivityRoutines)
      } catch (err) {
        next(err)
      } 
    }
    else {
        next({
            message: `Activity ${id} not found`,
            name: "activity not found"
        })
    }
  })
  

// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch (err) {
    next(err);
  }
});

// POST /api/activities
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const checkingActivity = await get(name);

    if (checkingActivity) {
      next({
        name: "activity already exists",
        message: `An activity with name ${name} already exists`,
      });
    }
    const newActivity = await createActivity({ name, description });

    res.send(newActivity);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }

  try {
    const checkingActivityId = await getActivityById(activityId);

    if (checkingActivityId) {
      const checkingActivityName = await getActivityByName(name);

      if (checkingActivityName) {
        next({
          message: `An activity with name ${name} already exists`,
          name: "pick a new name",
        });
      } else {
        const changeActivity = await updateActivity({id:activityId, updateFields});

        res.send(changeActivity);
      }

    } else {
      next({
        message: `Activity ${activityId} not found`,
        name: "activity not found",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
