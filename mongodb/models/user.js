import mongoose from "mongoose";

const User = new mongoose.Schema({
  
    name: {type: String, required:true},
    email: {type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    }

})

User.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options){
        ret.dbID = ret._id;
        delete ret.id
        delete ret._id;
        delete ret.__v;
    }
})


const UserSchema = mongoose.model('User', User)

export default UserSchema