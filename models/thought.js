const {Schema, model} = require('mongoose');

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
            trim: true
        },
        createdAt:{
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
          }
    }
)

// create the Thought model using the ThoughtSchema
const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;