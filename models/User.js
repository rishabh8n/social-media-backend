const {model,Schema,SchemaTypes} = require('mongoose');

const userSchema =new Schema({
    first: String,
    last: String,
    name: String,
    email: {
        type:String,
        required:true,
        lowercase:true
    },
    password: String,
    sentRequest: {
        type: [SchemaTypes.ObjectId],
        ref: 'User'
    },
    receivedRequest: {
        type: [SchemaTypes.ObjectId],
        ref: 'User'
    },
    friends: {
        type: [SchemaTypes.ObjectId],
        ref: 'User'
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
});

module.exports = model('User',userSchema);