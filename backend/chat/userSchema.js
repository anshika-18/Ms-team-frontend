const mongoose=require('mongoose')

//store details of each user about which rooms user is a part of
const userSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    rooms:[{
        roomId:{
            type:String
        },
        name:{
            type:String
        }
    }]
})

module.exports=mongoose.model('Participant',userSchema);
