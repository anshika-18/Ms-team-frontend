const mongoose=require('mongoose')

//store participants in each room
const roomSchema=new mongoose.Schema({
    roomId:{
        type:String
    },
    name:{
        type:String
    },
    participants:[{
            email:{
                type:String
            },
            name:{
                type:String
            }
    }]
})

module.exports=mongoose.model('Room',roomSchema)
