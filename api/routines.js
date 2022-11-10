const express = require('express');
const { getAllRoutines, createRoutine } = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// GET /api/routines
router.get("/", async (req, res, next) =>{
    try {
        const allRoutines = await getAllRoutines();

        res.send(allRoutines);
    } catch (err) {
        next(err);
    }
})

// POST /api/routines
router.post("/", requireUser, async (req,res,next) => {
    const { isPublic, name, goal } = req.body;
    console.log(req.user, "this is the user")
    console.log(req.user.id, "this is the user id")
    const creatorId = req.user.id

    try {
        const newRoutine = await createRoutine({creatorId, isPublic, name, goal})
        res.send(newRoutine)
    } catch (err) {
        next(err)
    }
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
