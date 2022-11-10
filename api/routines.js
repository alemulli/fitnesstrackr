const express = require('express');
const { getAllRoutines } = require('../db');
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

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
