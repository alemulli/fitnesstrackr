const express = require('express');
const { getAllActivities } = require('../db');
const router = express.Router();

// GET /api/activities/:activityId/routines

// GET /api/activities

router.get("/activities", async (req, res, next) => {
    try {
        const activities = await getAllActivities()
        console.log(activities)

        res.send(activities)
    } catch (err) {
        next(err)
    }
})

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
