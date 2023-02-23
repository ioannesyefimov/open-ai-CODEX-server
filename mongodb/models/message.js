import mongoose from "mongoose";

const Message = new mongoose.Schema({
    messageId: {type: String, required:true, uniqie: true, dropDups: true},
    message: {type:String, required:true},
    time: {type: Date, default: Date.now},
    email:{type:String, required: true},
    prompt: {type:String, required:true}
})

Message.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options){
        ret.dbID = ret._id;
        delete ret.id
        delete ret._id;
        delete ret.__v;
    }
})


const MessageSchema = mongoose.model('Message', Message)

export default MessageSchema