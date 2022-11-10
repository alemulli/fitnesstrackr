const express = require('express');
const { 
    getAllRoutines, 
    createRoutine,
    getRoutineById, 
    updateRoutine,
    destroyRoutine
} = require('../db');
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
    const creatorId = req.user.id

    try {
        const newRoutine = await createRoutine({creatorId, isPublic, name, goal})
        res.send(newRoutine)
    } catch (err) {
        next(err)
    }
})

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
const {routineId} = req.params;
const {isPublic, name, goal } = req.body;

const updateFields = {};

if (isPublic) {
    updateFields.isPublic = Boolean(isPublic);
}

if (name) {
    updateFields.name = name;
}

if (goal) {
    updateFields.goal = goal;
}

try {
    const checkingRoutineId = await getRoutineById(routineId);

    if (checkingRoutineId.creatorId === req.user.id) {
        const changeRoutine = await updateRoutine({id:routineId, updateFields})

        res.send(changeRoutine)
    }
    else {
        res.status(403)
        next ({
            message: `User ${req.user.username} is not allowed to update ${checkingRoutineId.name}`,
            name: "error error"
        })
    }

}catch (err) {
    next(err);
  }
});

// DELETE /api/routines/:routineId
router.delete("/:id", requireUser, async (req, res, next) => {
    const {id} = req.params;
    try {
        const checkingRoutineId = await getRoutineById(id)
        if (checkingRoutineId.creatorId === req.user.id ) {
            const deleteRoutine = await destroyRoutine(id)

            res.send(checkingRoutineId)
        }
        else {
            res.status(403)
        next ({
            message: `User ${req.user.username} is not allowed to delete ${checkingRoutineId.name}`,
            name: "error error"
        })
        }
    } catch (err) {
        next(err);
      }
})

// POST /api/routines/:routineId/activities

module.exports = router;
