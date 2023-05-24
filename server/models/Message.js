const { model, Schema } = require('mongoose');

const messageSchema = new Schema ({
    text:{
        type: String,
        minlength: 1,
    }, 
    createdBy:{
        type: String,
    },
})

const Message = model('Message', messageSchema)

module.exports = Message