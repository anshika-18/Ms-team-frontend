const mongoose=require('mongoose')
const Schema=mongoose.Schema

//mongoose schema for user register
const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:mongoose.now()
    }
})

module.exports = mongoose.model('User',userSchema)
