import mongoose from "mongoose";

const Login = new mongoose.Schema({
  
 
    email:{
        type: String, 
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String, required:true,
        
    }

})

Login.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options){
        ret.dbID = ret._id;
        delete ret.id
        delete ret._id;
        delete ret.__v;
    }
})


const LoginSchema = mongoose.model('Login', Login)

export default LoginSchema