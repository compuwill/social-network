const { User, Thought } = require('../models');

const userController = {
    // get all users
    getAllUser(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // createUser
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },


    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                //delete all thoughts related to user
                dbUserData.thoughts.forEach( element => {
                    Thought.findByIdAndDelete(element._id, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                })
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },


    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                //add the friend to the other friend
                User.findOneAndUpdate(
                    { _id: params.friendId },
                    { $push: { friends: params.userId } }
                )
                    .then(dbFriendData => {
                        if (!dbFriendData) {
                            res.status(404).json({ message: 'No friend found with this id!' });
                            return;
                        }
                        res.json({message: dbUserData.username + ' is now friends with '+dbFriendData.username});
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends:  params.friendId  } }
        )
            .then(dbUserData => {
                //remove user from friends list
                User.findOneAndUpdate(
                    { _id: params.friendId },
                    { $pull: { friends:  params.userId  } }
                )
                    .then(dbFriendData => {                        
                        res.json({message: dbUserData.username + ' is no longer friends with '+dbFriendData.username});
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    }



}

module.exports = userController;