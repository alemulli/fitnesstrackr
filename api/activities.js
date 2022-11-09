const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines

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
    const checkingActivity = await getActivityByName(name);

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

module.exports = router;
