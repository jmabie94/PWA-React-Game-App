const { model, Schema } = require('mongoose');

const messageSchema = new Schema ({
    text:{
        type: String,
    }, 
    createdBy:{
        type: String,
    },
})

const Message = model('Message', messageSchema)

module.exports = Message