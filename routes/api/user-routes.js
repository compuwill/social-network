const router = require('express').Router();
const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
  } = require('../../controllers/user-controller');


// Set up GET all and POST at /api/pizzas
router
  .route('/')
  .get(getAllUser)
  .post(createUser);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router
    .route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(removeFriend);


module.exports = router;