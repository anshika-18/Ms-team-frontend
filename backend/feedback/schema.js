const mongoose=require('mongoose')

//save data collected from feedback
const feedback=new mongoose.Schema({
        email:{
                type:String
        },
        rating:{
                type:String
        }
})

module.exports=mongoose.model('feedback',feedback);
