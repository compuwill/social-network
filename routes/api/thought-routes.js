const router = require('express').Router();
const {
    getAllThought,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
  } = require('../../controllers/thought-controller');


// Set up GET all and POST at /api/thoughts
router
  .route('/')
  .get(getAllThought)
  .post(createThought);

// Set up GET one, PUT, and DELETE at /api/thoughts/:id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// Add a reaction by thought id/reaction
router.route('/:thoughtId').post(addReaction);

router.route('/:thoughtId/:reactionId').delete(removeReaction);

module.exports = router;