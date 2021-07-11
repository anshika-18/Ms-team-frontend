const Message=require('./chatSchema')

module.exports=(app)=>{

    //save new message to database
    app.post('/newMess',(req,res)=>{
        const {roomId,name,mess,email}=req.body;
        //first find Object with roomId 
        Message.findOne({roomId})
            .then(data=>{
                //if found then just push new mess to it
                if(data)
                {
                    data.message.push({
                        email,
                        name,
                        mess
                    })
                    data.save()
                        .then(success=>{
                            return res.status(200).json(success)
                        })
                        .catch(err=>{
                            return res.status(401).json(err)
                        })
                }
                else
                {
                    //if not found then create new Object 
                    //it implies its a first mess in this room
                    const newChat=new Message({
                        roomId,
                        message:[{
                                email,
                                name,
                                mess
                            }]
                    })
                    newChat.save()
                        .then(success=>{
                            return res.status(200).json(success)
                        })
                        .catch(err=>{
                            return res.status(404).json(err)
                        })
                }
            })
            .catch(err=>{
                return res.status(400).json(err)
            })
    })

    //get all message of room
    app.get('/allMess/:roomId',(req,res)=>{
        const {roomId}=req.params
        Message.findOne({roomId})
            .then(result=>{
                return res.status(200).json(result);
            })
            .catch(err=>{
                console.log(err)
                return res.status(404).json(err)
            })
    })

}