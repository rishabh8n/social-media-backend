const {model,Schema,SchemaTypes} = require('mongoose');

const postSchema =new Schema({
    // name: String,
    // email: {
    //     type:String,
    //     required:true,
    //     lowercase:true
    // }
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    likes: {
        type: [SchemaTypes.ObjectId],
        ref: 'User'
    },
    createdAt: {
        type:Date,
        default: Date.now
    }
});

module.exports = model('Post',postSchema);